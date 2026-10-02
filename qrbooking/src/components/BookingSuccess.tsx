import React, { useState } from 'react';
import { Check, Calendar, Clock, MapPin, Sparkles, FileText, Printer, ArrowRight, ShieldCheck } from 'lucide-react';
import { BookingRequest } from '../types';
import { formatDisplayDate } from '../utils/validation';
import { ConsentViewModal } from './ConsentViewModal';

interface BookingSuccessProps {
  data: BookingRequest;
  bookingId?: string;
  onReset: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ data, bookingId, onReset }) => {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <div className="bg-[#FCFAF6] rounded-3xl border border-[#DFCBB0] shadow-[0_12px_40px_-10px_rgba(15,91,71,0.15)] p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Decorative ambient background glows */}
        <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-forest-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gold-100/50 blur-2xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#0F5B47] to-[#165B46] text-white shadow-lg shadow-forest-900/20 mb-4">
          <div className="absolute inset-0 rounded-2xl border border-gold-400/40" />
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5] text-gold-300" />
        </div>

        {/* Heading & Subtitle */}
        <span className="text-[11px] font-bold tracking-[0.2em] text-gold-700 uppercase block mb-1">
          Confirmed &amp; Recorded
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight font-serif uppercase">
          Client Consent &amp; Appointment Received
        </h2>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-md mx-auto">
          Thank you, <span className="font-bold text-slate-900">{data.fullName}</span>.
          <br />
          Your consent form has been securely recorded and your appointment request has been scheduled.
        </p>

        {bookingId && (
          <div className="inline-block mt-3 px-3.5 py-1 bg-forest-50 border border-forest-200/80 rounded-full text-xs font-semibold text-forest-900 font-mono">
            Booking ID: {bookingId}
          </div>
        )}

        {/* Verified Consent Badge Banner */}
        <div className="mt-5 p-3.5 rounded-2xl bg-[#EAF4EE] border border-[#2D7A58]/30 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-900 text-gold-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950">
                Client Consent Form Verified &amp; Signed
              </p>
              <p className="text-[10px] text-forest-800">
                All 9 health &amp; safety clauses acknowledged and digitally signed.
              </p>
            </div>
          </div>

          {data.consentForm && (
            <button
              type="button"
              onClick={() => setIsConsentModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-forest-900 text-white text-xs font-bold hover:bg-forest-850 transition-colors shrink-0 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-gold-400" />
              <span>View Form</span>
            </button>
          )}
        </div>

        {/* Summary Details Card */}
        <div className="mt-5 p-5 rounded-2xl bg-white border border-[#E4ECE7] text-left space-y-3.5 shadow-xs">
          {/* Services */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Treatment(s)
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {data.service}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200/60 flex items-center justify-center text-forest-800 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Centre Location
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {data.location} Centre
              </p>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2.5 border-t border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Date
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {formatDisplayDate(data.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Time Slot
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {data.time || 'Pending Staff Assignment'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {data.consentForm && (
            <button
              type="button"
              onClick={() => setIsConsentModalOpen(true)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-forest-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-forest-850 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-gold-400" />
              <span>Print / View Consent Copy</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Submit Another Form
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-5 italic">
          A confirmation copy has been registered. If you need to make changes, please contact Aura Vital Star at +1 647-987-5451.
        </p>
      </div>

      {/* Full Signed Consent Form Modal */}
      {data.consentForm && (
        <ConsentViewModal
          isOpen={isConsentModalOpen}
          onClose={() => setIsConsentModalOpen(false)}
          data={data.consentForm}
          bookingId={bookingId}
        />
      )}
    </div>
  );
};