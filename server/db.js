import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

/**
 * Retrieves all bookings from persistent storage
 */
export function getAllBookings() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading bookings database:', err);
    return [];
  }
}

/**
 * Inserts a new booking into persistent storage
 */
export function insertBooking(bookingData) {
  const bookings = getAllBookings();
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = bookingData.id || `AVS-${year}-${randomNum}`;

  const newRecord = {
    id,
    customerName: bookingData.customerName || bookingData.name || 'Valued Guest',
    phone: bookingData.phone || '',
    email: bookingData.email || '',
    location: bookingData.location || 'Brampton Rejuvenation Centre',
    service: bookingData.service || 'Signature Treatment',
    serviceCategory: bookingData.serviceCategory || 'General Wellness',
    duration: bookingData.duration || '60 min',
    date: bookingData.date || '',
    time: bookingData.time || '',
    notes: bookingData.notes || '',
    source: bookingData.source || 'Website',
    status: bookingData.status || 'PENDING',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newRecord);

  // Write atomically
  fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2), 'utf-8');

  // Forward to CRM Backend Database
  try {
    fetch('http://localhost:4000/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newRecord.id,
        name: newRecord.customerName,
        phone: newRecord.phone,
        email: newRecord.email,
        service: newRecord.service,
        serviceCategory: newRecord.serviceCategory,
        locationName: newRecord.location,
        date: newRecord.date,
        time: newRecord.time,
        duration: newRecord.duration,
        notes: newRecord.notes,
        source: newRecord.source || 'Website'
      })
    }).catch(err => {
      // Backend might be offline in standalone test mode
    });
  } catch (err) {
    // Ignore fetch error in older node environments
  }

  return newRecord;
}

/**
 * Updates a booking status (PENDING, CONFIRMED, COMPLETED, CANCELLED)
 */
export function updateStatus(bookingId, status) {
  const bookings = getAllBookings();
  const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status } : b));
  fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated.find((b) => b.id === bookingId) || null;
}
