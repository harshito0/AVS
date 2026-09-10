import React, { useState, useEffect } from 'react';
import { BookingHeader } from './components/BookingHeader';
import { BookingForm } from './components/BookingForm';
import { BookingSuccess } from './components/BookingSuccess';
import { QRGenerator } from './qr/QRGenerator';
import { BookingRequest } from './types';
import { Phone, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  // If anyone hits /qr-booking in browser history, clean the URL immediately to /book
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('qr-booking') || path.includes('qrbooking')) {
      window.history.replaceState(null, '', '/book');
    }
  }, []);

  // Admin print view only if ?qr=1 is in query
  const [isAdminQrView, setIsAdminQrView] = useState<boolean>(() => {
    return typeof window !== 'undefined' && (window.location.search.includes('qr=1') || window.location.search.includes('admin=qr'));
  });

  const [submittedBooking, setSubmittedBooking] = useState<{
    data: BookingRequest;
    bookingId?: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex flex-col justify-between">
      {/* Clean Premium Brand Header — Strictly on /book, NO /qr-booking toggle */}
      <header className="bg-white border-b border-[#E3EAE5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group text-decoration-none">
            <div className="w-8 h-8 rounded-full bg-forest-900 flex items-center justify-center text-[#DFBE77] font-serif font-bold text-xs tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              AVS
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight font-serif block leading-none">
                Aura Vital Star
              </span>
              <span className="text-[10px] text-forest-800 font-semibold tracking-wider uppercase block mt-0.5">
                Instant Reservation
              </span>
            </div>
          </a>

          <div className="flex items-center gap-3">
            {isAdminQrView ? (
              <button
                type="button"
                onClick={() => {
                  setIsAdminQrView(false);
                  window.history.pushState(null, '', '/book');
                }}
                className="px-3.5 py-1.5 rounded-full bg-forest-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-forest-850 transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Booking Form</span>
              </button>
            ) : (
              <a
                href="tel:+16479875451"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-forest-50 text-forest-900 hover:bg-forest-100 text-xs font-bold transition-colors border border-forest-200/60"
              >
                <Phone className="w-3.5 h-3.5 text-forest-700" />
                <span className="hidden sm:inline">+1 647-987-5451</span>
                <span className="sm:hidden">Call</span>
              </a>
            )}

            <a
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-forest-900 transition-colors hidden sm:inline-block"
            >
              Main Site &rarr;
            </a>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 py-4 sm:py-6">
        {isAdminQrView ? (
          <div className="max-w-4xl mx-auto px-4">
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setIsAdminQrView(false);
                  window.history.pushState(null, '', '/book');
                }}
                className="text-xs font-bold text-forest-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Booking Form
              </button>
            </div>
            <QRGenerator />
          </div>
        ) : (
          <div>
            {!submittedBooking ? (
              <>
                <BookingHeader />
                <BookingForm
                  onSuccess={(data, bookingId) => {
                    setSubmittedBooking({ data, bookingId });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            ) : (
              <BookingSuccess
                data={submittedBooking.data}
                bookingId={submittedBooking.bookingId}
                onReset={() => setSubmittedBooking(null)}
              />
            )}
          </div>
        )}
      </main>

      {/* Subtle staff link to generate/print standee */}
      <footer className="py-4 text-center">
        {!isAdminQrView && (
          <button
            type="button"
            onClick={() => {
              setIsAdminQrView(true);
              window.history.pushState(null, '', '/book?qr=1');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-[11px] text-slate-400 hover:text-forest-900 transition-colors cursor-pointer"
          >
            Clinic Staff: Print Front-Desk QR Standee
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;