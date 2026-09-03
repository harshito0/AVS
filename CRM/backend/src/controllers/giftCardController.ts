import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

function generateCardNumber() {
  const now = new Date();
  const mmddyy = `${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getFullYear()).slice(-2)}`;
  return `GC-AVS-${mmddyy}${String(Math.floor(Math.random()*90)+10)}`;
}

export async function getGiftCards(req: AuthRequest, res: Response) {
  try {
    const { search, status, location, page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};
    if (search) {
      where.OR = [
        { cardNumber: { contains: search } },
        { recipientName: { contains: search } },
        { buyerName: { contains: search } },
      ];
    }
    if (status && status !== 'All') where.status = status;
    if (location && location !== 'All Locations') where.location = { shortName: location };

    const [cards, total] = await Promise.all([
      prisma.giftCard.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit), include: { transactions: { orderBy: { createdAt: 'desc' } }, location: true } }),
      prisma.giftCard.count({ where }),
    ]);
    return ok(res, cards, { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch { return serverError(res); }
}

export async function getGiftCard(req: Request, res: Response) {
  try {
    const card = await prisma.giftCard.findFirst({
      where: { OR: [{ id: req.params.id }, { cardNumber: req.params.id }] },
      include: { transactions: { orderBy: { createdAt: 'desc' } }, location: true },
    });
    if (!card) return notFound(res, 'Gift card');
    return ok(res, card);
  } catch { return serverError(res); }
}

export async function createGiftCard(req: AuthRequest, res: Response) {
  try {
    const { recipientName, buyerName, recipientEmail, buyerEmail, value, expiryDate, locationId, notes } = req.body;
    if (!recipientName || !buyerName || !value) return fail(res, 'VALIDATION_ERROR', 'Recipient, buyer, and value are required');
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return fail(res, 'VALIDATION_ERROR', 'Value must be a positive number');

    const card = await prisma.giftCard.create({
      data: {
        cardNumber: generateCardNumber(),
        recipientName: recipientName.trim(),
        buyerName: buyerName.trim(),
        recipientEmail: recipientEmail || null,
        buyerEmail: buyerEmail || null,
        value: numValue,
        balance: numValue,
        expiryDate: expiryDate || '',
        locationId: locationId || null,
        notes: notes || null,
        status: 'Active',
        transactions: {
          create: [{
            description: 'Gift card issued',
            reference: 'ISSUE',
            debit: 0,
            credit: numValue,
            balance: numValue,
            performedBy: req.user?.email || 'Admin',
          }],
        },
      },
      include: { transactions: true, location: true },
    });

    await prisma.notification.create({ data: { title: 'Gift Card Issued', message: `${card.cardNumber} ($${numValue.toFixed(2)}) issued to ${recipientName}`, type: 'giftCard' } });
    return created(res, card);
  } catch { return serverError(res); }
}

export async function redeemGiftCard(req: AuthRequest, res: Response) {
  try {
    const { amount, reference, description } = req.body;
    const redeemAmount = parseFloat(amount);
    if (!redeemAmount || redeemAmount <= 0) return fail(res, 'VALIDATION_ERROR', 'Redemption amount must be positive');

    const card = await prisma.giftCard.findFirst({
      where: { OR: [{ id: req.params.id }, { cardNumber: req.params.id }] },
    });

    if (!card) return notFound(res, 'Gift card');
    if (card.status === 'Expired') return fail(res, 'GIFT_CARD_EXPIRED', 'This gift card has expired');
    if (card.status === 'Redeemed') return fail(res, 'GIFT_CARD_REDEEMED', 'This gift card has already been fully redeemed');
    if (card.balance <= 0) return fail(res, 'GIFT_CARD_NO_BALANCE', 'This gift card has no remaining balance');
    if (redeemAmount > card.balance) return fail(res, 'INSUFFICIENT_BALANCE', `Redemption amount ($${redeemAmount}) exceeds available balance ($${card.balance})`);

    const newBalance = Math.round((card.balance - redeemAmount) * 100) / 100;
    const newStatus = newBalance === 0 ? 'Redeemed' : 'Partially Used';

    const [updatedCard] = await prisma.$transaction([
      prisma.giftCard.update({
        where: { id: card.id },
        data: { balance: newBalance, status: newStatus },
        include: { transactions: { orderBy: { createdAt: 'desc' } } },
      }),
      prisma.giftCardTransaction.create({
        data: {
          giftCardId: card.id,
          description: description || 'Gift card redeemed',
          reference: reference || '',
          debit: redeemAmount,
          credit: 0,
          balance: newBalance,
          performedBy: req.user?.email || 'Admin',
        },
      }),
    ]);

    await prisma.notification.create({ data: { title: 'Gift Card Redeemed', message: `$${redeemAmount.toFixed(2)} redeemed from ${card.cardNumber}. Remaining: $${newBalance.toFixed(2)}`, type: 'giftCard' } });
    return ok(res, updatedCard);
  } catch { return serverError(res); }
}
