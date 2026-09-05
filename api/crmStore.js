// ============================================================
// Aura Vital Star — Centralized CRM Persistent Data Store
// Shared across serverless functions (api/crm.js & api/bookings.js)
// ============================================================

import fs from 'fs';
import path from 'path';

export const STORE_PATH = process.env.VERCEL
  ? '/tmp/avs_crm_store.json'
  : path.join(process.cwd(), 'server', 'data', 'avs_crm_store.json');

// Memory store fallback
let store = {
  clients: [],
  appointments: [],
  leads: [],
  invoices: [],
  giftCards: [],
  notifications: [],
  services: [],
  packages: [],
  lastUpdated: new Date().toISOString()
};

/**
 * Loads the current store from disk (/tmp on Vercel or local JSON)
 */
export function loadCrmStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        store.clients = Array.isArray(parsed.clients) ? parsed.clients : [];
        store.appointments = Array.isArray(parsed.appointments) ? parsed.appointments : [];
        store.leads = Array.isArray(parsed.leads) ? parsed.leads : [];
        store.invoices = Array.isArray(parsed.invoices) ? parsed.invoices : [];
        store.giftCards = Array.isArray(parsed.giftCards) ? parsed.giftCards : [];
        store.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
        if (Array.isArray(parsed.services) && parsed.services.length) store.services = parsed.services;
        if (Array.isArray(parsed.packages) && parsed.packages.length) store.packages = parsed.packages;
      }
    }
  } catch (err) {
    console.error('[CRM Store] Error loading store:', err.message);
  }
  return store;
}

/**
 * Persists the store to disk atomically
 */
export function saveCrmStore(updatedStore) {
  try {
    if (updatedStore) {
      store = { ...store, ...updatedStore };
    }
    store.lastUpdated = new Date().toISOString();
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CRM Store] Error saving store:', err.message);
  }
  return store;
}

/**
 * Retrieves the in-memory store reference
 */
export function getCrmStore() {
  return loadCrmStore();
}

/**
 * Registers an appointment booked through the website or CRM into the database.
 * Creates/links client, updates visit statistics, creates CRM notification,
 * and records lead attribution.
 */
export function recordWebsiteBooking(bookingData) {
  loadCrmStore();

  const customerName = (bookingData.name || bookingData.customerName || bookingData.clientName || 'Valued Guest').trim();
  const phone = (bookingData.phone || bookingData.guestPhone || '').trim();
  const email = (bookingData.email || bookingData.guestEmail || '').toLowerCase().trim();
  const service = bookingData.service || bookingData.serviceName || 'AVS Signature Treatment';
  const serviceCategory = bookingData.serviceCategory || 'Massage & Wellness';
  const rawLoc = (bookingData.locationName || bookingData.location || 'Brampton').toString().toLowerCase();
  const location = rawLoc.includes('mississauga') ? 'Mississauga' : 'Brampton';
  const date = bookingData.date || new Date().toISOString().split('T')[0];
  const time = bookingData.time || '10:00 AM';
  const duration = bookingData.duration || '60 min';
  const notes = bookingData.notes || '';
  const source = bookingData.source || 'Website';
  const amount = Number(bookingData.amount) || 100;

  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const apptId = bookingData.id || `AVS-${year}-${randomNum}`;

  // 1. Deduplication Check
  const existingApt = store.appointments.find((a) => a.id === apptId);
  if (existingApt) {
    const existingClient = store.clients.find((c) => c.id === existingApt.clientId);
    return { appointment: existingApt, client: existingClient };
  }

  // 2. Resolve or Create Client
  const normPhone = phone.replace(/\D/g, '');
  let client = store.clients.find((c) => {
    if (email && c.email && c.email.toLowerCase() === email) return true;
    if (normPhone && c.phone && c.phone.replace(/\D/g, '').slice(-7) === normPhone.slice(-7)) return true;
    return false;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  if (client) {
    client.totalVisits = (client.totalVisits || 0) + 1;
    client.totalSpent = (client.totalSpent || 0) + amount;
    client.lastVisit = date;
    client.lastService = service;
    if (!client.phone && phone) client.phone = phone;
    if (!client.email && email) client.email = email;
    client.location = location;
  } else {
    const nameParts = customerName.split(' ');
    client = {
      id: 'cl-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      firstName: nameParts[0] || 'Guest',
      lastName: nameParts.slice(1).join(' ') || '',
      fullName: customerName,
      phone: phone,
      email: email,
      location: location,
      totalVisits: 1,
      totalSpent: amount,
      status: 'Active',
      lastVisit: date,
      lastService: service,
      createdAt: todayStr
    };
    store.clients.unshift(client);
  }

  // 3. Create Appointment
  const newApt = {
    id: apptId,
    clientId: client.id,
    clientName: client.fullName,
    phone: client.phone || phone,
    email: client.email || email,
    service: service,
    serviceCategory: serviceCategory,
    staff: bookingData.staff || 'Staff Specialist',
    location: location,
    date: date,
    time: time,
    duration: duration,
    status: bookingData.status || 'Pending',
    amount: amount,
    notes: notes,
    source: source,
    createdAt: new Date().toISOString()
  };
  store.appointments.unshift(newApt);

  // 4. Create Notification
  store.notifications.unshift({
    id: 'notif-' + Date.now(),
    title: 'New Appointment Booked',
    message: `${customerName} booked ${service} for ${date} at ${time} (${location})`,
    type: 'appointment',
    read: false,
    createdAt: new Date().toISOString()
  });

  // 5. Attribute or Update Lead
  const existingLead = store.leads.find(
    (l) =>
      (email && l.email && l.email.toLowerCase() === email) ||
      (normPhone && l.phone && l.phone.replace(/\D/g, '').slice(-7) === normPhone.slice(-7))
  );

  if (!existingLead) {
    store.leads.unshift({
      id: 'ld-' + Date.now(),
      name: customerName,
      phone: phone,
      email: email,
      source: source,
      status: 'Converted',
      service: service,
      location: location,
      notes: `Booked online via ${source}. Notes: ${notes}`,
      createdAt: todayStr
    });
  } else {
    existingLead.status = 'Converted';
  }

  // 6. Save Store
  saveCrmStore();

  return { appointment: newApt, client };
}
