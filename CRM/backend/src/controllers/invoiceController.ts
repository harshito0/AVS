import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

function generateInvoiceNumber() {
  const now = new Date();
  return `INV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2,'0')}${String(Math.floor(Math.random()*9000)+1000)}`;
}

export async function getInvoices(req: AuthRequest, res: Response) {
  try {
    const { search, status, location, page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search } },
        { clientName: { contains: search } },
      ];
    }
    if (status && status !== 'All') where.status = status;
    if (location && location !== 'All Locations') where.location = { shortName: location };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit), include: { items: true, location: true } }),
      prisma.invoice.count({ where }),
    ]);
    return ok(res, invoices, { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch { return serverError(res); }
}

export async function getInvoice(req: Request, res: Response) {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { items: true, client: true, location: true } });
    if (!invoice) return notFound(res, 'Invoice');
    return ok(res, invoice);
  } catch { return serverError(res); }
}

export async function createInvoice(req: AuthRequest, res: Response) {
  try {
    const { clientId, appointmentId, locationId, clientName, clientEmail, clientPhone, invoiceDate, dueDate, items, tax, discount, paymentMethod, status, notes } = req.body;
    if (!clientName || !items?.length) return fail(res, 'VALIDATION_ERROR', 'Client name and at least one item required');

    const invoiceItems = Array.isArray(items) ? items : [];
    const subtotal = invoiceItems.reduce((s: number, i: any) => s + (parseFloat(i.price) * parseInt(i.quantity)), 0);
    const taxAmount = parseFloat(tax) || 0;
    const discountAmount = parseFloat(discount) || 0;
    const total = subtotal + taxAmount - discountAmount;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: generateInvoiceNumber(),
        clientId: clientId || null,
        appointmentId: appointmentId || null,
        locationId: locationId || null,
        clientName, clientEmail: clientEmail || null, clientPhone: clientPhone || null,
        invoiceDate: invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        subtotal, tax: taxAmount, discount: discountAmount, total,
        paymentMethod: paymentMethod || null,
        status: status || 'Pending',
        notes: notes || null,
        items: { create: invoiceItems.map((i: any) => ({ serviceName: i.service || i.serviceName, quantity: parseInt(i.quantity), price: parseFloat(i.price), amount: parseFloat(i.price) * parseInt(i.quantity) })) },
      },
      include: { items: true, location: true },
    });

    // Update client totalSpent if paid
    if (clientId && status === 'Paid') {
      await prisma.client.update({ where: { id: clientId }, data: { totalSpent: { increment: total } } });
    }

    await prisma.notification.create({ data: { title: 'Invoice Created', message: `${invoice.invoiceNumber} for ${clientName} â€” $${total.toFixed(2)}`, type: 'invoice' } });
    return created(res, invoice);
  } catch { return serverError(res); }
}

export async function updateInvoice(req: AuthRequest, res: Response) {
  try {
    const { status, paymentMethod, notes } = req.body;
    const data: any = {};
    if (status) data.status = status;
    if (paymentMethod !== undefined) data.paymentMethod = paymentMethod;
    if (notes !== undefined) data.notes = notes;
    const invoice = await prisma.invoice.update({ where: { id: req.params.id }, data, include: { items: true } });
    return ok(res, invoice);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Invoice');
    return serverError(res);
  }
}
