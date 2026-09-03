import React from 'react';

export const BookingHeader: React.FC = () => {
  return (
    <div className="text-center pt-2 pb-6 px-4">
      {/* Brand Logo & Subtitle */}
      <div className="inline-flex flex-col items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2.5 shadow-sm border border-[#E2ECE6] mb-3 flex items-center justify-center">
          <img
            src="/avs_logo.png"
            alt="Aura Vital Star Logo"
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback text if image cannot be loaded
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <h2 className="text-sm font-bold tracking-[0.2em] text-forest-950 uppercase font-sans">
          Aura Vital Star
        </h2>
        <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold mt-0.5">
          Rejuvenation Centre
        </span>
      </div>

      {/* Title & Description */}
      <div className="mt-6 max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
          BOOK YOUR APPOINTMENT
        </h1>
        <p className="text-[13px] sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Complete the form below and our team will get back to you to confirm your appointment.
        </p>
      </div>

      {/* Subtle Divider */}
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-5" />
    </div>
  );
};