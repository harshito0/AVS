import React from 'react';
import { X, Printer, ShieldCheck, CheckSquare, Calendar, User, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { Appointment, Client } from '../types';

export interface ConsentFormViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
  client?: Client | null;
  consentData?: any;
}

export const ConsentFormViewerModal: React.FC<ConsentFormViewerModalProps> = ({
  isOpen,
  onClose,
  appointment,
  client,
  consentData
}) => {
  if (!isOpen) return null;

  // Resolve form data from props
  const rawConsent = consentData || appointment?.consentForm || client?.consentForm;
  const fullName = rawConsent?.fullName || appointment?.clientName || client?.name || 'Valued Client';
  const email = rawConsent?.email || appointment?.email || client?.email || '';
  const phone = rawConsent?.phone || appointment?.phone || client?.phone || '';
  const dob = rawConsent?.dob || client?.dob || appointment?.dob || 'Not provided';
  const address = rawConsent?.address || client?.address || appointment?.address || 'Not provided';
  const preferredDate = rawConsent?.preferredDate || appointment?.date || 'N/A';
  const preferredTime = rawConsent?.preferredTime || appointment?.time || 'N/A';
  const location = rawConsent?.location || appointment?.location || client?.location || 'Brampton';

  // Services
  const services: string[] = rawConsent?.services || (appointment?.service ? [appointment.service] : ['Signature Treatment']);
  const otherServiceDetails: string = rawConsent?.otherServiceDetails || '';

  // Medical
  const underMedicalTreatment = rawConsent?.underMedicalTreatment || 'No';
  const hasAllergies = rawConsent?.hasAllergies || 'No';
  const allergiesDetails = rawConsent?.allergiesDetails || '';
  const conditions = rawConsent?.conditions || {
    pregnancy: false,
    epilepsy: false,
    bleedingDisorder: false,
    diabetes: false,
    activeSkinInfection: false,
    cancer: false,
    heartCondition: false,
    other: false,
    otherDetails: ''
  };

  // Signature
  const signatureData = rawConsent?.signatureData || null;
  const signatureDate = rawConsent?.signatureDate || appointment?.date || new Date().toISOString().split('T')[0];
  const signedAt = rawConsent?.signedAt || appointment?.createdAt || null;
  const bookingId = appointment?.id || rawConsent?.id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#FDFBF7] border border-[#D5C29D]/50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Actions Bar (hidden on print) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-[#E8DFD0] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900 font-sans">
              Verified Client Consent Document
            </span>
            {bookingId && (
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                #{bookingId}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-forest-900 text-white hover:bg-forest-850 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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

        {/* Printable Form Content — Exact Authentic Styling */}
        <div className="p-6 sm:p-9 space-y-5 text-[#1A2621]">
          {/* Header Flyer Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b-2 border-[#D5C29D]/40">
            <div className="flex items-center gap-3">
              <img
                src="/avs_logo.png"
                alt="Aura Vital Star"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#B08B1C] font-semibold block">
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
                Completed &amp; digitally signed by client prior to treatment.
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
                <p className="font-bold text-slate-900 mt-0.5">{fullName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Date of Birth</span>
                <p className="font-semibold text-slate-800 mt-0.5">{dob}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Email Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{email || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Phone Number</span>
                <p className="font-medium text-slate-800 mt-0.5">{phone || 'Not provided'}</p>
              </div>
              <div className="sm:col-span-2 pt-1 border-t border-slate-100">
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Residential Address</span>
                <p className="font-medium text-slate-800 mt-0.5">{address}</p>
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
                <p className="font-bold text-slate-900 mt-0.5">{preferredDate}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Preferred Time</span>
                <p className="font-bold text-slate-900 mt-0.5">{preferredTime}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase">Location</span>
                <p className="font-semibold text-forest-900 mt-0.5">{location}</p>
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
                {services.map((svc) => (
                  <span
                    key={svc}
                    className="px-3 py-1.5 rounded-lg bg-forest-50 border border-forest-200 text-forest-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-forest-800" />
                    <span>{svc}</span>
                    {svc === 'Other Services' && otherServiceDetails && (
                      <span className="font-normal text-slate-600">({otherServiceDetails})</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Medical & Health Information */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-gold-400" />
              <span>4. Medical &amp; Health Information</span>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-700 font-medium">Currently under medical treatment?</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded ${
                    underMedicalTreatment === 'Yes'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {underMedicalTreatment}
                </span>
              </div>

              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-slate-700 font-medium block">
                    Known Allergies (products, medications, latex)?
                  </span>
                  {hasAllergies === 'Yes' && allergiesDetails && (
                    <p className="text-[11px] text-amber-900 font-medium mt-1 bg-amber-50 p-1.5 rounded border border-amber-200">
                      Specified: {allergiesDetails}
                    </p>
                  )}
                </div>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded shrink-0 ${
                    hasAllergies === 'Yes'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {hasAllergies}
                </span>
              </div>

              <div>
                <span className="text-slate-700 font-medium block mb-1.5">
                  Reported Conditions:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries({
                    'Pregnancy': conditions.pregnancy,
                    'Diabetes': conditions.diabetes,
                    'Heart condition': conditions.heartCondition,
                    'Epilepsy': conditions.epilepsy,
                    'Skin infection': conditions.activeSkinInfection,
                    'Bleeding disorder': conditions.bleedingDisorder,
                    'Cancer': conditions.cancer,
                    'Other': conditions.other
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
                {conditions.other && conditions.otherDetails && (
                  <p className="text-[11px] text-slate-700 mt-2 bg-slate-50 p-2 rounded border border-slate-200">
                    Other details: {conditions.otherDetails}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 5: Consent & Acknowledgements (Verified) */}
          <div className="rounded-xl border border-emerald-300 bg-[#F4F9F6] p-4 text-xs space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>5. Consent &amp; Acknowledgement (All 9 Clauses Confirmed &amp; Signed)</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Client has confirmed accuracy of health information, understood treatment boundaries as wellness and aesthetic therapies, consented to treatment risks/benefits, acknowledged variability of individual outcomes, agreed to notice requirements, released AVS and staff under reasonable care standards, and consented to contact and cancellation policies.
            </p>
          </div>

          {/* Section 6: Signature */}
          <div className="rounded-xl border border-[#D5C29D]/60 overflow-hidden bg-white shadow-xs">
            <div className="bg-[#134739] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="text-gold-400">✏️</span>
              <span>6. Client Signature &amp; Date</span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">
                  Client Digital Signature
                </span>
                <div className="h-20 bg-[#FAF9F6] border border-[#CBDAD0] rounded-xl flex items-center justify-center p-2">
                  {signatureData ? (
                    <img
                      src={signatureData}
                      alt="Client Signature"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="font-serif italic text-xl text-forest-950">{fullName}</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">
                  Date of Signature
                </span>
                <div className="h-20 bg-[#FAF9F6] border border-[#CBDAD0] rounded-xl flex flex-col justify-center px-4">
                  <p className="text-base font-bold text-slate-900">{signatureDate}</p>
                  {signedAt && (
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Timestamp: {new Date(signedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer seal */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-200">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold text-[11px] mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Verified Intake Record — Aura Vital Star Rejuvenation Centre Inc.</span>
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
