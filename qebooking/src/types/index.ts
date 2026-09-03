export interface BookingRequest {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  date: string;
  time: string;
  notes?: string;
  source?: string;
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
  phone?: string;
  email?: string;
  service?: string;
  location?: string;
  date?: string;
  time?: string;
}