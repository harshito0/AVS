import React from 'react';
import { Check, Calendar, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { BookingRequest } from '../types';
import { formatDisplayDate } from '../utils/validation';

interface BookingSuccessProps {
  data: BookingRequest;
  bookingId?: string;
  onReset: () => void;
}

export const BookingSuccess: React.FC<BookingSuccessProps> = ({ data, bookingId, onReset }) => {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-[#E3EAE5] shadow-[0_12px_40px_-10px_rgba(15,91,71,0.12)] p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top subtle decorative gradient glow */}
        <div className="absolute -top-16 -left-16 w-36 h-36 rounded-full bg-forest-100/50 blur-2xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gold-100/50 blur-2xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-forest-900 to-forest-800 text-white shadow-lg shadow-forest-900/20 mb-5">
          <div className="absolute inset-0 rounded-2xl border border-gold-400/40" />
          <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </div>

        {/* Heading & Subtitle */}
        <span className="text-[11px] font-bold tracking-[0.2em] text-gold-600 uppercase block mb-1">
          Confirmed Request
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif uppercase">
          Appointment Request Received
        </h2>
        
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          Thank you, <span className="font-bold text-slate-900">{data.fullName}</span>.
          <br />
          Your appointment request has been submitted successfully.
        </p>

        {bookingId && (
          <div className="inline-block mt-3 px-3 py-1 bg-forest-50 border border-forest-200/60 rounded-full text-xs font-semibold text-forest-850">
            Reference: {bookingId}
          </div>
        )}

        {/* Summary Details Card */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#F8FAF9] border border-[#E4ECE7] text-left space-y-3.5">
          {/* Service */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gold-50 border border-gold-200/60 flex items-center justify-center text-gold-600 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Service
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
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
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Location
              </span>
              <p className="text-sm font-bold text-slate-900 truncate">
                {data.location} Centre
              </p>
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
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
                  Time
                </span>
                <p className="text-xs font-bold text-slate-900">
                  {data.time}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation note */}
        <p className="text-xs text-slate-500 mt-5 leading-relaxed">
          Our team will contact you shortly via phone or email to confirm your appointment.
        </p>

        {/* Back to AVS / Reset Button */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              window.location.href = 'https://auravitalstar.ca';
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-forest-900 hover:bg-forest-850 text-white font-bold text-sm tracking-wide shadow-md shadow-forest-900/15 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            Back to AVS Website
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-forest-900 transition-colors"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    </div>
  );
};