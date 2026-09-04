import React, { useState, useEffect } from 'react';
import { BookingHeader } from './components/BookingHeader';
import { BookingForm } from './components/BookingForm';
import { BookingSuccess } from './components/BookingSuccess';
import { QRGenerator } from './qr/QRGenerator';
import { BookingRequest } from './types';
import { Smartphone, QrCode } from 'lucide-react';

export const App: React.FC = () => {
  // Determine current page from URL pathname or query
  const getInitialView = (): 'book' | 'qr' => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('qr-booking') || hash.includes('qr-booking') || hash.includes('qr')) {
      return 'qr';
    }
    return 'book';
  };

  const [activeView, setActiveView] = useState<'book' | 'qr'>(getInitialView);
  const [submittedBooking, setSubmittedBooking] = useState<{
    data: BookingRequest;
    bookingId?: string;
  } | null>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('preview=success')) {
      return {
        data: {
          fullName: 'Jane Doe',
          phone: '(647) 555-0100',
          email: 'jane.doe@example.com',
          service: 'RMT Massage Therapy',
          location: 'Brampton',
          date: '2026-09-10',
          time: '4:00 PM',
          notes: 'Focus on lower back tension relief.'
        },
        bookingId: 'APT-QR-98214'
      };
    }
    return null;
  });

  // Sync browser URL smoothly on view switch
  const handleViewChange = (view: 'book' | 'qr') => {
    setActiveView(view);
    const newPath = view === 'book' ? '/book' : '/qr-booking';
    window.history.pushState(null, '', newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9F8] flex flex-col justify-between">
      {/* Top Utility View Switcher */}
      <header className="bg-white border-b border-[#E3EAE5] sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-800" />
            <span className="text-xs font-bold text-slate-800 tracking-wide font-serif hidden sm:inline">
              AVS Rejuvenation
            </span>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => handleViewChange('book')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'book'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>/book</span>
            </button>

            <button
              type="button"
              onClick={() => handleViewChange('qr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeView === 'qr'
                  ? 'bg-forest-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>/qr-booking</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 py-4 sm:py-6">
        {activeView === 'book' ? (
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
        ) : (
          <QRGenerator />
        )}
      </main>

      {/* Note: Explicitly NO FOOTER on this form as requested by the user */}
    </div>
  );
};

export default App;