/**
 * Aura Vital Star — CRM & Booking Data Service
 * Manages appointment persistence, source attribution (Website, QR Code, Direct Link),
 * status updates, and email confirmation payloads.
 */

const STORAGE_KEY = 'avs_crm_bookings';

/**
 * Detects the booking source based on URL query params, referrer, or defaults
 */
export function detectBookingSource() {
  if (typeof window === 'undefined') return 'Direct Link';
  
  const params = new URLSearchParams(window.location.search);
  const sourceParam = params.get('source') || params.get('utm_source');
  
  if (sourceParam) {
    const s = sourceParam.toLowerCase();
    if (s.includes('qr') || s === 'qrcode') return 'QR Code';
    if (s.includes('web') || s === 'site') return 'Website';
    if (s.includes('insta') || s === 'ig') return 'Instagram';
    if (s.includes('fb') || s === 'facebook') return 'Facebook';
    return sourceParam;
  }
  
  const hash = window.location.hash || '';
  if (hash.includes('source=qr') || hash.includes('src=qr')) return 'QR Code';
  
  if (document.referrer && document.referrer.length > 0) {
    if (!document.referrer.includes(window.location.hostname)) {
      return 'Direct Link';
    }
  }
  
  return 'Website';
}

/**
 * Generates an elegant booking ID: AVS-YYYY-XXXX
 */
function generateBookingId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `AVS-${year}-${randomNum}`;
}

/**
 * Retrieves all stored bookings from localStorage
 */
export function getBookings() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Filter out any previous dummy seed records if present
    const cleaned = parsed.filter(
      (b) => b.id !== 'AVS-2026-8142' && b.id !== 'AVS-2026-7935'
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (err) {
    console.error('Failed to parse CRM bookings:', err);
    return [];
  }
}

/**
 * Fetches latest bookings from the backend database (with localStorage fallback)
 */
export async function syncBookingsFromApi() {
  try {
    const res = await fetch('/api/bookings');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.bookings)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.bookings));
        return data.bookings;
      }
    }
  } catch (e) {
    // Backend offline or local dev
  }
  return getBookings();
}

/**
 * Sends a 6-digit registration OTP to the provided email
 */
export async function sendOtpEmail(email, name = '') {
  // Primary attempt: /api/send-otp
  try {
    const res = await fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) return data;
    }
  } catch (err) {
    console.warn('Primary /api/send-otp endpoint unreachable:', err.message);
  }

  // Secondary attempt: /api/bookings
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        customerName: name || 'Valued Guest',
        service: 'Email Registration OTP Verification'
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        return {
          success: true,
          otp: data.otp || data.booking?.otp,
          emailSent: true
        };
      }
    }
  } catch (err) {
    console.warn('Secondary /api/bookings endpoint unreachable:', err.message);
  }

  // Local Dev Fallback: Ensure user testing is never blocked if backend server is offline
  const localOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`[Local Dev Mode] Backend offline; generated test OTP: ${localOtp}`);
  return {
    success: true,
    otp: localOtp,
    isLocalFallback: true,
    message: `Local Dev Mode: Test OTP generated is ${localOtp}`
  };
}

/**
 * Creates and saves a new booking into the database and triggers Gmail confirmation + OTP
 */
export async function createBooking(bookingData) {
  const current = getBookings();
  const otpCode = bookingData.otp || Math.floor(100000 + Math.random() * 900000).toString();

  const newBooking = {
    id: generateBookingId(),
    customerName: bookingData.name || bookingData.customerName || 'Valued Guest',
    phone: bookingData.phone || '',
    email: bookingData.email || '',
    otp: otpCode,
    location: bookingData.location || 'Brampton Rejuvenation Centre',
    service: bookingData.service || 'AVS Signature Treatment',
    serviceCategory: bookingData.serviceCategory || 'General Wellness',
    duration: bookingData.duration || '60 min',
    date: bookingData.date || '',
    time: bookingData.time || '',
    notes: bookingData.notes || '',
    source: bookingData.source || detectBookingSource(),
    createdAt: new Date().toISOString(),
    status: 'PENDING'
  };

  const updated = [newBooking, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save booking to CRM:', err);
  }

  // Send to backend database and trigger real email + OTP
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Booking saved in database & email sent:', data);
      if (data.otp) {
        newBooking.otp = data.otp;
      }
    } else {
      const errText = await res.text();
      console.warn('Backend returned error status:', res.status, errText);
    }
  } catch (err) {
    console.warn('Backend API not reachable; saved locally:', err);
  }

  return newBooking;
}

/**
 * Updates a booking's status: PENDING, CONFIRMED, COMPLETED, CANCELLED
 */
export function updateBookingStatus(bookingId, status) {
  const current = getBookings();
  const updated = current.map((b) => (b.id === bookingId ? { ...b, status } : b));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update booking status:', err);
  }

  // Notify backend
  fetch(`/api/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).catch(() => {});

  return updated;
}

/**
 * Deletes a booking by ID
 */
export function deleteBooking(bookingId) {
  const current = getBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete booking:', err);
  }
  return updated;
}

/**
 * Formats a raw Canadian/US phone string into (XXX) XXX-XXXX
 */
export function formatPhoneNumber(value) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Formats date string into luxury editorial date (e.g. 'Thursday, September 18, 2026')
 */
export function formatLuxuryDate(dateString) {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return dateString;
  } catch {
    return dateString;
  }
}
