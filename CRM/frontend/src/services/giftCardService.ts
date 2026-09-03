import { GiftCard, GiftCardStatus, GiftCardHistoryItem } from '../types';
import { giftCardsApi } from './apiClient';

function mapGiftCard(c: any): GiftCard {
  return {
    id: c.id,
    cardNumber: c.cardNumber,
    recipient: c.recipientName || c.recipient || 'Valued Guest',
    buyer: c.buyerName || c.buyer || 'Customer',
    recipientEmail: c.recipientEmail || undefined,
    buyerEmail: c.buyerEmail || undefined,
    value: c.value ?? 0,
    balance: c.balance ?? 0,
    status: (c.status || 'Active') as GiftCardStatus,
    expiryDate: c.expiryDate || '',
    createdOn: typeof c.createdAt === 'string' ? c.createdAt.split('T')[0] : (c.createdOn || new Date().toISOString().split('T')[0]),
    location: (c.location?.shortName || c.location || 'Brampton') as 'Brampton' | 'Mississauga',
    notes: c.notes || undefined,
    history: Array.isArray(c.transactions)
      ? c.transactions.map((t: any): GiftCardHistoryItem => ({
          id: t.id,
          date: typeof t.createdAt === 'string' ? t.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          description: t.description || 'Transaction',
          reference: t.reference || '',
          debit: t.debit ?? 0,
          credit: t.credit ?? 0,
          balance: t.balance ?? 0,
          by: t.performedBy || 'Admin'
        }))
      : []
  };
}

export const giftCardService = {
  async getGiftCards(): Promise<GiftCard[]> {
    try {
      const res = await giftCardsApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapGiftCard);
      }
    } catch (e) {
      console.error('[giftCardService] Failed to fetch gift cards from API', e);
    }
    return [];
  },

  async findByCardNumber(cardNumber: string): Promise<GiftCard | undefined> {
    try {
      const cleanNumber = cardNumber.trim().toUpperCase();
      const res = await giftCardsApi.getById(cleanNumber);
      if (res.success && res.data) {
        return mapGiftCard(res.data);
      }
    } catch (e) {
      console.error('[giftCardService] Failed to find gift card', e);
    }
    return undefined;
  },

  async createGiftCard(data: {
    recipient: string;
    buyer: string;
    recipientEmail?: string;
    buyerEmail?: string;
    value: number;
    expiryDate: string;
    location: 'Brampton' | 'Mississauga';
    notes?: string;
  }): Promise<GiftCard> {
    try {
      const res = await giftCardsApi.create({
        recipientName: data.recipient,
        buyerName: data.buyer,
        recipientEmail: data.recipientEmail,
        buyerEmail: data.buyerEmail,
        value: data.value,
        expiryDate: data.expiryDate,
        locationName: data.location,
        notes: data.notes
      });
      if (res.success && res.data) {
        return mapGiftCard(res.data);
      }
    } catch (e) {
      console.error('[giftCardService] Failed to create gift card via API', e);
    }
    throw new Error('Failed to issue gift card');
  },

  async redeemGiftCard(
    cardNumber: string,
    amount: number,
    againstType: string,
    reference: string
  ): Promise<{ success: boolean; card: GiftCard; amountRedeemed: number; remainingBalance: number }> {
    try {
      const cleanNumber = cardNumber.trim().toUpperCase();
      const res = await giftCardsApi.redeem(cleanNumber, {
        amount,
        reference: `${againstType}: ${reference}`,
        description: `Redeemed for ${againstType}`
      });
      if (res.success && res.data) {
        const card = mapGiftCard(res.data);
        return {
          success: true,
          card,
          amountRedeemed: amount,
          remainingBalance: card.balance
        };
      } else {
        throw new Error((res as any).error?.message || 'Redemption failed');
      }
    } catch (e: any) {
      console.error('[giftCardService] Failed to redeem gift card', e);
      throw e;
    }
  },

  getStats() {
    return {
      totalCards: 0,
      activeCards: 0,
      partiallyUsed: 0,
      fullyRedeemed: 0,
      expiredCards: 0,
      totalIssuedValue: 0,
      totalOutstandingBalance: 0,
      totalRedeemedValue: 0
    };
  }
};
