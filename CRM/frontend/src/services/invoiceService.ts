import { Invoice, InvoiceStatus, InvoiceItem } from '../types';
import { invoicesApi } from './apiClient';

function mapInvoice(inv: any): Invoice {
  const rawItems = Array.isArray(inv.items) ? inv.items : [];
  const items: InvoiceItem[] = rawItems.map((it: any) => {
    const qty = Number(it.quantity) || 1;
    const price = Number(it.price) || 0;
    const amount = Number(it.amount) !== undefined && !isNaN(Number(it.amount)) && Number(it.amount) > 0
      ? Number(it.amount)
      : Math.round(price * qty * 100) / 100;
    return {
      id: it.id || `it-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      service: it.serviceName || it.service || 'Service',
      quantity: qty,
      price,
      amount
    };
  });

  const itemsSum = items.reduce((s, it) => s + it.amount, 0);
  const subtotal = inv.subtotal !== undefined && !isNaN(Number(inv.subtotal)) && Number(inv.subtotal) > 0
    ? Number(inv.subtotal)
    : Math.round(itemsSum * 100) / 100;
  const tax = Number(inv.tax) || 0;
  const discount = Number(inv.discount) || 0;
  const total = inv.total !== undefined && !isNaN(Number(inv.total)) && Number(inv.total) > 0
    ? Number(inv.total)
    : Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

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
    items,
    subtotal,
    tax,
    discount,
    total,
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

  async createInvoice(invoiceData: any): Promise<Invoice> {
    try {
      const cleanItems = (invoiceData.items || []).map((i: any) => {
        const qty = Number(i.quantity) || 1;
        const price = Number(i.price) || 0;
        const amount = Number(i.amount) !== undefined && !isNaN(Number(i.amount)) && Number(i.amount) > 0
          ? Number(i.amount)
          : Math.round(price * qty * 100) / 100;
        return {
          id: i.id,
          service: i.service || i.serviceName,
          serviceName: i.serviceName || i.service,
          quantity: qty,
          price,
          amount
        };
      });

      const calculatedSubtotal = Math.round(cleanItems.reduce((s: number, it: any) => s + it.amount, 0) * 100) / 100;
      const subtotal = invoiceData.subtotal !== undefined && Number(invoiceData.subtotal) > 0
        ? Number(invoiceData.subtotal)
        : calculatedSubtotal;
      const tax = Number(invoiceData.tax) || 0;
      const discount = Number(invoiceData.discount) || 0;
      const total = invoiceData.total !== undefined && Number(invoiceData.total) > 0
        ? Number(invoiceData.total)
        : Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

      const res = await invoicesApi.create({
        clientId: invoiceData.clientId,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientPhone: invoiceData.clientPhone,
        clientAddress: invoiceData.clientAddress,
        date: invoiceData.date || invoiceData.invoiceDate,
        invoiceDate: invoiceData.invoiceDate || invoiceData.date,
        dueDate: invoiceData.dueDate,
        location: invoiceData.location || 'Brampton',
        items: cleanItems,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod: invoiceData.paymentMethod || 'Credit Card',
        status: invoiceData.status || 'Pending',
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
