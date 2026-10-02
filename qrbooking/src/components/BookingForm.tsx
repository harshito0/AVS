import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  User,
  Phone,
  Mail,
  Home,
  AlertCircle,
  Loader2,
  ChevronDown,
  CheckSquare,
  Square,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Heart
} from 'lucide-react';
import { ConsentFormData, BookingRequest, ValidationErrors } from '../types';
import { validateConsentForm } from '../utils/validation';
import { submitBooking } from '../services/bookingService';
import { SignaturePad } from './SignaturePad';

interface BookingFormProps {
  onSuccess: (bookingData: BookingRequest, bookingId?: string) => void;
}

const SERVICE_OPTIONS = [
  {
    id: 'HydraFacial',
    title: 'HydraFacial',
    desc: 'Deep cleansing, hydration and skin rejuvenation',
    image: '/hero_facial.webp'
  },
  {
    id: 'Laser Hair Removal',
    title: 'Laser Hair Removal',
    desc: 'Long-term hair reduction with advanced laser technology',
    image: '/svc_waxing_laser.webp'
  },
  {
    id: 'Body Treatments',
    title: 'Body Treatments',
    desc: 'Massage therapy, body contouring, detox and wellness therapies',
    image: '/gallery_hot_stones.webp'
  },
  {
    id: 'Facial Treatments',
    title: 'Facial Treatments',
    desc: 'Customized facials for healthy, glowing skin',
    image: '/salon_facial_glow.webp'
  },
  {
    id: 'Other Services',
    title: 'Other Services',
    desc: 'Please specify: e.g. RMT, Salon, Orthodontic, etc.',
    image: '/hero_massage.webp'
  }
];

const TIME_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM'
];

const LOCATIONS_LIST = [
  'Aura Vital Star Rejuvenation Centre Inc. - Brampton'
];

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ConsentFormData>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    preferredDate: todayStr,
    preferredTime: '',
    location: LOCATIONS_LIST[0],
    services: ['HydraFacial'],
    otherServiceDetails: '',
    underMedicalTreatment: '',
    hasAllergies: '',
    allergiesDetails: '',
    conditions: {
      pregnancy: false,
      epilepsy: false,
      bleedingDisorder: false,
      diabetes: false,
      activeSkinInfection: false,
      cancer: false,
      heartCondition: false,
      other: false,
      otherDetails: ''
    },
    acknowledgements: {
      accurateInfo: false,
      wellnessTreatment: false,
      risksBenefits: false,
      resultsVary: false,
      informChanges: false,
      releaseLiability: false,
      communicationConsent: false,
      cancellationPolicy: false,
      voluntaryChoice: false
    },
    signatureData: '',
    signatureType: 'draw',
    signatureDate: todayStr
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Field updates
  const handleInputChange = (field: keyof ConsentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  };

  // Service toggle
  const toggleService = (svcId: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(svcId);
      const updated = exists
        ? prev.services.filter((s) => s !== svcId)
        : [...prev.services, svcId];
      return { ...prev, services: updated };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  // Conditions toggle
  const toggleCondition = (key: keyof typeof formData.conditions) => {
    setFormData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [key]: !prev.conditions[key]
      }
    }));
  };

  // Acknowledgement toggle
  const toggleAcknowledgement = (key: keyof typeof formData.acknowledgements) => {
    setFormData((prev) => {
      const updated = {
        ...prev.acknowledgements,
        [key]: !prev.acknowledgements[key]
      };
      return { ...prev, acknowledgements: updated };
    });
    if (errors.acknowledgements) {
      setErrors((prev) => ({ ...prev, acknowledgements: undefined }));
    }
  };

  // Select all acknowledgements at once
  const handleSelectAllAcknowledgements = () => {
    setFormData((prev) => ({
      ...prev,
      acknowledgements: {
        accurateInfo: true,
        wellnessTreatment: true,
        risksBenefits: true,
        resultsVary: true,
        informChanges: true,
        releaseLiability: true,
        communicationConsent: true,
        cancellationPolicy: true,
        voluntaryChoice: true
      }
    }));
    if (errors.acknowledgements) {
      setErrors((prev) => ({ ...prev, acknowledgements: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateConsentForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstKey = Object.keys(validationErrors)[0];
      const targetId = `section-${firstKey}` || `field-${firstKey}`;
      const el = document.getElementById(targetId) || document.getElementById(`field-${firstKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare composite booking payload
    const primaryService = formData.services.join(', ');
    const bookingPayload: BookingRequest = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      dob: formData.dob,
      address: formData.address,
      service: primaryService,
      services: formData.services,
      location: 'Brampton',
      date: formData.preferredDate,
      time: formData.preferredTime,
      notes: `Consent Signed on ${formData.signatureDate}. Medical Treatment: ${formData.underMedicalTreatment}. Allergies: ${formData.hasAllergies === 'Yes' ? formData.allergiesDetails : 'None'}.`,
      source: 'QR Code Consent Form',
      consentForm: {
        ...formData,
        signedAt: new Date().toISOString()
      },
      consentCompleted: true
    };

    try {
      const response = await submitBooking(bookingPayload);
      if (response.success) {
        onSuccess(bookingPayload, response.bookingId);
      } else {
        setSubmitError(response.error || 'Failed to submit consent form. Please try again.');
      }
    } catch (err: any) {
      setSubmitError('Failed to submit consent form. Please try again or notify front desk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 pb-16">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-[#FCFAF6] border border-[#DFCBB0] rounded-3xl shadow-[0_16px_50px_-10px_rgba(24,72,59,0.12)] p-4 sm:p-9 space-y-7 relative overflow-hidden"
      >
        {/* Soft Decorative Ambient Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#EBE3D3]/40 via-transparent to-transparent pointer-events-none rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#E1ECE6]/40 via-transparent to-transparent pointer-events-none rounded-tr-full" />

        {/* ============================================================
            AUTHENTIC FLYER HEADER VIGNETTE
            ============================================================ */}
        <div className="relative pb-6 border-b border-[#D5C29D]/50">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Brand Crest & Name */}
            <div className="md:col-span-4 flex items-center md:items-start gap-4">
              <div className="relative group shrink-0">
                <img
                  src="/avs_logo.png"
                  alt="Aura Vital Star Logo"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-gold-700 font-semibold block leading-tight font-sans">
                  Where Wellness Meets Radiance
                </span>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-forest-950 uppercase tracking-tight mt-1">
                  Aura Vital Star
                </h1>
                <span className="text-[11px] font-semibold text-forest-850 uppercase tracking-wider block mt-0.5">
                  Rejuvenation Centre Inc.
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-gold-500 to-transparent mt-2" />
              </div>
            </div>

            {/* Center: Title & Safety Priority */}
            <div className="md:col-span-5 text-center md:text-left space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight uppercase leading-none">
                Client <span className="text-gold-600">Consent Form</span>
              </h2>
              <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-forest-850 uppercase font-sans">
                Your Safety. Our Priority.
              </p>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm pt-1">
                Please read and complete this form carefully before your appointment. This information helps us provide you with safe, effective and personalized care.
              </p>
            </div>

            {/* Right: Luxury Spa Still Life Header Graphic */}
            <div className="md:col-span-3 hidden md:block">
              <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#D5C29D]/60 group">
                <img
                  src="/spa_consent_header.jpg"
                  alt="Spa Wellness Accents"
                  className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to salon facial glow
                    (e.currentTarget as HTMLImageElement).src = '/salon_facial_glow.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/30 to-transparent pointer-events-none" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[9px] font-bold text-forest-900 tracking-wider uppercase backdrop-blur-xs">
                  AVS Wellness
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Error Notice Banner */}
        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[13px] text-rose-900">Submission Notice</p>
              <p className="mt-0.5 leading-relaxed">{submitError}</p>
            </div>
          </div>
        )}

        {/* ============================================================
            SECTION 1: CLIENT INFORMATION
            ============================================================ */}
        <div id="section-fullName" className="space-y-3">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs">
            <User className="w-4 h-4 text-gold-400" />
            <span>1. Client Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Full Name */}
            <div id="field-fullName" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Full Name <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.fullName ? 'has-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs font-medium"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div id="field-email" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Email Address <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.email ? 'has-error' : ''}`}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs font-medium"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div id="field-phone" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Phone Number <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.phone ? 'has-error' : ''}`}>
                <span className="pl-3 pr-1.5 text-xs text-slate-600 font-semibold shrink-0 select-none flex items-center gap-1">
                  <span>🇨🇦</span> +1
                </span>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full py-2.5 pr-3 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs font-medium"
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Date of Birth */}
            <div id="field-dob" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Date of Birth <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.dob ? 'has-error' : ''}`}>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs font-medium cursor-pointer"
                />
              </div>
              {errors.dob && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.dob}</p>
              )}
            </div>

            {/* Full Address */}
            <div id="field-address" className="sm:col-span-2 space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Address <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.address ? 'has-error' : ''}`}>
                <input
                  type="text"
                  placeholder="Enter your full address (Street, City, Province, Postal Code)"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs font-medium"
                />
              </div>
              {errors.address && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: APPOINTMENT DETAILS
            ============================================================ */}
        <div id="section-preferredDate" className="space-y-3">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>2. Appointment Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            {/* Preferred Date */}
            <div id="field-preferredDate" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Preferred Date <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.preferredDate ? 'has-error' : ''}`}>
                <input
                  type="date"
                  min={todayStr}
                  value={formData.preferredDate}
                  onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-transparent outline-none text-slate-800 text-xs font-medium cursor-pointer"
                />
              </div>
              {errors.preferredDate && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.preferredDate}</p>
              )}
            </div>

            {/* Preferred Time */}
            <div id="field-preferredTime" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Preferred Time <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box relative ${errors.preferredTime ? 'has-error' : ''}`}>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 bg-transparent outline-none text-slate-800 text-xs font-medium cursor-pointer appearance-none"
                >
                  <option value="">Select time</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
              </div>
              {errors.preferredTime && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.preferredTime}</p>
              )}
            </div>

            {/* Location */}
            <div id="field-location" className="space-y-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Location <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box relative ${errors.location ? 'has-error' : ''}`}>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-8 bg-transparent outline-none text-slate-800 text-xs font-medium cursor-pointer appearance-none truncate"
                >
                  {LOCATIONS_LIST.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
              </div>
              {errors.location && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.location}</p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 3: SELECT YOUR SERVICE(S) (Multiple choice)
            ============================================================ */}
        <div id="section-services" className="space-y-3">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-gold-400">🪷</span>
              <span>3. SELECT YOUR SERVICE(S) (You may choose multiple)</span>
              <span className="text-gold-400 font-bold">*</span>
            </div>
            <span className="text-[10px] text-emerald-200 font-medium hidden sm:inline">
              {formData.services.length} Selected
            </span>
          </div>

          {errors.services && (
            <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.services}</span>
            </p>
          )}

          {/* 5-Card Visual Grid with authentic photos matching flyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {SERVICE_OPTIONS.map((opt) => {
              const isChecked = formData.services.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleService(opt.id)}
                  className={`group relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-3 select-none ${
                    isChecked
                      ? 'bg-white border-forest-850 ring-2 ring-forest-850/20 shadow-md'
                      : 'bg-white/80 border-[#D9E3DD] hover:border-forest-700 hover:bg-white shadow-xs'
                  }`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-2.5 bg-slate-100">
                      <img
                        src={opt.image}
                        alt={opt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/hero_facial.webp';
                        }}
                      />
                      <div className="absolute top-1.5 left-1.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-forest-900 text-white shadow-sm'
                              : 'bg-white/90 border border-slate-300 text-transparent'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />}
                        </div>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-forest-900 transition-colors">
                      {opt.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      {opt.desc}
                    </p>
                  </div>

                  {opt.id === 'Other Services' && isChecked && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">
                        Please specify:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. RMT, Salon, Orthodontic, etc."
                        value={formData.otherServiceDetails || ''}
                        onChange={(e) => handleInputChange('otherServiceDetails', e.target.value)}
                        className={`w-full px-2 py-1.5 text-[11px] bg-slate-50 border rounded-lg outline-none ${
                          errors.otherServiceDetails ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            SECTION 4: MEDICAL & HEALTH INFORMATION
            ============================================================ */}
        <div id="section-underMedicalTreatment" className="space-y-4">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs">
            <span className="text-gold-400">🤍</span>
            <span>4. MEDICAL & HEALTH INFORMATION</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D9E3DD] space-y-4">
            {/* Question 1: Under medical treatment? */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">
                Are you currently under medical treatment? <span className="text-gold-600">*</span>
              </span>
              <div className="flex items-center gap-5">
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="underMedicalTreatment"
                    value="Yes"
                    checked={formData.underMedicalTreatment === 'Yes'}
                    onChange={() => handleInputChange('underMedicalTreatment', 'Yes')}
                    className="w-4 h-4 text-forest-900 accent-forest-900 cursor-pointer"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="underMedicalTreatment"
                    value="No"
                    checked={formData.underMedicalTreatment === 'No'}
                    onChange={() => handleInputChange('underMedicalTreatment', 'No')}
                    className="w-4 h-4 text-forest-900 accent-forest-900 cursor-pointer"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
            {errors.underMedicalTreatment && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.underMedicalTreatment}</p>
            )}

            {/* Question 2: Allergies? */}
            <div className="space-y-2 pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Do you have any allergies (e.g. products, medications, latex)? <span className="text-gold-600">*</span>
                </span>
                <div className="flex items-center gap-5">
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="Yes"
                      checked={formData.hasAllergies === 'Yes'}
                      onChange={() => handleInputChange('hasAllergies', 'Yes')}
                      className="w-4 h-4 text-forest-900 accent-forest-900 cursor-pointer"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="hasAllergies"
                      value="No"
                      checked={formData.hasAllergies === 'No'}
                      onChange={() => handleInputChange('hasAllergies', 'No')}
                      className="w-4 h-4 text-forest-900 accent-forest-900 cursor-pointer"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.hasAllergies === 'Yes' && (
                <div className="pt-1.5 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                    If yes, please specify:
                  </span>
                  <input
                    type="text"
                    placeholder="Enter details (e.g. latex, eucalyptus, tea tree, aspirin)..."
                    value={formData.allergiesDetails || ''}
                    onChange={(e) => handleInputChange('allergiesDetails', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-forest-800"
                  />
                </div>
              )}
              {errors.allergiesDetails && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.allergiesDetails}</p>
              )}
            </div>

            {/* Question 3: Conditions checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 block">
                Do you have any of the following conditions? <span className="text-[10px] text-slate-500 font-normal">(Please select all that apply)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {[
                  { key: 'pregnancy', label: 'Pregnancy or trying to conceive' },
                  { key: 'epilepsy', label: 'Epilepsy' },
                  { key: 'bleedingDisorder', label: 'Bleeding disorder' },
                  { key: 'diabetes', label: 'Diabetes' },
                  { key: 'activeSkinInfection', label: 'Active skin infection' },
                  { key: 'cancer', label: 'Cancer (current or past)' },
                  { key: 'heartCondition', label: 'Heart condition' },
                  { key: 'other', label: 'Other (Please specify)' }
                ].map(({ key, label }) => {
                  const isChecked = formData.conditions[key as keyof typeof formData.conditions];
                  return (
                    <label
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                        isChecked
                          ? 'bg-forest-50/70 border-forest-700 text-forest-950 font-bold'
                          : 'bg-[#FAFBF9] border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(isChecked)}
                        onChange={() => toggleCondition(key as keyof typeof formData.conditions)}
                        className="w-3.5 h-3.5 rounded text-forest-900 accent-forest-900 cursor-pointer"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  );
                })}
              </div>

              {formData.conditions.other && (
                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600 shrink-0">
                    Other condition details:
                  </span>
                  <input
                    type="text"
                    placeholder="Enter details..."
                    value={formData.conditions.otherDetails || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        conditions: { ...prev.conditions, otherDetails: e.target.value }
                      }))
                    }
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-forest-800"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 5: CONSENT & ACKNOWLEDGEMENT (Mandatory)
            ============================================================ */}
        <div id="section-acknowledgements" className="space-y-3">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" />
              <span>5. CONSENT & ACKNOWLEDGEMENT</span>
              <span className="text-gold-400 font-bold">*</span>
            </div>
            <button
              type="button"
              onClick={handleSelectAllAcknowledgements}
              className="text-[10px] font-bold text-gold-300 hover:text-white underline cursor-pointer"
            >
              Agree to All (9 Clauses)
            </button>
          </div>

          {errors.acknowledgements && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">{errors.acknowledgements}</span>
            </div>
          )}

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D9E3DD] space-y-3">
            {[
              {
                key: 'accurateInfo',
                text: 'I confirm that the information provided above is true and accurate to the best of my knowledge.'
              },
              {
                key: 'wellnessTreatment',
                text: 'I understand that the services provided at Aura Vital Star Rejuvenation Centre Inc. (AVS) are wellness and aesthetic treatments and are not a substitute for medical advice, diagnosis, or treatment.'
              },
              {
                key: 'risksBenefits',
                text: 'I understand the potential risks, side effects, and benefits of the selected treatment(s), and I give my consent to proceed.'
              },
              {
                key: 'resultsVary',
                text: 'I acknowledge that individual results may vary and no specific outcome is guaranteed.'
              },
              {
                key: 'informChanges',
                text: 'I agree to inform the staff of any changes in my medical condition prior to my appointment.'
              },
              {
                key: 'releaseLiability',
                text: 'I release AVS, its staff, and practitioners from any liability for adverse reactions, complications, or outcomes that may occur, provided the services are performed with reasonable care.'
              },
              {
                key: 'communicationConsent',
                text: 'I consent to the use of my contact information for appointment reminders and service updates.'
              },
              {
                key: 'cancellationPolicy',
                text: "I understand that a cancellation or rescheduling policy applies and I will provide at least 24 hours' notice for any changes."
              },
              {
                key: 'voluntaryChoice',
                text: 'I have read, understood, and agree to the above, and I am voluntarily choosing to undergo the selected treatment(s).'
              }
            ].map(({ key, text }) => {
              const isChecked = formData.acknowledgements[key as keyof typeof formData.acknowledgements];
              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-colors cursor-pointer select-none text-xs leading-relaxed ${
                    isChecked
                      ? 'bg-forest-50/50 border-forest-300 text-slate-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAcknowledgement(key as keyof typeof formData.acknowledgements)}
                    className="w-4 h-4 mt-0.5 rounded text-forest-900 accent-forest-900 cursor-pointer shrink-0"
                  />
                  <span>{text}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            SECTION 6: SIGNATURE & DATE
            ============================================================ */}
        <div id="section-signatureData" className="space-y-3">
          <div className="bg-[#134739] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs">
            <span className="text-gold-400">✏️</span>
            <span>6. SIGNATURE</span>
            <span className="text-gold-400 font-bold">*</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D9E3DD] grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
            {/* Signature Canvas */}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Client Signature <span className="text-gold-600 font-bold">*</span>
              </label>
              <SignaturePad
                value={formData.signatureData}
                hasError={Boolean(errors.signatureData)}
                onChange={(dataUrl, type) => {
                  setFormData((prev) => ({
                    ...prev,
                    signatureData: dataUrl,
                    signatureType: type
                  }));
                  if (errors.signatureData) {
                    setErrors((prev) => ({ ...prev, signatureData: undefined }));
                  }
                }}
              />
              {errors.signatureData && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.signatureData}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                Date <span className="text-gold-600 font-bold">*</span>
              </label>
              <div className={`form-input-box ${errors.signatureDate ? 'has-error' : ''}`}>
                <input
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                  className="w-full px-3 py-3 bg-transparent outline-none text-slate-800 text-xs font-semibold cursor-pointer"
                />
              </div>
              {errors.signatureDate && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.signatureDate}</p>
              )}
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-gold-200/80 mt-2">
                <span className="text-[10px] uppercase font-bold text-forest-900 block">
                  Official Verification
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                  By signing, this form is recorded directly to your client profile at Aura Vital Star.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            BOTTOM VERIFICATION BANNER & SUBMISSION
            ============================================================ */}
        <div className="pt-2 space-y-5">
          {/* Green Shield Guarantee Banner matching flyer */}
          <div className="p-4 rounded-2xl bg-[#EAF4EE] border border-[#2D7A58]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest-900 text-gold-400 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-forest-950 uppercase tracking-wide leading-relaxed">
                By submitting this form, I confirm that I have read, understood, and agree to all the terms and conditions above.
              </p>
            </div>
            <div className="shrink-0 text-center sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-forest-200">
              <span className="font-serif italic text-lg sm:text-xl font-bold text-forest-900 block leading-tight">
                Thank You
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 block">
                For trusting us with your wellness journey
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0F5B47] via-[#165B46] to-[#0B4031] hover:from-[#0B4031] hover:to-[#0F5B47] text-white font-serif font-bold text-base tracking-wider uppercase shadow-xl shadow-forest-900/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed border border-gold-400/40"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-gold-300" />
                <span>Recording Client Consent & Booking...</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" />
                <span>Submit Client Consent &amp; Confirm Booking</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};