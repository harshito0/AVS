import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GiftCard } from '../../types';
import { giftCardService } from '../../services/giftCardService';
import { Search, CheckCircle2, Gift, AlertCircle, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { INITIAL_CLIENTS } from '../../data/clients';

export interface RedeemGiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (card: GiftCard) => void;
  initialCardNumber?: string;
}

export const RedeemGiftCardModal: React.FC<RedeemGiftCardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCardNumber = ''
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchNumber, setSearchNumber] = useState(initialCardNumber || 'GC-AVS-100124');
  const [isSearching, setIsSearching] = useState(false);
  const [card, setCard] = useState<GiftCard | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 2 & 3 State
  const [redeemClient, setRedeemClient] = useState(INITIAL_CLIENTS[0]?.name || 'Guest Client');
  const [referenceInvoice, setReferenceInvoice] = useState('Direct Counter Redemption');
  const [redeemAmount, setRedeemAmount] = useState<number>(50.00);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 4 Receipt State
  const [redemptionResult, setRedemptionResult] = useState<{
    amountRedeemed: number;
    remainingBalance: number;
    newStatus: string;
  } | null>(null);

  // Search Step 1
  const handleSearch = async () => {
    setErrorMsg('');
    if (!searchNumber.trim()) {
      setErrorMsg('Please enter a gift card number.');
      return;
    }
    setIsSearching(true);
    try {
      const found = await giftCardService.findByCardNumber(searchNumber);
      if (!found) {
        setErrorMsg(`Gift card "${searchNumber}" not found in system.`);
      } else if (found.status === 'Expired') {
        setErrorMsg('This gift card has expired.');
      } else if (found.balance <= 0) {
        setErrorMsg('This gift card has zero remaining balance.');
      } else {
        setCard(found);
        setRedeemAmount(Math.min(80, found.balance));
        setStep(2);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Submit Step 3
  const handleConfirmRedemption = async () => {
    if (!card) return;
    if (redeemAmount <= 0) {
      setErrorMsg('Redemption amount must be greater than $0.');
      return;
    }
    if (redeemAmount > card.balance) {
      setErrorMsg(`Amount cannot exceed current balance of $${card.balance.toFixed(2)}.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const result = await giftCardService.redeemGiftCard(
        card.cardNumber,
        redeemAmount,
        `Session for ${redeemClient}`,
        referenceInvoice
      );

      setRedemptionResult({
        amountRedeemed: result.amountRedeemed,
        remainingBalance: result.remainingBalance,
        newStatus: result.card.status
      });
      setCard(result.card);
      setStep(4);
      onSuccess(result.card);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process redemption.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSearchNumber('GC-AVS-100124');
    setCard(null);
    setErrorMsg('');
    setRedemptionResult(null);
    onClose();
  };

  // Step 3 Live calculation
  const liveRemaining = card ? Math.max(0, Math.round((card.balance - (redeemAmount || 0)) * 100) / 100) : 0;
  const liveNewStatus = liveRemaining === 0 ? 'Redeemed' : 'Partially Used';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title="Redeem Gift Card"
      subtitle="4-step verification and balance debit flow"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 1 ? 'text-forest-850' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 1 ? 'bg-forest-850 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              1
            </span>
            <span>Search</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 2 ? 'bg-forest-850' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 2 ? 'text-forest-850' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 2 ? 'bg-forest-850 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              2
            </span>
            <span>Details</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 3 ? 'bg-forest-850' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 3 ? 'text-forest-850' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 3 ? 'bg-forest-850 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              3
            </span>
            <span>Amount</span>
          </div>
          <div className={`h-0.5 flex-1 mx-2 ${step >= 4 ? 'bg-forest-850' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-1.5 font-semibold ${step >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              4
            </span>
            <span>Receipt</span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Search Gift Card Number */}
        {step === 1 && (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Enter Gift Card Number
              </label>
              <div className="flex gap-2">
                <Input
                  value={searchNumber}
                  onChange={(e) => setSearchNumber(e.target.value)}
                  placeholder="e.g. GC-AVS-100124"
                  leftIcon={<Gift className="w-4 h-4 text-forest-850" />}
                />
                <Button variant="primary" onClick={handleSearch} isLoading={isSearching} className="shrink-0">
                  <Search className="w-4 h-4 mr-1" /> Search
                </Button>
              </div>
              <p className="text-[11px] text-slate-400">
                Sample test numbers: <span className="font-mono text-slate-600 font-semibold cursor-pointer underline" onClick={() => setSearchNumber('GC-AVS-100124')}>GC-AVS-100124</span> or <span className="font-mono text-slate-600 font-semibold cursor-pointer underline" onClick={() => setSearchNumber('GC-AVS-100125')}>GC-AVS-100125</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Gift Card Details & Redeem Against */}
        {step === 2 && card && (
          <div className="space-y-4">
            {/* Card Details Summary */}
            <div className="p-4 rounded-xl border border-[#D9E2DC] bg-[#FAFBF9] space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">{card.cardNumber}</span>
                  <p className="text-[11px] text-slate-400">Expires: {card.expiryDate}</p>
                </div>
                <StatusBadge status={card.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Recipient</span>
                  <span className="font-semibold text-slate-800">{card.recipient}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Purchased By</span>
                  <span className="font-semibold text-slate-800">{card.buyer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Original Value</span>
                  <span className="font-semibold text-slate-700">${card.value.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Available Balance</span>
                  <span className="font-extrabold text-forest-900 text-sm">${card.balance.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Redeem Against Selectors */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Redeem Against
              </h5>
              {INITIAL_CLIENTS.length > 0 ? (
                <Select
                  label="Assign to Client"
                  value={redeemClient}
                  onChange={(e) => setRedeemClient(e.target.value)}
                  options={INITIAL_CLIENTS.map((c) => ({
                    value: c.name,
                    label: `${c.name} (${c.location})`
                  }))}
                />
              ) : (
                <Input
                  label="Assign to Client"
                  value={redeemClient}
                  onChange={(e) => setRedeemClient(e.target.value)}
                  placeholder="e.g. Guest Client"
                />
              )}
              <Input
                label="Invoice / Appointment Reference"
                value={referenceInvoice}
                onChange={(e) => setReferenceInvoice(e.target.value)}
                placeholder="e.g. INV-2025-0186"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setStep(1)} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
              <Button variant="primary" size="sm" onClick={() => setStep(3)} icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                Next: Enter Amount
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Amount to Redeem & Live Calculation */}
        {step === 3 && card && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-forest-200 bg-forest-50/40 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600">Gift Card Available Balance:</span>
                <span className="font-bold text-forest-900 text-sm">${card.balance.toFixed(2)}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Amount to Redeem ($) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    max={card.balance}
                    step="0.01"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-[#D9E2DC] text-slate-900 font-bold text-lg rounded-xl pl-8 pr-4 py-2 focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800"
                  />
                </div>
              </div>

              {/* Real-time Calculation Breakdown */}
              <div className="pt-3 border-t border-forest-200/60 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Current Balance:</span>
                  <span className="font-semibold">${card.balance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Amount to Debit:</span>
                  <span>-${redeemAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-dashed border-forest-200">
                  <span>Remaining Balance:</span>
                  <span className="text-emerald-700 text-sm">${liveRemaining.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 pt-1">
                  <span>New Status will be:</span>
                  <StatusBadge status={liveNewStatus} />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm" onClick={() => setStep(2)} icon={<ArrowLeft className="w-3.5 h-3.5" />}>
                Back
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleConfirmRedemption}
                isLoading={isSubmitting}
                icon={<CheckCircle2 className="w-4 h-4" />}
              >
                Confirm & Redeem ${redeemAmount.toFixed(2)}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Success Screen */}
        {step === 4 && card && redemptionResult && (
          <div className="text-center py-4 space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">
                ${redemptionResult.amountRedeemed.toFixed(2)} successfully redeemed!
              </h3>
              <p className="text-xs text-slate-500 font-mono">from {card.cardNumber}</p>
            </div>

            {/* Receipt Box */}
            <div className="p-4 rounded-xl border border-[#D9E2DC] bg-[#FAFBF9] max-w-sm mx-auto text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Redeemed:</span>
                <span className="font-bold text-slate-900">${redemptionResult.amountRedeemed.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-bold text-emerald-700">${redemptionResult.remainingBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">New Status:</span>
                <StatusBadge status={redemptionResult.newStatus} />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="primary" size="md" onClick={handleResetAndClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
