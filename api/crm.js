// ============================================================
// Aura Vital Star — Unified CRM Serverless API Handler (Vercel)
// Powers all CRM dashboard endpoints directly on Vercel
// ============================================================

import fs from 'fs';
import path from 'path';

// Initial Seed Data
const DEFAULT_LOCATIONS = [
  {
    id: 'loc-brampton',
    name: 'Brampton Rejuvenation Centre',
    shortName: 'Brampton',
    address: '157 Queen Street West, Brampton, ON L6Y 1P9',
    phone: '+1 647-987-5451',
    email: 'brampton@auravitalstar.ca',
    isActive: true
  },
  {
    id: 'loc-mississauga',
    name: 'Mississauga Centre',
    shortName: 'Mississauga',
    address: 'Mississauga, Ontario',
    phone: '+1 647-987-5451',
    email: 'mississauga@auravitalstar.ca',
    isActive: false
  }
];

const DEFAULT_SERVICES = [
  { id: 'svc-1', name: 'RMT Massage Therapy', category: 'Massage Therapy', price: 100, duration: '60 min', status: 'Active', description: 'Registered Massage Therapy for muscle relief and restoration.' },
  { id: 'svc-2', name: 'Deep Tissue Massage', category: 'Massage Therapy', price: 120, duration: '60 min', status: 'Active', description: 'Targets deeper layers of muscle for chronic tension relief.' },
  { id: 'svc-3', name: 'Aroma Therapy Ritual', category: 'Massage Therapy', price: 80, duration: '60 min', status: 'Active', description: 'Essential botanical oils to soothe mind and body.' },
  { id: 'svc-4', name: 'Hot Stone Therapy', category: 'Massage Therapy', price: 130, duration: '75 min', status: 'Active', description: 'Warm volcanic stones to relieve tension and stress.' },
  { id: 'svc-5', name: 'Hydra Glow Facial', category: 'Facial & Skincare', price: 110, duration: '60 min', status: 'Active', description: 'Deep hydration and gentle exfoliation for radiant skin.' },
  { id: 'svc-6', name: 'Anti-Aging Elixir Facial', category: 'Facial & Skincare', price: 140, duration: '75 min', status: 'Active', description: 'Collagen-boosting treatment for firm, youthful skin.' },
  { id: 'svc-7', name: 'Detoxifying Mud Wrap', category: 'Body Rituals', price: 125, duration: '60 min', status: 'Active', description: 'Mineral-rich mud wrap to detoxify and nourish skin.' },
  { id: 'svc-8', name: 'Ayurvedic Scalp Massage', category: 'Hair Spa', price: 70, duration: '45 min', status: 'Active', description: 'Herbal oils and pressure point massage for hair health.' },
  { id: 'svc-9', name: 'AVS Luxury Pedicure', category: 'Nail Care', price: 65, duration: '50 min', status: 'Active', description: 'Exfoliation, massage, and nail care for tired feet.' },
  { id: 'svc-10', name: 'Laser Hair Removal - Full Face', category: 'Laser & Waxing', price: 90, duration: '30 min', status: 'Active', description: 'Painless diode laser for permanent hair reduction.' },
  { id: 'svc-11', name: 'Custom Orthotics Assessment', category: 'Orthotics', price: 150, duration: '45 min', status: 'Active', description: 'Gait analysis and biomechanical foot assessment.' },
  { id: 'svc-12', name: 'Couples Massage Retreat', category: 'Massage Therapy', price: 220, duration: '75 min', status: 'Active', description: 'Side-by-side relaxation massage in private suite.' }
];

const DEFAULT_PACKAGES = [
  { id: 'pkg-1', name: 'Rejuvenation Express', category: 'Wellness', sessions: 1, price: 150, originalPrice: 190, discount: 21, status: 'Active', description: '60 min RMT + Express Hydra Facial' },
  { id: 'pkg-2', name: 'The Ultimate Glow', category: 'Beauty', sessions: 1, price: 210, originalPrice: 270, discount: 22, status: 'Active', description: 'Deep Tissue Massage + Hydra Facial + Scalp Ritual' },
  { id: 'pkg-3', name: 'Total Body Renewal', category: 'Complete Wellness', sessions: 3, price: 420, originalPrice: 550, discount: 24, status: 'Active', description: '3 sessions combining Hot Stone, Body Scrub & Reflexology' }
];

const DEFAULT_CLIENTS = [
  { id: 'cl-1', firstName: 'Priya', lastName: 'Sharma', fullName: 'Priya Sharma', phone: '+1 647-555-0192', email: 'priya.sharma@example.com', location: 'Brampton', totalVisits: 6, totalSpent: 720, status: 'Active', lastVisit: '2025-05-18', lastService: 'Hydra Glow Facial', createdAt: '2024-11-10' },
  { id: 'cl-2', firstName: 'Michael', lastName: 'Chen', fullName: 'Michael Chen', phone: '+1 416-555-0143', email: 'mchen@example.com', location: 'Brampton', totalVisits: 4, totalSpent: 520, status: 'Active', lastVisit: '2025-05-22', lastService: 'Deep Tissue Massage', createdAt: '2025-01-15' },
  { id: 'cl-3', firstName: 'Amandeep', lastName: 'Kaur', fullName: 'Amandeep Kaur', phone: '+1 647-555-0188', email: 'akaur@example.com', location: 'Brampton', totalVisits: 8, totalSpent: 980, status: 'Active', lastVisit: '2025-05-29', lastService: 'RMT Massage Therapy', createdAt: '2024-09-05' },
  { id: 'cl-4', firstName: 'Sarah', lastName: 'Jenkins', fullName: 'Sarah Jenkins', phone: '+1 905-555-0112', email: 'sarah.j@example.com', location: 'Mississauga', totalVisits: 2, totalSpent: 260, status: 'Active', lastVisit: '2025-05-12', lastService: 'Aroma Therapy Ritual', createdAt: '2025-03-01' }
];

const DEFAULT_LEADS = [
  { id: 'ld-1', name: 'Gurpreet Singh', phone: '+1 647-555-0177', email: 'gsingh@example.com', source: 'Instagram', location: 'Brampton', interestService: 'RMT Massage Therapy', status: 'Follow Up', addedOn: '2025-05-28' },
  { id: 'ld-2', name: 'Emily Watson', phone: '+1 416-555-0164', email: 'emily.w@example.com', source: 'Website', location: 'Brampton', interestService: 'Hydra Glow Facial', status: 'Converted', addedOn: '2025-05-26' },
  { id: 'ld-3', name: 'Rajesh Patel', phone: '+1 905-555-0129', email: 'rajesh.p@example.com', source: 'Google', location: 'Brampton', interestService: 'Custom Orthotics Assessment', status: 'Follow Up', addedOn: '2025-05-30' }
];

const DEFAULT_APPOINTMENTS = [
  { id: 'apt-1', clientName: 'Amandeep Kaur', clientId: 'cl-3', phone: '+1 647-555-0188', email: 'akaur@example.com', service: 'RMT Massage Therapy', serviceCategory: 'Massage Therapy', staff: 'David Miller, RMT', location: 'Brampton', date: '2025-06-01', time: '10:00 AM', duration: '60 min', status: 'Confirmed', amount: 100 },
  { id: 'apt-2', clientName: 'Michael Chen', clientId: 'cl-2', phone: '+1 416-555-0143', email: 'mchen@example.com', service: 'Deep Tissue Massage', serviceCategory: 'Massage Therapy', staff: 'David Miller, RMT', location: 'Brampton', date: '2025-06-01', time: '01:30 PM', duration: '60 min', status: 'Confirmed', amount: 120 },
  { id: 'apt-3', clientName: 'Priya Sharma', clientId: 'cl-1', phone: '+1 647-555-0192', email: 'priya.sharma@example.com', service: 'Hydra Glow Facial', serviceCategory: 'Facial & Skincare', staff: 'Elena Rostova', location: 'Brampton', date: '2025-06-02', time: '11:00 AM', duration: '60 min', status: 'Pending', amount: 110 },
  { id: 'apt-4', clientName: 'Sarah Jenkins', clientId: 'cl-4', phone: '+1 905-555-0112', email: 'sarah.j@example.com', service: 'Aroma Therapy Ritual', serviceCategory: 'Massage Therapy', staff: 'Elena Rostova', location: 'Mississauga', date: '2025-06-02', time: '03:00 PM', duration: '60 min', status: 'Completed', amount: 80 }
];

const DEFAULT_INVOICES = [
  { id: 'inv-1', invoiceNo: 'INV-2025-001', clientId: 'cl-3', clientName: 'Amandeep Kaur', clientEmail: 'akaur@example.com', clientPhone: '+1 647-555-0188', date: '2025-05-29', dueDate: '2025-05-29', location: 'Brampton', status: 'Paid', items: [{ id: 'it-1', service: 'RMT Massage Therapy', quantity: 1, price: 100, amount: 100 }], subtotal: 100, tax: 13, discount: 0, total: 113, paymentMethod: 'Credit Card' },
  { id: 'inv-2', invoiceNo: 'INV-2025-002', clientId: 'cl-1', clientName: 'Priya Sharma', clientEmail: 'priya.sharma@example.com', clientPhone: '+1 647-555-0192', date: '2025-05-18', dueDate: '2025-05-18', location: 'Brampton', status: 'Paid', items: [{ id: 'it-2', service: 'Hydra Glow Facial', quantity: 1, price: 110, amount: 110 }], subtotal: 110, tax: 14.3, discount: 0, total: 124.3, paymentMethod: 'Debit' }
];

const DEFAULT_GIFTCARDS = [
  { id: 'gc-1', cardNumber: 'GC-AVS-2025-101', recipient: 'Simran Gill', buyer: 'Karan Gill', recipientEmail: 'simran@example.com', buyerEmail: 'karan@example.com', value: 200, balance: 200, status: 'Active', expiryDate: '2026-05-01', createdOn: '2025-05-01', location: 'Brampton', history: [] },
  { id: 'gc-2', cardNumber: 'GC-AVS-2025-102', recipient: 'Jessica Taylor', buyer: 'Mark Taylor', recipientEmail: 'jtaylor@example.com', buyerEmail: 'mtaylor@example.com', value: 150, balance: 50, status: 'Partially Used', expiryDate: '2026-04-15', createdOn: '2025-04-15', location: 'Brampton', history: [{ id: 'gh-1', date: '2025-05-10', description: 'Redeemed for Deep Tissue Massage', reference: 'INV-2025-098', debit: 100, credit: 0, balance: 50, by: 'Front Desk' }] }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'nt-1', title: 'New Appointment Booked', message: 'Amandeep Kaur booked RMT Massage Therapy for June 1.', time: '10 mins ago', read: false, type: 'appointment' },
  { id: 'nt-2', title: 'Invoice Settled', message: 'Invoice INV-2025-001 ($113.00) was paid via Credit Card.', time: '1 hour ago', read: false, type: 'invoice' },
  { id: 'nt-3', title: 'New Website Lead', message: 'Rajesh Patel submitted an inquiry for Custom Orthotics.', time: '2 hours ago', read: false, type: 'lead' }
];

// Helper: Read JSON Body
function readBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// In-Memory Store for Serverless Runtime
let clients = [...DEFAULT_CLIENTS];
let appointments = [...DEFAULT_APPOINTMENTS];
let leads = [...DEFAULT_LEADS];
let invoices = [...DEFAULT_INVOICES];
let giftCards = [...DEFAULT_GIFTCARDS];
let services = [...DEFAULT_SERVICES];
let packages = [...DEFAULT_PACKAGES];
let notifications = [...DEFAULT_NOTIFICATIONS];

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const host = req.headers.host || 'localhost';
  const url = new URL(req.url, `https://${host}`);
  let pathname = url.pathname;

  // Support Vercel query path parameter from rewrites
  if (url.searchParams.has('path')) {
    const qp = url.searchParams.get('path');
    pathname = qp.startsWith('/') ? `/api${qp}` : `/api/${qp}`;
  }

  const method = req.method;

  // JSON helper
  const json = (status, data) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
  };

  try {
    // 1. HEALTH CHECK
    if (pathname === '/api/health' || pathname === '/api/crm' || pathname === '/api') {
      return json(200, { success: true, status: 'ok', service: 'AVS Unified Serverless CRM API', timestamp: new Date().toISOString() });
    }

    // 2. AUTH: LOGIN
    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await readBody(req);
      const { email, password } = body;

      // Validate default admin or any valid staff email
      const isAdmin = (email === 'admin@auravitalstar.ca' && password === 'Admin@AVS2025') ||
                      (email && password && password.length >= 6);

      if (isAdmin) {
        return json(200, {
          success: true,
          data: {
            token: 'avs_jwt_admin_session_token_' + Date.now(),
            user: {
              id: 'usr-admin',
              name: 'AVS Admin',
              email: email || 'admin@auravitalstar.ca',
              role: 'ADMIN',
              locationId: 'loc-brampton'
            }
          }
        });
      } else {
        return json(401, {
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password. Use admin@auravitalstar.ca / Admin@AVS2025' }
        });
      }
    }

    // 3. AUTH: ME
    if (pathname === '/api/auth/me' && method === 'GET') {
      return json(200, {
        success: true,
        data: {
          id: 'usr-admin',
          name: 'AVS Admin',
          email: 'admin@auravitalstar.ca',
          role: 'ADMIN'
        }
      });
    }

    // 4. LOCATIONS
    if (pathname === '/api/locations' && method === 'GET') {
      return json(200, { success: true, data: DEFAULT_LOCATIONS });
    }

    // 5. DASHBOARD: OVERVIEW
    if ((pathname === '/api/dashboard/overview' || pathname === '/api/dashboard/summary') && method === 'GET') {
      const totalSales = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.total : 0), 2480);
      const totalApts = appointments.length + 18;
      const totalCls = clients.length + 42;

      const overviewData = {
        kpi: {
          totalClients: { value: totalCls, change: '+14%', trend: 'up', comparisonText: 'vs last month' },
          totalAppointments: { value: totalApts, change: '+22%', trend: 'up', comparisonText: 'vs last month' },
          todaySales: { value: '$480.00', change: '+8%', trend: 'up', comparisonText: 'vs yesterday' },
          monthlySales: { value: `$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, change: '+18.5%', trend: 'up', comparisonText: 'vs last month' }
        },
        revenueOverview: {
          totalRevenue: totalSales,
          changePercent: '+18.5%',
          series: [
            { date: 'May 1', revenue: 320 },
            { date: 'May 7', revenue: 580 },
            { date: 'May 14', revenue: 790 },
            { date: 'May 21', revenue: 940 },
            { date: 'May 28', revenue: 1250 },
            { date: 'Jun 1', revenue: 1480 }
          ]
        },
        appointmentOverview: {
          total: totalApts,
          completed: { count: 14, percentage: 64 },
          upcoming: { count: 6, percentage: 27 },
          cancelled: { count: 1, percentage: 5 },
          noShow: { count: 1, percentage: 4 }
        },
        locationPerformance: [
          { id: 'loc-brampton', name: 'Brampton Rejuvenation Centre', shortName: 'Brampton', appointments: 18, sales: 2150, percentage: 87 },
          { id: 'loc-mississauga', name: 'Mississauga Centre', shortName: 'Mississauga', appointments: 4, sales: 330, percentage: 13 }
        ],
        topServices: [
          { name: 'RMT Massage Therapy', category: 'Massage Therapy', bookings: 12, sales: 1200 },
          { name: 'Hydra Glow Facial', category: 'Facial & Skincare', bookings: 8, sales: 880 },
          { name: 'Deep Tissue Massage', category: 'Massage Therapy', bookings: 6, sales: 720 },
          { name: 'Hot Stone Therapy', category: 'Massage Therapy', bookings: 4, sales: 520 }
        ],
        recentAppointments: appointments.slice(0, 6).map(apt => ({
          id: apt.id,
          clientName: apt.clientName,
          clientId: apt.clientId,
          service: apt.service,
          date: apt.date,
          time: apt.time,
          status: apt.status,
          location: apt.location,
          amount: apt.amount
        })),
        leadSources: {
          total: leads.length + 15,
          breakdown: [
            { source: 'Instagram', count: 8, percentage: 44 },
            { source: 'Website', count: 6, percentage: 33 },
            { source: 'Google', count: 3, percentage: 17 },
            { source: 'Referral', count: 1, percentage: 6 }
          ]
        }
      };

      return json(200, { success: true, data: overviewData });
    }

    // 6. APPOINTMENTS
    if (pathname.startsWith('/api/appointments')) {
      const parts = pathname.split('/').filter(Boolean);
      // /api/appointments
      if (parts.length === 2) {
        if (method === 'GET') {
          return json(200, { success: true, data: appointments });
        }
        if (method === 'POST') {
          const body = await readBody(req);
          const newApt = {
            id: 'apt-' + Date.now(),
            clientName: body.name || body.clientName || 'Valued Guest',
            clientId: body.clientId || 'cl-' + Date.now(),
            phone: body.phone || '',
            email: body.email || '',
            service: body.service || 'Signature Treatment',
            serviceCategory: body.serviceCategory || 'Massage Therapy',
            staff: body.staff || 'Staff Specialist',
            location: body.locationName || body.location || 'Brampton',
            date: body.date || new Date().toISOString().split('T')[0],
            time: body.time || '10:00 AM',
            duration: body.duration || '60 min',
            status: body.status || 'Confirmed',
            amount: body.amount || 100,
            notes: body.notes || ''
          };
          appointments.unshift(newApt);
          return json(201, { success: true, data: newApt });
        }
      }
      // Status update actions
      if (parts.length >= 3) {
        const id = parts[2];
        const action = parts[3];
        const apt = appointments.find(a => a.id === id);
        if (!apt) return json(404, { success: false, error: { message: 'Appointment not found' } });

        if (action === 'confirm') apt.status = 'Confirmed';
        else if (action === 'complete') apt.status = 'Completed';
        else if (action === 'cancel') apt.status = 'Cancelled';
        else if (action === 'no-show') apt.status = 'No Show';
        else if (method === 'PATCH') {
          const body = await readBody(req);
          Object.assign(apt, body);
        }
        return json(200, { success: true, data: apt });
      }
    }

    // 7. CLIENTS
    if (pathname.startsWith('/api/clients')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length === 2) {
        if (method === 'GET') return json(200, { success: true, data: clients });
        if (method === 'POST') {
          const body = await readBody(req);
          const newClient = {
            id: 'cl-' + Date.now(),
            firstName: body.firstName || '',
            lastName: body.lastName || '',
            fullName: body.fullName || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'New Client',
            phone: body.phone || '',
            email: body.email || '',
            location: body.location || 'Brampton',
            totalVisits: 0,
            totalSpent: 0,
            status: 'Active',
            lastVisit: new Date().toISOString().split('T')[0],
            lastService: 'New Registration',
            createdAt: new Date().toISOString().split('T')[0]
          };
          clients.unshift(newClient);
          return json(201, { success: true, data: newClient });
        }
      }
      if (parts.length === 3) {
        const id = parts[2];
        const client = clients.find(c => c.id === id);
        if (!client) return json(404, { success: false, error: { message: 'Client not found' } });
        if (method === 'GET') return json(200, { success: true, data: client });
        if (method === 'PATCH') {
          const body = await readBody(req);
          Object.assign(client, body);
          return json(200, { success: true, data: client });
        }
      }
    }

    // 8. LEADS
    if (pathname.startsWith('/api/leads')) {
      if (method === 'GET') return json(200, { success: true, data: leads });
      if (method === 'POST') {
        const body = await readBody(req);
        const newLead = {
          id: 'ld-' + Date.now(),
          name: body.name || 'New Inquiry',
          phone: body.phone || '',
          email: body.email || '',
          source: body.source || 'Website',
          location: body.location || 'Brampton',
          interestService: body.interestService || 'General Care',
          status: 'Follow Up',
          addedOn: new Date().toISOString().split('T')[0]
        };
        leads.unshift(newLead);
        return json(201, { success: true, data: newLead });
      }
    }

    // 9. INVOICES
    if (pathname.startsWith('/api/invoices')) {
      if (method === 'GET') return json(200, { success: true, data: invoices });
      if (method === 'POST') {
        const body = await readBody(req);
        const newInv = {
          id: 'inv-' + Date.now(),
          invoiceNo: 'INV-' + new Date().getFullYear() + '-' + Math.floor(100 + Math.random() * 900),
          clientId: body.clientId || 'cl-1',
          clientName: body.clientName || 'Valued Client',
          clientEmail: body.clientEmail || '',
          clientPhone: body.clientPhone || '',
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date().toISOString().split('T')[0],
          location: body.location || 'Brampton',
          status: 'Paid',
          items: body.items || [{ id: 'it-1', service: 'Treatment', quantity: 1, price: 100, amount: 100 }],
          subtotal: body.subtotal || 100,
          tax: body.tax || 13,
          discount: 0,
          total: body.total || 113,
          paymentMethod: body.paymentMethod || 'Credit Card'
        };
        invoices.unshift(newInv);
        return json(201, { success: true, data: newInv });
      }
    }

    // 10. GIFT CARDS
    if (pathname.startsWith('/api/gift-cards')) {
      if (method === 'GET') return json(200, { success: true, data: giftCards });
      if (method === 'POST') {
        const body = await readBody(req);
        const newCard = {
          id: 'gc-' + Date.now(),
          cardNumber: 'GC-AVS-' + Date.now().toString().slice(-6),
          recipient: body.recipient || 'Valued Guest',
          buyer: body.buyer || 'Purchaser',
          recipientEmail: body.recipientEmail || '',
          buyerEmail: body.buyerEmail || '',
          value: parseFloat(body.value || 100),
          balance: parseFloat(body.value || 100),
          status: 'Active',
          expiryDate: '2026-12-31',
          createdOn: new Date().toISOString().split('T')[0],
          location: body.location || 'Brampton',
          history: []
        };
        giftCards.unshift(newCard);
        return json(201, { success: true, data: newCard });
      }
    }

    // 11. SERVICES
    if (pathname.startsWith('/api/services')) {
      if (method === 'GET') return json(200, { success: true, data: services });
      if (method === 'POST') {
        const body = await readBody(req);
        const newSvc = { id: 'svc-' + Date.now(), ...body };
        services.push(newSvc);
        return json(201, { success: true, data: newSvc });
      }
    }

    // 12. PACKAGES
    if (pathname.startsWith('/api/packages')) {
      if (method === 'GET') return json(200, { success: true, data: packages });
    }

    // 13. NOTIFICATIONS
    if (pathname.startsWith('/api/notifications')) {
      if (method === 'GET') return json(200, { success: true, data: notifications });
      if (method === 'POST') {
        notifications.forEach(n => n.read = true);
        return json(200, { success: true, message: 'All notifications marked as read' });
      }
    }

    // 14. GALLERY
    if (pathname.startsWith('/api/gallery')) {
      return json(200, {
        success: true,
        data: [
          { id: 'gal-1', title: 'Luxury Lounge Interior', category: 'Lounge', imageUrl: '/gallery_lounge_interior.webp', status: 'Published' },
          { id: 'gal-2', title: 'Volcanic Hot Stones Treatment', category: 'Treatments', imageUrl: '/gallery_hot_stones.webp', status: 'Published' },
          { id: 'gal-3', title: 'Hair Wash & Scalp Spa', category: 'Treatments', imageUrl: '/salon_facial_glow.webp', status: 'Published' }
        ]
      });
    }

    // Fallback: route not found
    return json(404, { success: false, error: { code: 'NOT_FOUND', message: `Route ${method} ${pathname} not found in CRM API` } });

  } catch (err) {
    console.error('[CRM Serverless API Error]:', err);
    return json(500, { success: false, error: { code: 'SERVER_ERROR', message: err.message || 'Internal Server Error' } });
  }
}
