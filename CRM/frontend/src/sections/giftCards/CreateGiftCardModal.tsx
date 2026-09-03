import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Gift, Sparkles } from 'lucide-react';

export interface CreateGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGiftCard: (data: any) => void;
}

export const CreateGiftCardModal: React.FC<CreateGiftCardModalProps> = ({
  isOpen,
  onClose,
  onCreateGiftCard
}) => {
  const [recipient, setRecipient] = useState('');
  const [buyer, setBuyer] = useState('');
  const [value, setValue] = useState<number>(150);
  const [expiryDate, setExpiryDate] = useState('2026-05-31');
  const [location, setLocation] = useState<'Brampton' | 'Mississauga'>('Brampton');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto generated preview card number
  const previewCardNumber = 'GC-AVS-100127';

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!recipient.trim()) errs.recipient = 'Recipient name is required';
    if (!buyer.trim()) errs.buyer = 'Buyer name is required';
    if (value <= 0) errs.value = 'Value must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onCreateGiftCard({
      recipient,
      buyer,
      value,
      expiryDate,
      location,
      notes
    });

    onClose();
    // Reset
    setRecipient('');
    setBuyer('');
    setValue(150);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Gift Card"
      subtitle="Issue a luxury physical or digital wellness certificate"
      maxWidth="xl"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gold" size="sm" onClick={handleSubmit} icon={<Gift className="w-4 h-4" />}>
            Issue Gift Certificate
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Live Luxury Card Preview */}
        <div className="relative rounded-2xl p-6 bg-gradient-to-br from-[#0F291E] via-[#143929] to-[#0A1E16] text-white border border-[#C5A880]/50 shadow-md overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center overflow-hidden border border-[#C5A880]/60">
                <img
                  src="/avs_logo.png"
                  alt="Aura Vital Star"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-[#E5C583]">
                  <span>AURA VITAL STAR</span>
                </div>
                <p className="text-[10px] text-emerald-200/80 uppercase tracking-widest mt-0.5">
                  Rejuvenation Certificate
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-white">${value || 0}</span>
              <p className="text-[10px] text-emerald-300">CAD</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-end text-xs">
            <div>
              <p className="text-[10px] text-emerald-300/70 uppercase">For</p>
              <p className="font-bold text-sm text-white">{recipient || 'Valued Recipient'}</p>
              <p className="text-[10px] text-emerald-300/70 mt-0.5">From: {buyer || 'Purchaser'}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-gold-200 bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
                {previewCardNumber}
              </span>
              <p className="text-[9px] text-emerald-200/60 mt-1">Valid until: {expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recipient Name *"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="e.g. Simran Khurana"
            error={errors.recipient}
          />
          <Input
            label="Buyer / Purchaser Name *"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder="e.g. Rajesh Khurana"
            error={errors.buyer}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Card Value ($) *"
            type="number"
            min="25"
            step="5"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            error={errors.value}
          />
          <Input
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <Select
            label="Issuing Centre"
            value={location}
            onChange={(e) => setLocation(e.target.value as any)}
            options={[
              { value: 'Brampton', label: 'Brampton Hub' },
              { value: 'Mississauga', label: 'Mississauga Suites' }
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Personal Note or Occasion
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Happy Birthday! Enjoy a serene retreat at Aura Vital Star..."
            className="w-full bg-white border border-[#D9E2DC] hover:border-slate-400 focus:border-forest-800 text-slate-900 text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-forest-800/15"
          />
        </div>
      </form>
    </Modal>
  );
};
