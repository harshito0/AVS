import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { BookingRequest, ValidationErrors } from '../types';
import { validateBookingForm } from '../utils/validation';
import { submitBooking } from '../services/bookingService';

interface BookingFormProps {
  onSuccess: (bookingData: BookingRequest, bookingId?: string) => void;
}

const SERVICES_LIST = [
  'RMT Massage Therapy',
  'Deep Tissue Massage',
  'Aroma Therapy',
  'Hot Stone Therapy',
  'Facials',
  'Laser Hair Removal',
  'Hair Spa & Treatment',
  'Nail Care',
  'Other'
];

const LOCATIONS_LIST = [
  'Brampton',
  'Mississauga'
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

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<BookingRequest>({
    fullName: '',
    phone: '',
    email: '',
    service: '',
    location: 'Brampton',
    date: '',
    time: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Minimum date: today (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  const handleChange = (field: keyof BookingRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear individual error as user types
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Validate
    const validationErrors = validateBookingForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await submitBooking(formData);
      if (response.success) {
        onSuccess(formData, response.bookingId);
      } else {
        setSubmitError(
          response.error ||
          'Unable to submit your appointment right now. Please try again or contact us directly.'
        );
      }
    } catch (err: any) {
      setSubmitError(
        'Unable to submit your appointment right now. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-[#E3EAE5] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 sm:p-8 space-y-5"
      >
        {/* Global Error Banner */}
        {submitError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[13px] text-rose-900">Submission Notice</p>
              <p className="mt-0.5 leading-relaxed">{submitError}</p>
            </div>
          </div>
        )}

        {/* 1. Full Name */}
        <div id="field-fullName" className="space-y-1.5">
          <label htmlFor="input-fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Full Name <span className="text-gold-600 font-bold">*</span>
          </label>
          <div className={`form-input-box ${errors.fullName ? 'has-error' : ''}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
              <User className="w-5 h-5" />
            </div>
            <input
              id="input-fullName"
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full py-3.5 pr-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
              <span>•</span> {errors.fullName}
            </p>
          )}
        </div>

        {/* 2. Phone Number & Email Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Phone */}
          <div id="field-phone" className="space-y-1.5">
            <label htmlFor="input-phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Phone Number <span className="text-gold-600 font-bold">*</span>
            </label>
            <div className={`form-input-box ${errors.phone ? 'has-error' : ''}`}>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
                <Phone className="w-5 h-5" />
              </div>
              <input
                id="input-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full py-3.5 pr-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
                <span>•</span> {errors.phone}
              </p>
            )}
          </div>

          {/* Email */}
          <div id="field-email" className="space-y-1.5">
            <label htmlFor="input-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address <span className="text-gold-600 font-bold">*</span>
            </label>
            <div className={`form-input-box ${errors.email ? 'has-error' : ''}`}>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="input-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full py-3.5 pr-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* 3. Service Selection */}
        <div id="field-service" className="space-y-1.5">
          <label htmlFor="select-service" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Service / Treatment <span className="text-gold-600 font-bold">*</span>
          </label>
          <div className={`form-input-box relative ${errors.service ? 'has-error' : ''}`}>
            <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
              <Sparkles className="w-5 h-5" />
            </div>
            <select
              id="select-service"
              name="service"
              value={formData.service}
              onChange={(e) => handleChange('service', e.target.value)}
              className="w-full py-3.5 pr-10 bg-transparent outline-none text-slate-800 text-sm font-medium cursor-pointer appearance-none"
            >
              <option value="">Select a service or treatment...</option>
              {SERVICES_LIST.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          {errors.service && (
            <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
              <span>•</span> {errors.service}
            </p>
          )}
        </div>

        {/* 4. Location Selection */}
        <div id="field-location" className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Preferred Location <span className="text-gold-600 font-bold">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {LOCATIONS_LIST.map((loc) => {
              const isSelected = formData.location === loc;
              return (
                <button
                  type="button"
                  key={loc}
                  onClick={() => handleChange('location', loc)}
                  className={`py-3.5 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                    isSelected
                      ? 'bg-forest-900 border-forest-900 text-white shadow-md shadow-forest-900/10'
                      : 'bg-white border-[#D9E3DD] text-slate-700 hover:border-forest-700 hover:bg-forest-50/50'
                  }`}
                >
                  <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-gold-400' : 'text-slate-400'}`} />
                  <span>{loc}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-gold-400 ml-0.5"></span>}
                </button>
              );
            })}
          </div>
          {errors.location && (
            <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
              <span>•</span> {errors.location}
            </p>
          )}
        </div>

        {/* 5. Date & Time Selection (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preferred Date */}
          <div id="field-date" className="space-y-1.5">
            <label htmlFor="input-date" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Preferred Date <span className="text-gold-600 font-bold">*</span>
            </label>
            <div className={`form-input-box ${errors.date ? 'has-error' : ''}`}>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
                <Calendar className="w-5 h-5" />
              </div>
              <input
                id="input-date"
                type="date"
                name="date"
                min={todayStr}
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full py-3.5 pr-4 bg-transparent outline-none text-slate-800 text-sm font-medium cursor-pointer"
              />
            </div>
            {errors.date && (
              <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
                <span>•</span> {errors.date}
              </p>
            )}
          </div>

          {/* Preferred Time */}
          <div id="field-time" className="space-y-1.5">
            <label htmlFor="select-time" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Preferred Time <span className="text-gold-600 font-bold">*</span>
            </label>
            <div className={`form-input-box relative ${errors.time ? 'has-error' : ''}`}>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 shrink-0 select-none">
                <Clock className="w-5 h-5" />
              </div>
              <select
                id="select-time"
                name="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full py-3.5 pr-10 bg-transparent outline-none text-slate-800 text-sm font-medium cursor-pointer appearance-none"
              >
                <option value="">Select time...</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 flex items-center">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {errors.time && (
              <p className="text-xs text-rose-600 font-medium pl-1 flex items-center gap-1">
                <span>•</span> {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* 6. Message / Notes (Optional) */}
        <div id="field-notes" className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="input-notes" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Message / Notes
            </label>
            <span className="text-[11px] text-slate-400 font-medium">Optional</span>
          </div>
          <div className="form-input-box items-start">
            <div className="w-12 pt-3.5 flex items-center justify-center text-slate-400 shrink-0 select-none">
              <FileText className="w-5 h-5" />
            </div>
            <textarea
              id="input-notes"
              rows={3}
              name="notes"
              placeholder="Any specific requests, health conditions, or areas of focus..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full py-3 pr-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-sm font-medium resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* 7. Large Mobile-Friendly Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-forest-900 via-forest-850 to-forest-800 hover:from-forest-950 hover:to-forest-850 text-white font-bold text-base tracking-wider uppercase shadow-lg shadow-forest-900/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Book Appointment</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};