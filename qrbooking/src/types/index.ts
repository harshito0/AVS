export interface MedicalConditions {
  pregnancy: boolean;
  epilepsy: boolean;
  bleedingDisorder: boolean;
  diabetes: boolean;
  activeSkinInfection: boolean;
  cancer: boolean;
  heartCondition: boolean;
  other: boolean;
  otherDetails?: string;
}

export interface ConsentAcknowledgements {
  accurateInfo: boolean; // I confirm that the information provided above is true and accurate to the best of my knowledge.
  wellnessTreatment: boolean; // I understand that the services provided at Aura Vital Star Rejuvenation Centre Inc. (AVS) are wellness and aesthetic treatments and are not a substitute for medical advice, diagnosis, or treatment.
  risksBenefits: boolean; // I understand the potential risks, side effects, and benefits of the selected treatment(s), and I give my consent to proceed.
  resultsVary: boolean; // I acknowledge that individual results may vary and no specific outcome is guaranteed.
  informChanges: boolean; // I agree to inform the staff of any changes in my medical condition prior to my appointment.
  releaseLiability: boolean; // I release AVS, its staff, and practitioners from any liability for adverse reactions, complications, or outcomes that may occur, provided the services are performed with reasonable care.
  communicationConsent: boolean; // I consent to the use of my contact information for appointment reminders and service updates.
  cancellationPolicy: boolean; // I understand that a cancellation or rescheduling policy applies and I will provide at least 24 hours' notice for any changes.
  voluntaryChoice: boolean; // I have read, understood, and agree to the above, and I am voluntarily choosing to undergo the selected treatment(s).
}

export interface ConsentFormData {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  services: string[];
  otherServiceDetails?: string;
  underMedicalTreatment: 'Yes' | 'No' | '';
  hasAllergies: 'Yes' | 'No' | '';
  allergiesDetails?: string;
  conditions: MedicalConditions;
  acknowledgements: ConsentAcknowledgements;
  signatureData: string;
  signatureType: 'draw' | 'type';
  signatureDate: string;
  signedAt?: string;
}

export interface BookingRequest {
  fullName: string;
  phone: string;
  email: string;
  dob?: string;
  address?: string;
  service: string;
  services?: string[];
  location: string;
  date: string;
  time: string;
  notes?: string;
  source?: string;
  consentForm?: ConsentFormData;
  consentCompleted?: boolean;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  message?: string;
  data?: BookingRequest;
  error?: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  services?: string;
  otherServiceDetails?: string;
  underMedicalTreatment?: string;
  hasAllergies?: string;
  allergiesDetails?: string;
  conditions?: string;
  otherConditionDetails?: string;
  acknowledgements?: string;
  signatureData?: string;
  signatureDate?: string;
}