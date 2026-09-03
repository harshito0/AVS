import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { GiftCard } from '../../types';
import { Gift, Calendar, User, DollarSign, Clock, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface GiftCardDetailsDrawerProps {
  card: GiftCard | null;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (card: GiftCard) => void;
}

export const GiftCardDetailsDrawer: React.FC<GiftCardDetailsDrawerProps> = ({
  card,
  isOpen,
  onClose,
  onRedeem
}) => {
  if (!card) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span>Gift Card Record</span>
          <span className="font-mono font-bold text-xs bg-forest-50 text-forest-900 px-2 py-0.5 rounded border border-forest-100">
            {card.cardNumber}
          </span>
          <StatusBadge status={card.status} />
        </div>
      }
      subtitle={`Issued on ${card.createdOn}`}
      width="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {card.status !== 'Expired' && card.balance > 0 && (
            <Button
              variant="gold"
              size="sm"
              onClick={() => {
                onClose();
                onRedeem(card);
              }}
              icon={<Gift className="w-4 h-4" />}
            >
              Redeem This Card
            </Button>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Visual Card Banner */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[#0F291E] via-[#143929] to-[#0A1E16] text-white border border-[#C5A880]/50 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center overflow-hidden border border-[#C5A880]/60">
                <img
                  src="/avs_logo.png"
                  alt="Aura Vital Star"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[#E5C583] uppercase">
                  AURA VITAL STAR
                </p>
                <p className="text-xs text-emerald-200/80">Wellness Certificate</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xl font-bold text-white">${card.balance.toFixed(2)}</span>
              <p className="text-[10px] text-emerald-300">Remaining Balance</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex justify-between items-end text-xs">
            <div>
              <p className="text-[10px] text-emerald-300/70">Recipient</p>
              <p className="font-bold text-sm text-white">{card.recipient}</p>
              <p className="text-[10px] text-emerald-300/70 mt-0.5">Purchased by: {card.buyer}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-bold text-gold-200 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                {card.cardNumber}
              </span>
              <p className="text-[9px] text-emerald-200/60 mt-1">Expiry: {card.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-[#E3EAE5] bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Original Value</span>
            <span className="text-base font-bold text-slate-800 mt-0.5 block">${card.value.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500">CAD Currency</span>
          </div>
          <div className="p-3.5 rounded-xl border border-[#E3EAE5] bg-white">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Balance</span>
            <span className="text-base font-bold text-emerald-700 mt-0.5 block">${card.balance.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600">Available to spend</span>
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Gift Card Ledger & History
            </h4>
            <span className="text-[11px] text-slate-400">{card.history?.length || 0} events</span>
          </div>

          <div className="border border-[#E3EAE5] rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#FAFBF9] border-b border-[#E3EAE5] text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">DATE</th>
                  <th className="py-2.5 px-3">DESCRIPTION</th>
                  <th className="py-2.5 px-3 text-right">DEBIT</th>
                  <th className="py-2.5 px-3 text-right">CREDIT</th>
                  <th className="py-2.5 px-3 text-right">BALANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2EE]">
                {card.history?.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{h.date}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      <div>
                        <p>{h.description}</p>
                        <p className="text-[10px] text-slate-400">{h.reference} • By {h.by}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-rose-600">
                      {h.debit > 0 ? `-$${h.debit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-emerald-600">
                      {h.credit > 0 ? `+$${h.credit.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      ${h.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
