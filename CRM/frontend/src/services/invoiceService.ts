import { Invoice, InvoiceStatus, InvoiceItem } from '../types';
import { invoicesApi } from './apiClient';

function mapInvoice(inv: any): Invoice {
  return {
    id: inv.id,
    invoiceNo: inv.invoiceNumber || inv.invoiceNo || 'INV-0000',
    clientId: inv.clientId || '',
    clientName: inv.clientName || 'Valued Client',
    clientEmail: inv.clientEmail || '',
    clientPhone: inv.clientPhone || '',
    clientAddress: inv.clientAddress || undefined,
    date: inv.invoiceDate || inv.date || '',
    dueDate: inv.dueDate || '',
    location: (inv.location?.shortName || inv.location || 'Brampton') as 'Brampton' | 'Mississauga',
    status: (inv.status || 'Pending') as InvoiceStatus,
    items: Array.isArray(inv.items)
      ? inv.items.map((it: any) => ({
          id: it.id,
          service: it.serviceName || it.service || 'Service',
          quantity: it.quantity ?? 1,
          price: it.price ?? 0,
          amount: it.amount ?? ((it.price ?? 0) * (it.quantity ?? 1))
        }))
      : [],
    subtotal: inv.subtotal ?? 0,
    tax: inv.tax ?? 0,
    discount: inv.discount ?? 0,
    total: inv.total ?? 0,
    paymentMethod: (inv.paymentMethod || 'Credit Card') as any,
    notes: inv.notes || undefined
  };
}

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await invoicesApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapInvoice);
      }
    } catch (e) {
      console.error('[invoiceService] Failed to fetch invoices from API', e);
    }
    return [];
  },

  async getInvoiceById(id: string): Promise<Invoice | undefined> {
    try {
      const res = await invoicesApi.getById(id);
      if (res.success && res.data) {
        return mapInvoice(res.data);
      }
    } catch (e) {
      console.error('[invoiceService] Failed to fetch invoice', e);
    }
    return undefined;
  },

  async createInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNo'>): Promise<Invoice> {
    try {
      const res = await invoicesApi.create({
        clientId: invoiceData.clientId,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientPhone: invoiceData.clientPhone,
        invoiceDate: invoiceData.date,
        dueDate: invoiceData.dueDate,
        items: invoiceData.items.map(i => ({
          service: i.service,
          quantity: i.quantity,
          price: i.price,
          amount: i.amount
        })),
        tax: invoiceData.tax,
        discount: invoiceData.discount,
        paymentMethod: invoiceData.paymentMethod,
        status: invoiceData.status,
        notes: invoiceData.notes
      });
      if (res.success && res.data) {
        return mapInvoice(res.data);
      }
    } catch (e) {
      console.error('[invoiceService] Failed to create invoice via API', e);
    }
    throw new Error('Failed to create invoice');
  },

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    try {
      const res = await invoicesApi.update(id, { status });
      if (res.success && res.data) {
        return mapInvoice(res.data);
      }
    } catch (e) {
      console.error('[invoiceService] Failed to update invoice status via API', e);
    }
    throw new Error('Failed to update invoice status');
  },

  async deleteInvoice(id: string): Promise<boolean> {
    try {
      const res = await invoicesApi.update(id, { status: 'Cancelled' });
      return res.success;
    } catch (e) {
      console.error('[invoiceService] Failed to delete invoice', e);
      return false;
    }
  },

  getStats() {
    return {
      totalInvoices: 0,
      paid: 0,
      pending: 0,
      overdue: 0
    };
  }
};
