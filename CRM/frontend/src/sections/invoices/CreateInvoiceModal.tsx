import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { InvoiceItem, Client } from '../../types';
import { Plus, Trash2, Info, Gift, Tag, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { clientService } from '../../services/clientService';
import { giftCardService } from '../../services/giftCardService';

export interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (data: any) => void;
}

const AVAILABLE_SERVICES = [
  { name: 'RMT Massage Therapy', price: 100.00, taxable: true },
  { name: 'Deep Tissue Massage', price: 120.00, taxable: true },
  { name: 'Aroma Therapy', price: 80.00, taxable: true },
  { name: 'Hot Stone Therapy', price: 70.00, taxable: true },
  { name: 'Consultation Fee', price: 50.00, taxable: false },
  { name: 'Luxury 24K Gold Facial', price: 180.00, taxable: false },
  { name: 'Hydra-Glow Cleansing Facial', price: 140.00, taxable: false },
  { name: 'Hair Spa & Scalp Detox', price: 110.00, taxable: false },
  { name: 'Body Polishing Ritual', price: 125.00, taxable: false },
  { name: 'Foot Spa Treatment', price: 75.00, taxable: false },
  { name: 'Laser Hair Removal', price: 90.00, taxable: false },
  { name: 'Custom Service', price: 100.00, taxable: false },
  { name: 'AVS Signature Couple Retreat', price: 380.00, taxable: false },
];

const TAX_PRESETS = [
  { label: 'Ontario HST (13%)', value: 13 },
  { label: 'GST Only (5%)', value: 5 },
  { label: 'Provincial PST (8%)', value: 8 },
  { label: 'Custom Rate', value: -1 },
];

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onCreateInvoice
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientEmail, setManualClientEmail] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [location, setLocation] = useState<'Brampton' | 'Mississauga'>('Brampton');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [notes, setNotes] = useState('Thank you for choosing Aura Vital Star!');

  // Tax customization state
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxPreset, setTaxPreset] = useState(13);
  const [customTaxRate, setCustomTaxRate] = useState<number>(13);
  const [taxLabel, setTaxLabel] = useState('HST (13%)');
  const [showCustomTax, setShowCustomTax] = useState(false);

  // Gift Voucher Redemption state
  const [showVoucherPanel, setShowVoucherPanel] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLookupStatus, setVoucherLookupStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
  const [voucherCard, setVoucherCard] = useState<any>(null);
  const [voucherRedeemAmount, setVoucherRedeemAmount] = useState<number>(0);
  const [voucherApplied, setVoucherApplied] = useState(false);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 'item-init-1', service: 'RMT Massage Therapy', quantity: 1, price: 100.00, amount: 100.00 }
  ]);

  useEffect(() => {
    if (isOpen) {
      clientService.getClients().then((res) => {
        setClients(res);
        if (res.length > 0) setSelectedClientId(res[0].id);
      });
    }
  }, [isOpen]);

  const effectiveTaxRate = showCustomTax ? customTaxRate : taxPreset;

  // Sync label when preset or rate changes
  useEffect(() => {
    if (showCustomTax) {
      setTaxLabel(`Tax (${customTaxRate}%)`);
    } else {
      const found = TAX_PRESETS.find(p => p.value === taxPreset);
      if (found) setTaxLabel(found.label.split(' (')[0] + ` (${taxPreset}%)`);
    }
  }, [taxPreset, customTaxRate, showCustomTax]);

  const handleAddItem = () => {
    const defaultSvc = AVAILABLE_SERVICES[0];
    setItems(prev => [...prev, {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      service: defaultSvc.name,
      quantity: 1,
      price: defaultSvc.price,
      amount: defaultSvc.price
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleServiceChange = (id: string, serviceName: string) => {
    const found = AVAILABLE_SERVICES.find(s => s.name === serviceName);
    const price = found ? found.price : 100;
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, service: serviceName, price, amount: price * it.quantity } : it
    ));
  };

  const handleQuantityChange = (id: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, quantity: safeQty, amount: it.price * safeQty } : it
    ));
  };

  const handlePriceChange = (id: string, price: number) => {
    const safePrice = Math.max(0, price);
    setItems(prev => prev.map(it =>
      it.id === id ? { ...it, price: safePrice, amount: safePrice * it.quantity } : it
    ));
  };

  const handleTaxPresetChange = (val: string) => {
    const num = parseFloat(val);
    if (num === -1) {
      setShowCustomTax(true);
    } else {
      setShowCustomTax(false);
      setTaxPreset(num);
    }
  };

  // Gift voucher lookup
  const handleVoucherLookup = async () => {
    if (!voucherCode.trim()) return;
    setVoucherLookupStatus('loading');
    setVoucherCard(null);
    setVoucherApplied(false);
    try {
      const card = await giftCardService.findByCardNumber(voucherCode.trim());
      if (card && card.status === 'Active' && card.balance > 0) {
        setVoucherCard(card);
        setVoucherRedeemAmount(Math.min(card.balance, subtotal));
        setVoucherLookupStatus('found');
      } else if (card && (card.status !== 'Active' || card.balance <= 0)) {
        setVoucherCard(card);
        setVoucherLookupStatus('error');
      } else {
        setVoucherLookupStatus('error');
        setVoucherCard(null);
      }
    } catch {
      setVoucherLookupStatus('error');
      setVoucherCard(null);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherApplied(false);
    setVoucherCard(null);
    setVoucherCode('');
    setVoucherLookupStatus('idle');
    setVoucherRedeemAmount(0);
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = taxEnabled
    ? Math.round(subtotal * (effectiveTaxRate / 100) * 100) / 100
    : 0;
  const appliedVoucherAmount = voucherApplied ? Math.min(voucherRedeemAmount, subtotal + taxAmount) : 0;
  const total = Math.max(0, Math.round((subtotal + taxAmount - discount - appliedVoucherAmount) * 100) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === selectedClientId);
    const clientName = client ? client.name : (manualClientName.trim() || 'Guest Client');
    const clientEmail = client ? client.email : (manualClientEmail.trim() || 'guest@auravitalstar.ca');
    const clientPhone = client ? client.phone : '';
    const clientId = client ? client.id : `cli-${Date.now()}`;

    onCreateInvoice({
      clientId, clientName, clientEmail, clientPhone,
      clientAddress: `${location}, ON`,
      date: invoiceDate, dueDate, location,
      status: 'Pending' as const,
      items,
      subtotal,
      tax: taxAmount,
      taxRate: taxEnabled ? effectiveTaxRate : 0,
      taxLabel: taxEnabled ? taxLabel : 'No Tax',
      taxEnabled,
      discount,
      giftVoucherCode: voucherApplied ? voucherCard?.cardNumber : undefined,
      giftVoucherAmount: voucherApplied ? appliedVoucherAmount : 0,
      total,
      paymentMethod,
      notes
    });
    onClose();
  };

  const isTaxableService = (serviceName: string) => {
    return AVAILABLE_SERVICES.find(s => s.name === serviceName)?.taxable ?? false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Invoice"
      subtitle="Generate itemized billing for clinical and spa treatments"
      maxWidth="2xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create & Issue Invoice
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* CLIENT + LOCATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.length > 0 ? (
            <Select
              label="Client *"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={clients.map(c => ({ value: c.id, label: `${c.name} (${c.location})` }))}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Client Name *"
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
                placeholder="Enter client name"
                required
              />
              <Input
                label="Client Email"
                type="email"
                value={manualClientEmail}
                onChange={(e) => setManualClientEmail(e.target.value)}
                placeholder="Enter client email"
              />
            </div>
          )}
          <Select
            label="Centre Location"
            value={location}
            onChange={(e) => setLocation(e.target.value as any)}
            options={[
              { value: 'Brampton', label: 'Brampton Hub' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
        </div>

        {/* DATES + PAYMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Invoice Date"
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
          <Input
            label="Payment Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={[
              { value: 'Credit Card', label: 'Credit Card' },
              { value: 'Debit', label: 'Debit' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Gift Card', label: 'Gift Card' },
              { value: 'E-Transfer', label: 'E-Transfer' },
              { value: 'Insurance', label: 'Insurance' }
            ]}
          />
        </div>

        {/* LINE ITEMS */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Treatment Line Items
            </h4>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs text-forest-850 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Item
            </button>
          </div>

          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_64px_100px_88px_36px] gap-2 px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Service / Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Unit Price</span>
            <span className="text-right">Total</span>
            <span></span>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E3EAE5] bg-[#FAFBF9]"
              >
                <span className="text-xs font-bold text-slate-400 w-5 text-center shrink-0">{idx + 1}</span>

                <div className="flex-1 min-w-0">
                  <select
                    value={it.service}
                    onChange={(e) => handleServiceChange(it.id, e.target.value)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 focus:ring-1 focus:ring-forest-800"
                  >
                    {AVAILABLE_SERVICES.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.name} — ${s.price.toFixed(2)} {s.taxable ? '(Taxable)' : '(Tax-Free)'}
                      </option>
                    ))}
                  </select>
                  {isTaxableService(it.service) && taxEnabled && (
                    <span className="inline-block mt-1 text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                      HST applicable
                    </span>
                  )}
                </div>

                <div className="w-16 shrink-0">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => handleQuantityChange(it.id, parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 text-center"
                    placeholder="Qty"
                  />
                </div>

                <div className="w-24 shrink-0">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={it.price}
                    onChange={(e) => handlePriceChange(it.id, parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 text-right"
                    placeholder="Price"
                  />
                </div>

                <div className="w-22 text-right font-bold text-xs text-slate-900 pr-1 shrink-0">
                  ${it.amount.toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(it.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TAX CUSTOMIZATION PANEL */}
        <div className="rounded-xl border border-[#E3EAE5] bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAF8] border-b border-[#E3EAE5]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tax Settings
              </span>
              <span className="text-[10px] text-slate-400 font-normal">(RMT is HST-exempt in Ontario)</span>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setTaxEnabled(prev => !prev)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus:outline-none ${
                taxEnabled ? 'bg-forest-700' : 'bg-slate-300'
              }`}
              title={taxEnabled ? 'Disable Tax' : 'Enable Tax'}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                  taxEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {taxEnabled && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Tax Preset */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Tax Type
                </label>
                <select
                  value={showCustomTax ? -1 : taxPreset}
                  onChange={(e) => handleTaxPresetChange(e.target.value)}
                  className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 focus:ring-1 focus:ring-forest-800"
                >
                  {TAX_PRESETS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              {/* Custom Rate Input — only if custom selected */}
              {showCustomTax ? (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Custom Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={customTaxRate}
                    onChange={(e) => setCustomTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 text-right"
                    placeholder="e.g. 7.5"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end">
                  <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Rate Applied</p>
                  <div className="p-2 bg-forest-50 border border-forest-100 rounded-lg text-xs font-bold text-forest-900">
                    {effectiveTaxRate}% → +${taxAmount.toFixed(2)}
                  </div>
                </div>
              )}

              {/* Tax Label on Invoice */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  Label on Invoice
                </label>
                <input
                  type="text"
                  value={taxLabel}
                  onChange={(e) => setTaxLabel(e.target.value)}
                  className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2"
                  placeholder="e.g. HST (13%)"
                />
              </div>
            </div>
          )}

          {!taxEnabled && (
            <div className="px-4 py-3">
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                No tax will be applied to this invoice. Suitable for RMT sessions, insurance claims, or tax-exempt clients.
              </p>
            </div>
          )}
        </div>

        {/* GIFT VOUCHER REDEMPTION */}
        <div className="rounded-xl border border-[#E3EAE5] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => setShowVoucherPanel(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#F8FAF8] border-b border-[#E3EAE5] hover:bg-forest-50/60 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Gift className="w-3.5 h-3.5 text-forest-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Redeem Gift Voucher
              </span>
              {voucherApplied && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  −${appliedVoucherAmount.toFixed(2)} applied
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{showVoucherPanel ? 'Hide' : 'Enter code'}</span>
          </button>

          {showVoucherPanel && (
            <div className="p-4 space-y-3">
              {/* Applied voucher summary */}
              {voucherApplied && voucherCard ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800">{voucherCard.cardNumber}</p>
                      <p className="text-[11px] text-emerald-600">Recipient: {voucherCard.recipient} · Balance after: ${(voucherCard.balance - appliedVoucherAmount).toFixed(2)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveVoucher} className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {/* Code input + lookup */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherLookupStatus('idle'); setVoucherCard(null); setVoucherApplied(false); }}
                        placeholder="Enter gift voucher code (e.g. GC-2025-XXXX)"
                        className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2.5 focus:ring-1 focus:ring-forest-800 font-mono tracking-widest uppercase"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoucherLookup}
                      isLoading={voucherLookupStatus === 'loading'}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      Validate
                    </Button>
                  </div>

                  {/* Lookup error */}
                  {voucherLookupStatus === 'error' && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        {voucherCard
                          ? `This voucher (${voucherCard.cardNumber}) is ${voucherCard.status === 'Redeemed' ? 'fully redeemed' : voucherCard.status === 'Expired' ? 'expired' : 'inactive'} and cannot be applied.`
                          : 'Gift voucher not found. Please check the code and try again.'}
                      </span>
                    </div>
                  )}

                  {/* Found — show details + amount input */}
                  {voucherLookupStatus === 'found' && voucherCard && (
                    <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-forest-900">{voucherCard.cardNumber}</p>
                          <p className="text-[11px] text-slate-500">Recipient: {voucherCard.recipient} · Expires: {voucherCard.expiryDate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Available Balance</p>
                          <p className="text-base font-bold text-forest-900">${voucherCard.balance.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1 uppercase tracking-wide">Redeem Amount ($)</label>
                          <input
                            type="number"
                            min="0.01"
                            max={Math.min(voucherCard.balance, subtotal + taxAmount)}
                            step="0.01"
                            value={voucherRedeemAmount}
                            onChange={(e) => setVoucherRedeemAmount(Math.min(parseFloat(e.target.value) || 0, voucherCard.balance, subtotal + taxAmount))}
                            className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 text-right"
                          />
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setVoucherApplied(true)}
                          disabled={voucherRedeemAmount <= 0}
                        >
                          Apply Voucher
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* SUMMARY + DISCOUNT */}
        <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-3 w-full sm:w-48">
            <Input
              label="Discount ($)"
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
            <div className="w-full">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Invoice Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 resize-none focus:ring-1 focus:ring-forest-800"
                placeholder="Add a note for the client..."
              />
            </div>
          </div>

          <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {taxEnabled ? (
              <div className="flex justify-between text-slate-600">
                <span>{taxLabel}:</span>
                <span className="font-semibold">${taxAmount.toFixed(2)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-slate-400">
                <span className="italic">Tax:</span>
                <span className="font-semibold italic">$0.00 (exempt)</span>
              </div>
            )}

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
              </div>
            )}

            {voucherApplied && appliedVoucherAmount > 0 && (
              <div className="flex justify-between text-violet-600">
                <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Gift Voucher ({voucherCard?.cardNumber}):</span>
                <span className="font-semibold">-${appliedVoucherAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-forest-200/60 flex justify-between items-center text-sm font-bold text-forest-900">
              <span>Invoice Total:</span>
              <span className="text-lg">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </form>
    </Modal>
  );
};
