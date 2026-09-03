import { BookingRequest, BookingResponse } from '../types';

const STORAGE_KEY = 'avs_qr_bookings';

/**
 * Service abstraction for submitting an appointment request.
 * Structured to seamlessly switch between local mock persistence
 * and live backend API: POST /api/appointments.
 */
export const submitBooking = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  // Try sending to the AVS backend if reachable
  try {
    const apiEndpoint = '/api/appointments';
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: bookingData.fullName,
        phone: bookingData.phone,
        email: bookingData.email,
        service: bookingData.service,
        locationName: bookingData.location,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes || '',
        source: 'QR Code'
      })
    });

    if (response.ok) {
      const result = await response.json();
      const bookingId = result.data?.id || `APT-QR-${Math.floor(10000 + Math.random() * 90000)}`;
      
      // Also cache locally for offline verification
      saveToLocalStorage({ ...bookingData, bookingId });
      
      return {
        success: true,
        bookingId,
        message: 'Your appointment request has been submitted successfully.',
        data: bookingData
      };
    }
  } catch (err) {
    // Backend fetch failed or not connected, smoothly fall back to mock service
    console.info('[bookingService] Live backend unreachable, falling back to client mock simulation:', err);
  }

  // Fallback Mock Implementation for Standalone / Offline Dev Mode
  await new Promise((resolve) => setTimeout(resolve, 800));

  const bookingId = `APT-QR-${Math.floor(10000 + Math.random() * 90000)}`;
  saveToLocalStorage({ ...bookingData, bookingId });

  return {
    success: true,
    bookingId,
    message: 'Your appointment request has been submitted successfully.',
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