import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { InvoiceItem, Client } from '../../types';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { clientService } from '../../services/clientService';

export interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateInvoice: (data: any) => void;
}

const AVAILABLE_SERVICES = [
  { name: 'RMT Massage Therapy', price: 100.00 },
  { name: 'Deep Tissue Massage', price: 120.00 },
  { name: 'Aroma Therapy', price: 80.00 },
  { name: 'Hot Stone Therapy', price: 70.00 },
  { name: 'Consultation Fee', price: 50.00 },
  { name: 'Luxury 24K Gold Facial', price: 180.00 },
  { name: 'Hydra-Glow Cleansing Facial', price: 140.00 },
  { name: 'Hair Spa & Scalp Detox', price: 110.00 },
  { name: 'AVS Signature Couple Retreat', price: 380.00 }
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
  const [invoiceDate, setInvoiceDate] = useState('2025-05-31');
  const [dueDate, setDueDate] = useState('2025-06-07');

  useEffect(() => {
    if (isOpen) {
      clientService.getClients().then((res) => {
        setClients(res);
        if (res.length > 0) {
          setSelectedClientId(res[0].id);
        }
      });
    }
  }, [isOpen]);
  const [location, setLocation] = useState<'Brampton' | 'Mississauga'>('Brampton');
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card' | 'Debit' | 'Cash' | 'Gift Card' | 'E-Transfer'>('Credit Card');
  const [notes, setNotes] = useState('Thank you for choosing Aura Vital Star!');

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'item-init-1',
      service: 'RMT Massage Therapy',
      quantity: 1,
      price: 100.00,
      amount: 100.00
    }
  ]);

  const handleAddItem = () => {
    const defaultSvc = AVAILABLE_SERVICES[0];
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      service: defaultSvc.name,
      quantity: 1,
      price: defaultSvc.price,
      amount: defaultSvc.price
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleServiceChange = (id: string, serviceName: string) => {
    const found = AVAILABLE_SERVICES.find((s) => s.name === serviceName);
    const price = found ? found.price : 100;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, service: serviceName, price, amount: price * it.quantity } : it
      )
    );
  };

  const handleQuantityChange = (id: string, qty: number) => {
    const safeQty = Math.max(1, qty);
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: safeQty, amount: it.price * safeQty } : it
      )
    );
  };

  const handlePriceChange = (id: string, price: number) => {
    const safePrice = Math.max(0, price);
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, price: safePrice, amount: safePrice * it.quantity } : it
      )
    );
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.round(subtotal * 0.13 * 100) / 100; // 13% Ontario HST
  const total = Math.max(0, Math.round((subtotal + tax - discount) * 100) / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === selectedClientId);
    const clientName = client ? client.name : (manualClientName.trim() || 'Guest Client');
    const clientEmail = client ? client.email : (manualClientEmail.trim() || 'guest@auravitalstar.ca');
    const clientPhone = client ? client.phone : '(905) 555-0100';
    const clientId = client ? client.id : `cli-${Date.now()}`;

    const invoicePayload = {
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      clientAddress: `${location}, ON`,
      date: invoiceDate,
      dueDate,
      location,
      status: 'Pending' as const,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      notes
    };

    onCreateInvoice(invoicePayload);
    onClose();
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
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create & Issue Invoice
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Top Meta Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.length > 0 ? (
            <Select
              label="Client *"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              options={clients.map((c) => ({
                value: c.id,
                label: `${c.name} (${c.location})`
              }))}
            />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Client Name *"
                value={manualClientName}
                onChange={(e) => setManualClientName(e.target.value)}
                placeholder="e.g. Guest Client"
                required
              />
              <Input
                label="Client Email *"
                type="email"
                value={manualClientEmail}
                onChange={(e) => setManualClientEmail(e.target.value)}
                placeholder="guest@example.ca"
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
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            options={[
              { value: 'Credit Card', label: 'Credit Card' },
              { value: 'Debit', label: 'Debit' },
              { value: 'Cash', label: 'Cash' },
              { value: 'Gift Card', label: 'Gift Card' },
              { value: 'E-Transfer', label: 'E-Transfer' }
            ]}
          />
        </div>

        {/* Dynamic Line Items */}
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
              <Plus className="w-3.5 h-3.5" /> Add Treatment Item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((it, idx) => (
              <div
                key={it.id}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E3EAE5] bg-[#FAFBF9]"
              >
                <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>

                <div className="flex-1">
                  <select
                    value={it.service}
                    onChange={(e) => handleServiceChange(it.id, e.target.value)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 focus:ring-1 focus:ring-forest-800"
                  >
                    {AVAILABLE_SERVICES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} (${s.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-16">
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => handleQuantityChange(it.id, parseInt(e.target.value) || 1)}
                    className="w-full bg-white border border-[#D9E2DC] rounded-lg text-xs p-2 text-center"
                    placeholder="Qty"
                  />
                </div>

                <div className="w-24">
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

                <div className="w-24 text-right font-bold text-xs text-slate-900 pr-1">
                  ${it.amount.toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(it.id)}
                  disabled={items.length <= 1}
                  className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Summary Footer */}
        <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-48">
            <Input
              label="Discount ($)"
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <div className="w-full sm:w-60 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>HST (13%):</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount:</span>
                <span className="font-semibold">-${discount.toFixed(2)}</span>
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
