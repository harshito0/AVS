// ============================================================
// Aura Vital Star — Centralized CRM Persistent Data Store
// Shared across serverless functions (api/crm.js & api/bookings.js)
// Real-time CMS for Services, Packages, and Gallery
// ============================================================

import fs from 'fs';
import path from 'path';

export const STORE_PATH = process.env.VERCEL
  ? '/tmp/avs_crm_store.json'
  : path.join(process.cwd(), 'server', 'data', 'avs_crm_store.json');

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

// Memory store fallback
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
        store.services = Array.isArray(parsed.services) ? parsed.services : [...DEFAULT_SERVICES];
        store.packages = Array.isArray(parsed.packages) ? parsed.packages : [...DEFAULT_PACKAGES];
        store.gallery = Array.isArray(parsed.gallery) ? parsed.gallery : [...DEFAULT_GALLERY];
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

// -------------------------------------------------------------
// CMS: SERVICES METHODS
// -------------------------------------------------------------
export function getServices() {
  const s = loadCrmStore();
  if (!s.services || s.services.length === 0) {
    s.services = [...DEFAULT_SERVICES];
    saveCrmStore();
  }
  return s.services;
}

export function addService(data) {
  loadCrmStore();
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
  saveCrmStore();
  return newSvc;
}

export function updateService(id, data) {
  loadCrmStore();
  const svc = store.services.find(s => s.id === id);
  if (svc) {
    Object.assign(svc, data);
    saveCrmStore();
  }
  return svc;
}

export function deleteService(id) {
  loadCrmStore();
  store.services = store.services.filter(s => s.id !== id);
  saveCrmStore();
  return { deleted: true, id };
}

// -------------------------------------------------------------
// CMS: PACKAGES METHODS
// -------------------------------------------------------------
export function getPackages() {
  const s = loadCrmStore();
  if (!s.packages || s.packages.length === 0) {
    s.packages = [...DEFAULT_PACKAGES];
    saveCrmStore();
  }
  return s.packages;
}

export function addPackage(data) {
  loadCrmStore();
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
  saveCrmStore();
  return newPkg;
}

export function updatePackage(id, data) {
  loadCrmStore();
  const pkg = store.packages.find(p => p.id === id);
  if (pkg) {
    Object.assign(pkg, data);
    saveCrmStore();
  }
  return pkg;
}

export function deletePackage(id) {
  loadCrmStore();
  store.packages = store.packages.filter(p => p.id !== id);
  saveCrmStore();
  return { deleted: true, id };
}

// -------------------------------------------------------------
// CMS: GALLERY METHODS
// -------------------------------------------------------------
export function getGallery() {
  const s = loadCrmStore();
  if (!s.gallery || s.gallery.length === 0) {
    s.gallery = [...DEFAULT_GALLERY];
    saveCrmStore();
  }
  return s.gallery;
}

export function addGalleryItem(data) {
  loadCrmStore();
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
  saveCrmStore();
  return newItem;
}

export function updateGalleryItem(id, data) {
  loadCrmStore();
  const item = store.gallery.find(g => g.id === id);
  if (item) {
    Object.assign(item, data);
    saveCrmStore();
  }
  return item;
}

export function deleteGalleryItem(id) {
  loadCrmStore();
  store.gallery = store.gallery.filter(g => g.id !== id);
  saveCrmStore();
  return { deleted: true, id };
}

// -------------------------------------------------------------
// BOOKING REGISTRATION
// -------------------------------------------------------------
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
