import { BookingRequest, ValidationErrors } from '../types';

export const validateBookingForm = (data: BookingRequest): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Full Name
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Please enter your full name.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  // Phone Number
  const cleanPhone = data.phone.replace(/[^0-9]/g, '');
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Please enter your phone number.';
  } else if (cleanPhone.length < 10) {
    errors.phone = 'Please provide a valid 10-digit phone number.';
  }

  // Email Address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  // Service
  if (!data.service || !data.service.trim()) {
    errors.service = 'Please select a treatment or service.';
  }

  // Location
  if (!data.location || !data.location.trim()) {
    errors.location = 'Please select your preferred location.';
  }

  // Date
  if (!data.date || !data.date.trim()) {
    errors.date = 'Please select a preferred date.';
  } else {
    const selected = new Date(`${data.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selected.getTime())) {
      errors.date = 'Invalid date format.';
    } else if (selected < today) {
      errors.date = 'Appointment date cannot be in the past.';
    }
  }

  // Time
  if (!data.time || !data.time.trim()) {
    errors.time = 'Please choose a preferred time slot.';
  }

  return errors;
};

export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};