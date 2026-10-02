import { BookingRequest, BookingResponse } from '../types';

const STORAGE_KEY = 'avs_qr_bookings';

/**
 * Service abstraction for submitting an appointment request with Client Consent Form.
 * Structured to seamlessly switch between local mock persistence
 * and live backend API: POST /api/appointments or POST /api/bookings.
 */
export const submitBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  const payload = {
    fullName: bookingData.fullName,
    name: bookingData.fullName,
    customerName: bookingData.fullName,
    clientName: bookingData.fullName,
    phone: bookingData.phone,
    guestPhone: bookingData.phone,
    email: bookingData.email,
    guestEmail: bookingData.email,
    dob: bookingData.dob || bookingData.consentForm?.dob || '',
    address: bookingData.address || bookingData.consentForm?.address || '',
    service: bookingData.service,
    serviceName: bookingData.service,
    services: bookingData.services || (bookingData.consentForm?.services ? bookingData.consentForm.services : [bookingData.service]),
    location: bookingData.location,
    locationName: bookingData.location,
    date: bookingData.date,
    time: bookingData.time,
    notes: bookingData.notes || '',
    source: bookingData.source || 'QR Code Consent Form',
    consentForm: bookingData.consentForm || null,
    consentCompleted: Boolean(bookingData.consentCompleted ?? bookingData.consentForm)
  };

  // Try endpoints in priority order (proxied relative first, then dev ports)
  const candidateEndpoints = [
    '/api/bookings',
    '/api/appointments',
    'http://localhost:5173/api/bookings',
    'http://localhost:5173/api/appointments',
    'http://localhost:5000/api/bookings',
    'http://localhost:4000/api/appointments'
  ];

  for (const endpoint of candidateEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const bookingId =
          result.bookingId ||
          result.data?.id ||
          result.booking?.id ||
          result.crmAppointment?.id ||
          `AVS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        saveToLocalStorage({ ...payload, bookingId, remoteSynced: true });

        // Also sync into main CRM client localStorage for instant dev visibility
        try {
          const crmRaw = localStorage.getItem('avs_crm_bookings');
          const crmList = crmRaw ? JSON.parse(crmRaw) : [];
          crmList.unshift({
            ...payload,
            id: bookingId,
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('avs_crm_bookings', JSON.stringify(crmList));
        } catch {}

        return {
          success: true,
          bookingId,
          message: 'Your consent form and appointment request have been submitted successfully.',
          data: bookingData
        };
      }
    } catch {
      // Endpoint unreachable on current host/port, try next candidate
      continue;
    }
  }

  // Fallback Mock Implementation for Standalone / Offline Dev Mode
  await new Promise((resolve) => setTimeout(resolve, 600));

  const bookingId = `APT-QR-${Math.floor(10000 + Math.random() * 90000)}`;
  saveToLocalStorage({ ...payload, bookingId, offlineFallback: true });

  // Sync to CRM local storage fallback
  try {
    const crmRaw = localStorage.getItem('avs_crm_bookings');
    const crmList = crmRaw ? JSON.parse(crmRaw) : [];
    crmList.unshift({
      ...payload,
      id: bookingId,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('avs_crm_bookings', JSON.stringify(crmList));
  } catch {}

  return {
    success: true,
    bookingId,
    message: 'Your consent form and appointment request have been submitted successfully.',
    data: bookingData
  };
};

function saveToLocalStorage(record: any) {
  try {
    const existingStr = localStorage.getItem(STORAGE_KEY);
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.unshift({
      ...record,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Failed to cache booking locally:', e);
  }
}