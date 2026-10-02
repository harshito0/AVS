import React from 'react';
import { X, Printer, ShieldCheck, CheckSquare, Calendar, User, Phone, Mail, MapPin } from 'lucide-react';
import { ConsentFormData } from '../types';

interface ConsentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ConsentFormData | null;
  bookingId?: string;
}

export const ConsentViewModal: React.FC<ConsentViewModalProps> = ({
  isOpen,
  onClose,
  data,
  bookingId
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] border border-[#D5C29D]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Sticky Actions Header (hidden in print) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3 border-b border-[#E8DFD0] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900 font-sans">
              Signed Client Consent Document
            </span>
            {bookingId && (
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                #{bookingId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-forest-900 text-white hover:bg-forest-850 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Form Content — Exact Mirror of Physical Flyer */}
        <div className="p-6 sm:p-10 space-y-6 text-[#1A2621]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-[#D5C29D]/40">
            <div className="flex items-center gap-3">
              <img
                src="/avs_logo.png"
                alt="Aura Vital Star"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-700 font-semibold block">
                  Where Wellness Meets Radiance
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-forest-950 font-serif uppercase tracking-tight">
                  Aura Vital Star
                </h1>
                <span className="text-[11px] font-semibold text-forest-850 uppercase tracking-wider block">
                  Rejuvenation Centre Inc.
                </span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <h2 className="text-xl sm:text-2xl font-black text-forest-950 font-serif uppercase tracking-wide">
                Client Consent Form
              </h2>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800 block mt-0.5">
                Your Safety. Our Priority.
              </span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs sm:ml-auto">
                Completed and digitally signed prior to appointment.
              </p>
            </div>
          </div>

          {/* Section 1: Client Information */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>1. Client Information</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Full Name</span>
                <p className="font-bold text-slate-900 mt-0.5">{data.fullName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Date of Birth</span>
                <p className="font-semibold text-slate-800 mt-0.5">{data.dob || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Email Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{data.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Phone Number</span>
                <p className="font-medium text-slate-800 mt-0.5">{data.phone}</p>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Residential Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{data.address || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Appointment Details */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              <span>2. Appointment Details</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Preferred Date</span>
                <p className="font-bold text-slate-900 mt-0.5">{data.preferredDate}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Preferred Time</span>
                <p className="font-bold text-slate-900 mt-0.5">{data.preferredTime}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Location</span>
                <p className="font-semibold text-forest-900 mt-0.5">{data.location} Centre</p>
              </div>
            </div>
          </div>

          {/* Section 3: Selected Service(s) */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold-400">🪷</span>
              <span>3. Selected Service(s)</span>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {data.services && data.services.length > 0 ? (
                  data.services.map((svc) => (
                    <span
                      key={svc}
                      className="px-3 py-1.5 rounded-lg bg-forest-50 border border-forest-200/80 text-forest-950 font-bold text-xs flex items-center gap-1.5"
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-forest-800" />
                      <span>{svc}</span>
                      {svc === 'Other Services' && data.otherServiceDetails && (
                        <span className="font-normal text-slate-600">({data.otherServiceDetails})</span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No services specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Medical & Health Information */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold-400">🤍</span>
              <span>4. Medical & Health Information</span>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-700 font-medium">Currently under medical treatment?</span>
                <span className={`font-bold px-2.5 py-0.5 rounded ${
                  data.underMedicalTreatment === 'Yes' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                }`}>
                  {data.underMedicalTreatment || 'No'}
                </span>
              </div>

              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-slate-700 font-medium block">Known Allergies (products, medications, latex)?</span>
                  {data.hasAllergies === 'Yes' && data.allergiesDetails && (
                    <p className="text-[11px] text-amber-800 font-medium mt-1 bg-amber-50 p-1.5 rounded border border-amber-200">
                      Specified: {data.allergiesDetails}
                    </p>
                  )}
                </div>
                <span className={`font-bold px-2.5 py-0.5 rounded shrink-0 ${
                  data.hasAllergies === 'Yes' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-800'
                }`}>
                  {data.hasAllergies || 'No'}
                </span>
              </div>

              <div>
                <span className="text-slate-700 font-medium block mb-1.5">
                  Reported Conditions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries({
                    'Pregnancy': data.conditions.pregnancy,
                    'Diabetes': data.conditions.diabetes,
                    'Heart condition': data.conditions.heartCondition,
                    'Epilepsy': data.conditions.epilepsy,
                    'Skin infection': data.conditions.activeSkinInfection,
                    'Bleeding disorder': data.conditions.bleedingDisorder,
                    'Cancer (current/past)': data.conditions.cancer,
                    'Other': data.conditions.other,
                  }).map(([label, active]) => (
                    <div
                      key={label}
                      className={`p-1.5 rounded text-[11px] flex items-center gap-1.5 border ${
                        active
                          ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                          : 'bg-slate-50 border-slate-200/60 text-slate-400'
                      }`}
                    >
                      <span className="text-xs">{active ? '✓' : '—'}</span>
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </div>
                {data.conditions.other && data.conditions.otherDetails && (
                  <p className="text-[11px] text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                    Other details: {data.conditions.otherDetails}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Consent & Acknowledgements Verified */}
          <div className="rounded-xl border border-emerald-300 bg-[#F4F9F6] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>5. Consent & Acknowledgement (All 9 Clauses Confirmed & Agreed)</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Client has confirmed accuracy of health information, understood treatment boundaries as wellness and aesthetic therapies, consented to treatment risks/benefits, acknowledged variability of individual outcomes, agreed to notice requirements, released AVS and staff under reasonable care standards, and consented to contact and cancellation policies.
            </p>
          </div>

          {/* Section 6: Signature */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold-400">✏️</span>
              <span>6. Client Signature & Date</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">
                  Client Digital Signature
                </span>
                <div className="h-20 bg-[#FAF9F6] border border-[#CBDAD0] rounded-xl flex items-center justify-center p-2">
                  {data.signatureData ? (
                    <img
                      src={data.signatureData}
                      alt="Client Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400 italic">No signature image</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">
                  Date of Signature
                </span>
                <div className="h-20 bg-[#FAF9F6] border border-[#CBDAD0] rounded-xl flex flex-col justify-center px-4">
                  <p className="text-base font-bold text-slate-900">{data.signatureDate}</p>
                  {data.signedAt && (
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Timestamp: {new Date(data.signedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Footer Banner */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-200">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-[11px] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Record — Aura Vital Star Rejuvenation Centre Inc.</span>
            </div>
            <p className="font-serif italic text-sm text-forest-900">
              Thank You — For trusting us with your wellness journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
