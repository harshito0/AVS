// ============================================================
// Aura Vital Star — Centralized CRM Persistent Data Store
// Shared across serverless functions (api/crm.js & api/bookings.js)
// Real-time CMS for Services, Packages, Gallery, Appointments, Clients, Leads
//
// PERSISTENCE STRATEGY:
//   - ON VERCEL:  Uses Upstash Redis (permanent, cross-instance, cross-deployment)
//   - LOCAL DEV:  Uses server/data/avs_crm_store.json (file-based, unchanged)
// ============================================================

import fs from 'fs';
import path from 'path';

// ──────────────────────────────────────────────────────────────
// Redis client (lazy-initialised only on Vercel)
// ──────────────────────────────────────────────────────────────
const IS_VERCEL = !!(process.env.VERCEL || process.env.UPSTASH_REDIS_REST_URL);
const REDIS_KEY  = 'avs_crm_store';

let _redisClient = null;

async function getRedis() {
  if (_redisClient) return _redisClient;

  const url   = process.env.UPSTASH_REDIS_REST_URL
             || process.env.KV_REST_API_URL
             || 'https://correct-boar-165805.upstash.io';

  const token = process.env.UPSTASH_REDIS_REST_TOKEN
             || process.env.KV_REST_API_TOKEN
             || 'gQAAAAAAAoetAAIgcDFmZDM0NWY3ZWU3ZmI0ZDZlODkzMjA4MGQ0ZmM1MzA4Zg';

  if (!url || !token) {
    return null;
  }

  try {
    const { Redis } = await import('@upstash/redis');
    _redisClient = new Redis({ url, token });
    return _redisClient;
  } catch (err) {
    console.warn('[CRM Store] Redis initialization error:', err.message);
    return null;
  }
}


// ──────────────────────────────────────────────────────────────
// Local (dev) file path — never used on Vercel
// ──────────────────────────────────────────────────────────────
export const STORE_PATH = path.join(process.cwd(), 'server', 'data', 'avs_crm_store.json');

// ──────────────────────────────────────────────────────────────
// Default Seed Data
// ──────────────────────────────────────────────────────────────
export const DEFAULT_SERVICES = [
  {
    id: 'svc-1',
    name: 'Hair Spa & Head Massage',
    category: 'Hair Spa',
    price: 95,
    duration: '60 min',
    status: 'Active',
    description: 'Relax, refresh, and nourish your hair with warm botanical oils and acupressure scalp massage.',
    imageUrl: '/svc_hair_head.webp'
  },
  {
    id: 'svc-2',
    name: 'Body Massage & Pain Relief Therapy',
    category: 'Massage Therapy',
    price: 120,
    duration: '60 min',
    status: 'Active',
    description: 'Experience complete relaxation with essential oil massages, targeted pressure, and pain relief therapy.',
    imageUrl: '/hero_massage.webp'
  },
  {
    id: 'svc-3',
    name: 'Facials – All Types of Facials',
    category: 'Facial & Skincare',
    price: 110,
    duration: '60 min',
    status: 'Active',
    description: 'Rejuvenate your skin with personalized luxury botanical facials for an enduring natural glow.',
    imageUrl: '/salon_facial_glow.webp'
  },
  {
    id: 'svc-4',
    name: 'Organic Spa & Facials',
    category: 'Facial & Skincare',
    price: 130,
    duration: '60 min',
    status: 'Active',
    description: 'Experience the goodness of certified organic floral waters and plant elixirs for radiant skin.',
    imageUrl: '/brand_editorial.webp'
  },
  {
    id: 'svc-5',
    name: 'Body Polishing Ritual',
    category: 'Body Rituals',
    price: 125,
    duration: '60 min',
    status: 'Active',
    description: 'Exfoliate, brighten and rejuvenate your skin with mineral sea salts and golden hydration balm.',
    imageUrl: '/svc_body_polishing.webp'
  },
  {
    id: 'svc-6',
    name: 'Foot Spa – Pamper Your Feet',
    category: 'Nail Care',
    price: 75,
    duration: '45 min',
    status: 'Active',
    description: 'Give your feet the care they deserve with artisan copper basin soaks and pressure-point massage.',
    imageUrl: '/svc_foot_spa.webp'
  },
  {
    id: 'svc-7',
    name: 'Couple Retreats',
    category: 'Massage Therapy',
    price: 220,
    duration: '75 min',
    status: 'Active',
    description: 'Relax, rejuvenate and bond together in a candlelit private sanctuary suite.',
    imageUrl: '/svc_couple_retreat.webp'
  },
  {
    id: 'svc-8',
    name: 'Waxing & Laser Care',
    category: 'Laser & Waxing',
    price: 90,
    duration: '45 min',
    status: 'Active',
    description: 'Smooth, gentle, and long-lasting hair removal with advanced cooling technology.',
    imageUrl: '/svc_waxing_laser.webp'
  },
  {
    id: 'svc-9',
    name: 'RMT Massage Therapy',
    category: 'Massage Therapy',
    price: 100,
    duration: '60 min',
    status: 'Active',
    description: 'Registered Massage Therapy covered by extended health insurance for muscle relief and recovery.',
    imageUrl: '/hero_massage.webp'
  }
];

export const DEFAULT_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Rejuvenation Express',
    category: 'Complete Wellness',
    sessions: 2,
    price: 180,
    originalPrice: 225,
    discount: 20,
    status: 'Active',
    description: 'A deeply restorative journey combining 60-min therapeutic massage with our signature glowing facial ritual.',
    servicesIncluded: ['Therapeutic Body Massage', 'Radiance Hydra Facial'],
    imageUrl: '/hero_relaxation.webp'
  },
  {
    id: 'pkg-2',
    name: 'The Ultimate Glow Retreat',
    category: 'Beauty & Rejuvenation',
    sessions: 3,
    price: 290,
    originalPrice: 380,
    discount: 24,
    status: 'Active',
    description: 'Comprehensive luxury beauty makeover featuring organic deep facial, scalp detox, and full-body botanical polish.',
    servicesIncluded: ['Organic Spa Facial', 'Scalp Detox & Hair Spa', 'Body Polishing Ritual'],
    imageUrl: '/brand_editorial.webp'
  },
  {
    id: 'pkg-3',
    name: 'AVS Sanctuary Couples Immersion',
    category: 'Special Experiences',
    sessions: 1,
    price: 340,
    originalPrice: 420,
    discount: 19,
    status: 'Active',
    description: 'Side-by-side couples massage in our candlelit private suite with hot stones, champagne tea, and aromatherapy.',
    servicesIncluded: ['Couples Full-Body Massage', 'Volcanic Basalt Hot Stones', 'Herbal Foot Soak'],
    imageUrl: '/svc_couple_retreat.webp'
  }
];

export const DEFAULT_GALLERY = [
  {
    id: 'gal-1',
    title: 'Basalt Hot Stone Ritual',
    category: 'Treatments',
    description: 'Heated volcanic basalt stones combined with organic essential oils melt deep muscular tension, restoring vital energy.',
    imageUrl: '/gallery_hot_stones.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  },
  {
    id: 'gal-2',
    title: 'Glow & Rejuvenate Facial',
    category: 'Treatments',
    description: 'Personalized luxury botanical facial designed to deeply nourish, refresh, and restore natural luminosity.',
    imageUrl: '/hero_facial.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  },
  {
    id: 'gal-3',
    title: 'The Grand AVS Sanctuary Lounge',
    category: 'Lounge',
    description: 'Step into our tranquil sanctuary featuring curved emerald velvet, fluted natural oak, and warm ambient lighting.',
    imageUrl: '/gallery_lounge_interior.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  },
  {
    id: 'gal-4',
    title: 'Therapeutic Massage Suite',
    category: 'Spa Suites',
    description: 'Targeted deep tissue and relaxation strokes by certified Registered Massage Professionals.',
    imageUrl: '/hero_massage.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  },
  {
    id: 'gal-5',
    title: 'Scalp Detox & Hair Spa',
    category: 'Treatments',
    description: 'An invigorating scalp massage and deeply restorative hair treatment using nourishing botanical extracts.',
    imageUrl: '/svc_hair_head.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  },
  {
    id: 'gal-6',
    title: 'Harmony Couples Retreat',
    category: 'Spa Suites',
    description: 'Immerse together in a private candlelit suite with dual treatment beds and hot aromatic towel compresses.',
    imageUrl: '/svc_couple_retreat.webp',
    status: 'Published',
    dateAdded: '2026-09-01'
  }
];

// ──────────────────────────────────────────────────────────────
// In-memory fallback store (used locally or when Redis unavailable)
// ──────────────────────────────────────────────────────────────
let store = {
  clients: [],
  appointments: [],
  leads: [],
  invoices: [],
  giftCards: [],
  notifications: [],
  services: [...DEFAULT_SERVICES],
  packages: [...DEFAULT_PACKAGES],
  gallery: [...DEFAULT_GALLERY],
  lastUpdated: new Date().toISOString()
};

// ──────────────────────────────────────────────────────────────
// LOCAL DEV: file-based helpers
// ──────────────────────────────────────────────────────────────
function loadFromFile() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      if (raw && raw.trim().length > 0) {
        const parsed = JSON.parse(raw);
        store.clients       = Array.isArray(parsed.clients)       ? parsed.clients       : [];
        store.appointments  = Array.isArray(parsed.appointments)  ? parsed.appointments  : [];
        store.leads         = Array.isArray(parsed.leads)         ? parsed.leads         : [];
        store.invoices      = Array.isArray(parsed.invoices)      ? parsed.invoices      : [];
        store.giftCards     = Array.isArray(parsed.giftCards)     ? parsed.giftCards     : [];
        store.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
        store.services      = Array.isArray(parsed.services)      ? parsed.services      : [...DEFAULT_SERVICES];
        store.packages      = Array.isArray(parsed.packages)      ? parsed.packages      : [...DEFAULT_PACKAGES];
        store.gallery       = Array.isArray(parsed.gallery)       ? parsed.gallery       : [...DEFAULT_GALLERY];
      }
    }
  } catch (err) {
    console.error('[CRM Store] Error reading file store:', err.message);
  }
  return store;
}

function saveToFile() {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    store.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CRM Store] Error writing file store:', err.message);
  }
}

// ──────────────────────────────────────────────────────────────
// VERCEL: Redis helpers
// ──────────────────────────────────────────────────────────────
async function loadFromRedis() {
  const redis = await getRedis();
  if (!redis) return null;
  try {
    const data = await redis.get(REDIS_KEY);
    if (!data) return null;
    // Upstash returns already-parsed JSON objects
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    store.clients       = Array.isArray(parsed.clients)       ? parsed.clients       : [];
    store.appointments  = Array.isArray(parsed.appointments)  ? parsed.appointments  : [];
    store.leads         = Array.isArray(parsed.leads)         ? parsed.leads         : [];
    store.invoices      = Array.isArray(parsed.invoices)      ? parsed.invoices      : [];
    store.giftCards     = Array.isArray(parsed.giftCards)     ? parsed.giftCards     : [];
    store.notifications = Array.isArray(parsed.notifications) ? parsed.notifications : [];
    store.services      = Array.isArray(parsed.services)      ? parsed.services      : [...DEFAULT_SERVICES];
    store.packages      = Array.isArray(parsed.packages)      ? parsed.packages      : [...DEFAULT_PACKAGES];
    store.gallery       = Array.isArray(parsed.gallery)       ? parsed.gallery       : [...DEFAULT_GALLERY];
    return store;
  } catch (err) {
    console.error('[CRM Store] Error reading Redis store:', err.message);
    return null;
  }
}

async function saveToRedis() {
  const redis = await getRedis();
  if (!redis) return;
  try {
    store.lastUpdated = new Date().toISOString();
    await redis.set(REDIS_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('[CRM Store] Error writing Redis store:', err.message);
  }
}

// ──────────────────────────────────────────────────────────────
// PUBLIC API — async, works in both environments
// ──────────────────────────────────────────────────────────────

/**
 * Loads the current store from Redis (Vercel) or local file (dev).
 * Always returns the store object.
 */
export async function loadCrmStore() {
  try {
    const result = await loadFromRedis();
    if (result) {
      saveToFile();
      return store;
    }
  } catch (err) {
    console.warn('[CRM Store] Failed to load from Redis:', err.message);
  }
  return loadFromFile();
}

/**
 * Persists the current store to Redis (Vercel) or local file (dev).
 */
export async function saveCrmStore(updatedStore) {
  if (updatedStore) {
    store = { ...store, ...updatedStore };
  }
  try {
    await saveToRedis();
  } catch (err) {
    console.warn('[CRM Store] Failed to save to Redis:', err.message);
  }
  saveToFile();
  return store;
}

/**
 * Retrieves current store (alias for loadCrmStore for compatibility)
 */
export async function getCrmStore() {
  return loadCrmStore();
}

// ──────────────────────────────────────────────────────────────
// CMS: SERVICES
// ──────────────────────────────────────────────────────────────
export async function getServices() {
  const s = await loadCrmStore();
  if (!s.services || s.services.length === 0) {
    store.services = [...DEFAULT_SERVICES];
    await saveCrmStore();
  }
  return store.services;
}

export async function addService(data) {
  await loadCrmStore();
  const newSvc = {
    id: data.id || ('svc-' + Date.now()),
    name: data.name || data.title || 'New Service',
    category: data.category || 'Massage Therapy',
    price: Number(data.price) || 100,
    duration: data.duration || '60 min',
    status: data.status || 'Active',
    description: data.description || data.desc || '',
    imageUrl: data.imageUrl || data.image || '/hero_massage.webp'
  };
  store.services.unshift(newSvc);
  await saveCrmStore();
  return newSvc;
}

export async function updateService(id, data) {
  await loadCrmStore();
  const svc = store.services.find(s => s.id === id);
  if (svc) {
    Object.assign(svc, data);
    await saveCrmStore();
  }
  return svc;
}

export async function deleteService(id) {
  await loadCrmStore();
  store.services = store.services.filter(s => s.id !== id);
  await saveCrmStore();
  return { deleted: true, id };
}

// ──────────────────────────────────────────────────────────────
// CMS: PACKAGES
// ──────────────────────────────────────────────────────────────
export async function getPackages() {
  const s = await loadCrmStore();
  if (!s.packages || s.packages.length === 0) {
    store.packages = [...DEFAULT_PACKAGES];
    await saveCrmStore();
  }
  return store.packages;
}

export async function addPackage(data) {
  await loadCrmStore();
  const originalPrice = Number(data.originalPrice) || Number(data.price) || 200;
  const price = Number(data.price) || originalPrice;
  const discount = Number(data.discount) || (originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);

  const newPkg = {
    id: data.id || ('pkg-' + Date.now()),
    name: data.name || data.title || 'New Package',
    category: data.category || 'Wellness',
    sessions: Number(data.sessions) || 1,
    price,
    originalPrice,
    discount,
    status: data.status || 'Active',
    description: data.description || data.desc || '',
    servicesIncluded: Array.isArray(data.servicesIncluded) ? data.servicesIncluded : [],
    imageUrl: data.imageUrl || data.image || '/hero_relaxation.webp'
  };
  store.packages.unshift(newPkg);
  await saveCrmStore();
  return newPkg;
}

export async function updatePackage(id, data) {
  await loadCrmStore();
  const pkg = store.packages.find(p => p.id === id);
  if (pkg) {
    Object.assign(pkg, data);
    await saveCrmStore();
  }
  return pkg;
}

export async function deletePackage(id) {
  await loadCrmStore();
  store.packages = store.packages.filter(p => p.id !== id);
  await saveCrmStore();
  return { deleted: true, id };
}

// ──────────────────────────────────────────────────────────────
// CMS: GALLERY
// ──────────────────────────────────────────────────────────────
export async function getGallery() {
  const s = await loadCrmStore();
  if (!s.gallery || s.gallery.length === 0) {
    store.gallery = [...DEFAULT_GALLERY];
    await saveCrmStore();
  }
  return store.gallery;
}

export async function addGalleryItem(data) {
  await loadCrmStore();
  const newItem = {
    id: data.id || ('gal-' + Date.now()),
    title: data.title || 'Sanctuary Scene',
    category: data.category || 'Treatments',
    description: data.description || data.desc || '',
    imageUrl: data.imageUrl || data.image || '/gallery_lounge_interior.webp',
    status: data.status || 'Published',
    dateAdded: new Date().toISOString().split('T')[0]
  };
  store.gallery.unshift(newItem);
  await saveCrmStore();
  return newItem;
}

export async function updateGalleryItem(id, data) {
  await loadCrmStore();
  const item = store.gallery.find(g => g.id === id);
  if (item) {
    Object.assign(item, data);
    await saveCrmStore();
  }
  return item;
}

export async function deleteGalleryItem(id) {
  await loadCrmStore();
  store.gallery = store.gallery.filter(g => g.id !== id);
  await saveCrmStore();
  return { deleted: true, id };
}

// ──────────────────────────────────────────────────────────────
// BOOKING REGISTRATION
// Records a new appointment from Website, QR, or CRM manual entry
// Creates/updates client, appointment, lead, and notification
// ──────────────────────────────────────────────────────────────
export async function recordWebsiteBooking(bookingData) {
  await loadCrmStore();

  const customerName    = (bookingData.name || bookingData.customerName || bookingData.clientName || 'Valued Guest').trim();
  const phone           = (bookingData.phone || bookingData.guestPhone || '').trim();
  const email           = (bookingData.email || bookingData.guestEmail || '').toLowerCase().trim();
  const service         = bookingData.service || bookingData.serviceName || 'AVS Signature Treatment';
  const serviceCategory = bookingData.serviceCategory || 'Massage & Wellness';
  const rawLoc          = (bookingData.locationName || bookingData.location || 'Brampton').toString().toLowerCase();
  const location        = rawLoc.includes('mississauga') ? 'Mississauga' : 'Brampton';
  const date            = bookingData.date || new Date().toISOString().split('T')[0];
  const time            = bookingData.time || '10:00 AM';
  const duration        = bookingData.duration || '60 min';
  const notes           = bookingData.notes || '';
  const source          = bookingData.source || 'Website';
  const amount          = Number(bookingData.amount) || 100;

  const year      = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const apptId    = bookingData.id || `AVS-${year}-${randomNum}`;

  // 1. Deduplication Check
  const existingApt = store.appointments.find(a => a.id === apptId);
  if (existingApt) {
    const existingClient = store.clients.find(c => c.id === existingApt.clientId);
    return { appointment: existingApt, client: existingClient };
  }

  // 2. Resolve or Create Client
  const normPhone = phone.replace(/\D/g, '');
  let client = store.clients.find(c => {
    if (email && c.email && c.email.toLowerCase() === email) return true;
    if (normPhone && c.phone && c.phone.replace(/\D/g, '').slice(-7) === normPhone.slice(-7)) return true;
    return false;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  if (client) {
    client.totalVisits = (client.totalVisits || 0) + 1;
    client.totalSpent  = (client.totalSpent  || 0) + amount;
    client.lastVisit   = date;
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
      phone,
      email,
      location,
      totalVisits: 1,
      totalSpent: amount,
      status: 'Active',
      lastVisit: date,
      lastService: service,
      createdAt: todayStr
    };
    store.clients.unshift(client);
  }

  // 3. Create Appointment record
  const newApt = {
    id: apptId,
    clientId: client.id,
    clientName: client.fullName,
    phone: client.phone || phone,
    email: client.email || email,
    service,
    serviceCategory,
    staff: bookingData.staff || 'Staff Specialist',
    location,
    date,
    time,
    duration,
    status: bookingData.status || 'Pending',
    amount,
    notes,
    source,
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
    l =>
      (email    && l.email && l.email.toLowerCase() === email) ||
      (normPhone && l.phone && l.phone.replace(/\D/g, '').slice(-7) === normPhone.slice(-7))
  );

  if (!existingLead) {
    store.leads.unshift({
      id: 'ld-' + Date.now(),
      name: customerName,
      phone,
      email,
      source,
      status: 'Converted',
      service,
      location,
      notes: `Booked online via ${source}. Notes: ${notes}`,
      createdAt: todayStr
    });
  } else {
    existingLead.status = 'Converted';
  }

  // 6. Persist
  await saveCrmStore();

  return { appointment: newApt, client };
}

export async function deleteAppointment(id) {
  await loadCrmStore();
  const prevCount = store.appointments.length;
  store.appointments = store.appointments.filter(a => a.id !== id);
  const deleted = store.appointments.length < prevCount;
  if (deleted) {
    await saveCrmStore();
  }
  return { success: deleted, id };
}

