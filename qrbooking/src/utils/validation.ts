import { ConsentFormData, ValidationErrors } from '../types';

export const validateConsentForm = (data: ConsentFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // 1. Client Information
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email Address is required.';
  } else if (!emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  const cleanPhone = data.phone ? data.phone.replace(/[^0-9]/g, '') : '';
  if (!data.phone || !data.phone.trim()) {
    errors.phone = 'Phone Number is required.';
  } else if (cleanPhone.length < 10) {
    errors.phone = 'Please provide a valid 10-digit phone number.';
  }

  if (!data.dob || !data.dob.trim()) {
    errors.dob = 'Date of Birth is required.';
  }

  if (!data.address || !data.address.trim()) {
    errors.address = 'Full Address (Street, City, Province, Postal Code) is required.';
  }

  // 2. Appointment Details
  if (!data.preferredDate || !data.preferredDate.trim()) {
    errors.preferredDate = 'Preferred Date is required.';
  } else {
    const selected = new Date(`${data.preferredDate}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selected.getTime())) {
      errors.preferredDate = 'Invalid date format.';
    } else if (selected < today) {
      errors.preferredDate = 'Appointment date cannot be in the past.';
    }
  }

  if (!data.preferredTime || !data.preferredTime.trim()) {
    errors.preferredTime = 'Preferred Time is required.';
  }

  if (!data.location || !data.location.trim()) {
    errors.location = 'Location selection is required.';
  }

  // 3. Service Selection (At least one required)
  if (!data.services || data.services.length === 0) {
    errors.services = 'Please select at least one treatment or service.';
  } else if (data.services.includes('Other Services') && (!data.otherServiceDetails || !data.otherServiceDetails.trim())) {
    errors.otherServiceDetails = 'Please specify the service (e.g. RMT, Salon, Orthodontic, etc.).';
  }

  // 4. Medical & Health Information
  if (!data.underMedicalTreatment) {
    errors.underMedicalTreatment = 'Please indicate if you are currently under medical treatment.';
  }

  if (!data.hasAllergies) {
    errors.hasAllergies = 'Please indicate if you have any allergies.';
  } else if (data.hasAllergies === 'Yes' && (!data.allergiesDetails || !data.allergiesDetails.trim())) {
    errors.allergiesDetails = 'Please specify details of your allergies.';
  }

  if (data.conditions.other && (!data.conditions.otherDetails || !data.conditions.otherDetails.trim())) {
    errors.otherConditionDetails = 'Please specify the other medical condition.';
  }

  // 5. Consent & Acknowledgement (All 9 checkboxes are strictly mandatory)
  const a = data.acknowledgements;
  const allAcknowledged =
    a.accurateInfo &&
    a.wellnessTreatment &&
    a.risksBenefits &&
    a.resultsVary &&
    a.informChanges &&
    a.releaseLiability &&
    a.communicationConsent &&
    a.cancellationPolicy &&
    a.voluntaryChoice;

  if (!allAcknowledged) {
    errors.acknowledgements =
      'Please read and check all consent & acknowledgement clauses to proceed with your booking.';
  }

  // 6. Signature
  if (!data.signatureData || !data.signatureData.trim()) {
    errors.signatureData = 'Client signature is mandatory to proceed.';
  }

  if (!data.signatureDate || !data.signatureDate.trim()) {
    errors.signatureDate = 'Signature date is required.';
  }

  return errors;
};

export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};