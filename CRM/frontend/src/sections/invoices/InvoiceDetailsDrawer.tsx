import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Invoice } from '../../types';
import { Download, Send, Printer, Sparkles, Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export interface InvoiceDetailsDrawerProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceDetailsDrawer: React.FC<InvoiceDetailsDrawerProps> = ({
  invoice,
  isOpen,
  onClose
}) => {
  const { success, info } = useToast();

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    info('PDF Export', `Preparing high-resolution PDF for ${invoice.invoiceNo}...`);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleSendInvoice = () => {
    success('Invoice Dispatched', `Digital invoice & payment link emailed to ${invoice.clientEmail}`);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span>Invoice Details</span>
          <span className="text-xs font-mono font-bold text-forest-900 bg-forest-50 px-2.5 py-0.5 rounded-md border border-forest-100">
            {invoice.invoiceNo}
          </span>
          <StatusBadge status={invoice.status} />
        </div>
      }
      subtitle={`Billing statement for ${invoice.clientName}`}
      width="max-w-2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={handlePrint} icon={<Printer className="w-3.5 h-3.5" />}>
            Print
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              icon={<Download className="w-3.5 h-3.5" />}
            >
              Download PDF
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSendInvoice}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Send Invoice
            </Button>
          </div>
        </div>
      }
    >
      {/* Printable Invoice Container */}
      <div id="invoice-print-area" className="space-y-6 text-slate-800 relative">

        {/* Luxury Brand Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F291E] to-[#0A1E16] text-white border border-[#1A4232] shadow-sm relative overflow-hidden">
          {/* Subtle logo watermark inside the dark header */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <img src="/avs_logo.png" alt="" aria-hidden="true"
              className="w-72 opacity-[0.07]" />
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <img
                  src="/avs_logo.png"
                  alt="Aura Vital Star"
                  className="h-20 w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-wider text-white">AURA VITAL STAR</span>
                </div>
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gold-400 mt-0.5">
                  Rejuvenation Centre & Medical Spa
                </p>
                <div className="mt-1.5 space-y-0.5 text-xs text-emerald-100/70">
                  <p>Ontario Registered Wellness Clinic • HST # 84920 1932 RT0001</p>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-semibold text-emerald-200 uppercase tracking-widest">INVOICE</p>
              <p className="text-xl font-mono font-bold text-white mt-0.5">{invoice.invoiceNo}</p>
              <div className="mt-2 inline-block">
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Bill To & Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-[#E3EAE5] bg-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Bill To
            </p>
            <h4 className="text-base font-bold text-slate-900">{invoice.clientName}</h4>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-slate-400" />
                {invoice.clientPhone}
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-slate-400" />
                {invoice.clientEmail}
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                {invoice.clientAddress || `${invoice.location}, Ontario, Canada`}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-[#E3EAE5] bg-white space-y-2 text-xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Invoice Details
            </p>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Invoice Date:</span>
              <span className="font-semibold text-slate-800">{invoice.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Payment Due:</span>
              <span className="font-semibold text-slate-800">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{invoice.location} Hub</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Payment Method:</span>
              <span className="font-semibold text-slate-800">{invoice.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-[#E3EAE5] rounded-xl overflow-hidden bg-white shadow-2xs relative">
          {/* Watermark inside the table */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
            <img src="/avs_logo.png" alt="" aria-hidden="true"
              className="w-48 opacity-[0.05]" />
          </div>
          <table className="w-full text-left text-xs relative z-10">
            <thead>
              <tr className="bg-[#FAFBF9] border-b border-[#E3EAE5] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">SERVICE</th>
                <th className="py-3 px-4 text-center w-16">QTY</th>
                <th className="py-3 px-4 text-right w-24">PRICE</th>
                <th className="py-3 px-4 text-right w-28">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF2EE]">
              {invoice.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-400 font-medium">{index + 1}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.service}</td>
                  <td className="py-3 px-4 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-slate-600">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">${item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="p-4 rounded-xl border border-dashed border-[#D1DED5] bg-[#F9FAF9] text-xs space-y-1.5 flex-1 max-w-sm">
            <p className="font-bold text-forest-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              Thank you for choosing Aura Vital Star!
            </p>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {(invoice as any).notes || 'Registered Massage Therapy receipts qualify for direct reimbursement through standard Canadian health insurance plans (Sun Life, Manulife, Canada Life).'}
            </p>
            {(invoice as any).taxEnabled === false && (
              <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-700 font-semibold">
                ⚡ Tax-Exempt Invoice — No HST/GST applied
              </div>
            )}
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs border border-[#E3EAE5] rounded-xl p-4 bg-white">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">${invoice.subtotal.toFixed(2)}</span>
            </div>
            {(invoice as any).taxEnabled === false ? (
              <div className="flex justify-between text-slate-400">
                <span className="italic">Tax</span>
                <span className="font-semibold italic text-slate-400">$0.00 (exempt)</span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-600">
                <span>{(invoice as any).taxLabel || 'Tax'}</span>
                <span className="font-semibold text-slate-800">${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-semibold">-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-sm">TOTAL</span>
              <span className="font-extrabold text-forest-900 text-lg">
                ${invoice.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
