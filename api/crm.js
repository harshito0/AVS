// ============================================================
// Aura Vital Star — Unified CRM Serverless API Handler (Vercel)
// Powers all CRM dashboard endpoints directly on Vercel
// ============================================================

import fs from 'fs';
import path from 'path';

// Initial Seed Data: Locations
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
    isActive: true
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
  { id: 'cl-4', firstName: 'Sarah', lastName: 'Jenkins', fullName: 'Sarah Jenkins', phone: '+1 905-555-0112', email: 'sarah.j@example.com', location: 'Mississauga', totalVisits: 3, totalSpent: 360, status: 'Active', lastVisit: '2025-05-12', lastService: 'Aroma Therapy Ritual', createdAt: '2025-03-01' },
  { id: 'cl-5', firstName: 'Neha', lastName: 'Sharma', fullName: 'Neha Sharma', phone: '+1 647-555-0125', email: 'neha.s@example.com', location: 'Brampton', totalVisits: 5, totalSpent: 650, status: 'Active', lastVisit: '2025-05-24', lastService: 'RMT Massage Therapy', createdAt: '2024-12-01' },
  { id: 'cl-6', firstName: 'David', lastName: 'Miller', fullName: 'David Miller', phone: '+1 416-555-0199', email: 'dmiller@example.com', location: 'Mississauga', totalVisits: 2, totalSpent: 240, status: 'Active', lastVisit: '2025-05-27', lastService: 'Sports Massage', createdAt: '2025-02-14' },
  { id: 'cl-7', firstName: 'Jessica', lastName: 'Taylor', fullName: 'Jessica Taylor', phone: '+1 905-555-0144', email: 'jtaylor@example.com', location: 'Brampton', totalVisits: 4, totalSpent: 480, status: 'Active', lastVisit: '2025-05-25', lastService: 'Hot Stone Therapy', createdAt: '2025-01-20' },
  { id: 'cl-8', firstName: 'Anita', lastName: 'Patel', fullName: 'Anita Patel', phone: '+1 647-555-0166', email: 'apatel@example.com', location: 'Mississauga', totalVisits: 3, totalSpent: 380, status: 'Active', lastVisit: '2025-05-20', lastService: 'Anti-Aging Elixir Facial', createdAt: '2025-02-28' }
];

const DEFAULT_LEADS = [
  { id: 'ld-1', name: 'Gurpreet Singh', phone: '+1 647-555-0177', email: 'gsingh@example.com', source: 'Instagram', location: 'Brampton', interestService: 'RMT Massage Therapy', status: 'Follow Up', addedOn: '2025-05-28' },
  { id: 'ld-2', name: 'Emily Watson', phone: '+1 416-555-0164', email: 'emily.w@example.com', source: 'Website', location: 'Brampton', interestService: 'Hydra Glow Facial', status: 'Converted', addedOn: '2025-05-26' },
  { id: 'ld-3', name: 'Rajesh Patel', phone: '+1 905-555-0129', email: 'rajesh.p@example.com', source: 'Google', location: 'Brampton', interestService: 'Custom Orthotics Assessment', status: 'Follow Up', addedOn: '2025-05-30' },
  { id: 'ld-4', name: 'Chloe Martin', phone: '+1 416-555-0182', email: 'cmartin@example.com', source: 'Referral', location: 'Mississauga', interestService: 'Aroma Therapy Ritual', status: 'Converted', addedOn: '2025-05-21' },
  { id: 'ld-5', name: 'Aarav Mehta', phone: '+1 905-555-0193', email: 'amehta@example.com', source: 'Facebook', location: 'Brampton', interestService: 'Deep Tissue Massage', status: 'Follow Up', addedOn: '2025-05-25' },
  { id: 'ld-6', name: 'Sophie Tremblay', phone: '+1 647-555-0149', email: 'stremblay@example.com', source: 'Walk-in', location: 'Mississauga', interestService: 'Luxury 24K Gold Facial', status: 'Converted', addedOn: '2025-05-19' },
  { id: 'ld-7', name: 'Harpreet Gill', phone: '+1 647-555-0118', email: 'hgill@example.com', source: 'Instagram', location: 'Brampton', interestService: 'Ayurvedic Scalp Massage', status: 'Follow Up', addedOn: '2025-05-31' },
  { id: 'ld-8', name: 'Marcus Vance', phone: '+1 416-555-0137', email: 'mvance@example.com', source: 'Google', location: 'Mississauga', interestService: 'Hot Stone Therapy', status: 'Converted', addedOn: '2025-05-15' }
];

const DEFAULT_APPOINTMENTS = [
  { id: 'apt-1', clientName: 'Neha Sharma', clientId: 'cl-5', phone: '+1 647-555-0125', email: 'neha.s@example.com', service: 'RMT Massage Therapy', serviceCategory: 'Massage Therapy', staff: 'Sarah Chen, RMT', location: 'Brampton', date: '2025-05-24', time: '10:00 AM', duration: '60 min', status: 'Confirmed', amount: 100 },
  { id: 'apt-2', clientName: 'Priya Sharma', clientId: 'cl-1', phone: '+1 647-555-0192', email: 'priya.sharma@example.com', service: 'Hydra Glow Facial', serviceCategory: 'Facial & Skincare', staff: 'Priya Sharma, Esthetician', location: 'Brampton', date: '2025-05-26', time: '11:30 AM', duration: '60 min', status: 'Completed', amount: 110 },
  { id: 'apt-3', clientName: 'Michael Chen', clientId: 'cl-2', phone: '+1 416-555-0143', email: 'mchen@example.com', service: 'Deep Tissue Massage', serviceCategory: 'Massage Therapy', staff: 'Michael Torres, RMT', location: 'Brampton', date: '2025-05-28', time: '01:00 PM', duration: '60 min', status: 'Completed', amount: 120 },
  { id: 'apt-4', clientName: 'Amandeep Kaur', clientId: 'cl-3', phone: '+1 647-555-0188', email: 'akaur@example.com', service: 'RMT Massage Therapy', serviceCategory: 'Massage Therapy', staff: 'Sarah Chen, RMT', location: 'Brampton', date: '2025-05-29', time: '02:30 PM', duration: '60 min', status: 'Completed', amount: 100 },
  { id: 'apt-5', clientName: 'Sarah Jenkins', clientId: 'cl-4', phone: '+1 905-555-0112', email: 'sarah.j@example.com', service: 'Aroma Therapy Ritual', serviceCategory: 'Massage Therapy', staff: 'Elena Rostova', location: 'Mississauga', date: '2025-05-30', time: '04:00 PM', duration: '60 min', status: 'Completed', amount: 80 },
  { id: 'apt-6', clientName: 'David Miller', clientId: 'cl-6', phone: '+1 416-555-0199', email: 'dmiller@example.com', service: 'Sports Massage', serviceCategory: 'Massage Therapy', staff: 'Michael Torres, RMT', location: 'Mississauga', date: '2025-06-01', time: '10:00 AM', duration: '60 min', status: 'Confirmed', amount: 115 },
  { id: 'apt-7', clientName: 'Jessica Taylor', clientId: 'cl-7', phone: '+1 905-555-0144', email: 'jtaylor@example.com', service: 'Hot Stone Therapy', serviceCategory: 'Massage Therapy', staff: 'Sarah Chen, RMT', location: 'Brampton', date: '2025-06-02', time: '11:00 AM', duration: '75 min', status: 'Pending', amount: 130 },
  { id: 'apt-8', clientName: 'Anita Patel', clientId: 'cl-8', phone: '+1 647-555-0166', email: 'apatel@example.com', service: 'Anti-Aging Elixir Facial', serviceCategory: 'Facial & Skincare', staff: 'Priya Sharma, Esthetician', location: 'Mississauga', date: '2025-06-03', time: '02:00 PM', duration: '75 min', status: 'Cancelled', amount: 140 },
  { id: 'apt-9', clientName: 'Gurpreet Singh', clientId: 'ld-1', phone: '+1 647-555-0177', email: 'gsingh@example.com', service: 'Custom Orthotics Assessment', serviceCategory: 'Orthotics', staff: 'Michael Torres, RMT', location: 'Brampton', date: '2025-06-04', time: '03:30 PM', duration: '45 min', status: 'No Show', amount: 150 }
];

const DEFAULT_INVOICES = [
  { id: 'inv-1', invoiceNo: 'INV-2025-001', clientId: 'cl-3', clientName: 'Amandeep Kaur', clientEmail: 'akaur@example.com', clientPhone: '+1 647-555-0188', date: '2025-05-29', dueDate: '2025-05-29', location: 'Brampton', status: 'Paid', items: [{ id: 'it-1', service: 'RMT Massage Therapy', quantity: 1, price: 100, amount: 100 }], subtotal: 100, tax: 13, discount: 0, total: 113, paymentMethod: 'Credit Card' },
  { id: 'inv-2', invoiceNo: 'INV-2025-002', clientId: 'cl-1', clientName: 'Priya Sharma', clientEmail: 'priya.sharma@example.com', clientPhone: '+1 647-555-0192', date: '2025-05-18', dueDate: '2025-05-18', location: 'Brampton', status: 'Paid', items: [{ id: 'it-2', service: 'Hydra Glow Facial', quantity: 1, price: 110, amount: 110 }], subtotal: 110, tax: 14.3, discount: 0, total: 124.3, paymentMethod: 'Debit' },
  { id: 'inv-3', invoiceNo: 'INV-2025-003', clientId: 'cl-2', clientName: 'Michael Chen', clientEmail: 'mchen@example.com', clientPhone: '+1 416-555-0143', date: '2025-05-22', dueDate: '2025-05-22', location: 'Brampton', status: 'Paid', items: [{ id: 'it-3', service: 'Deep Tissue Massage', quantity: 1, price: 120, amount: 120 }], subtotal: 120, tax: 15.6, discount: 0, total: 135.6, paymentMethod: 'Credit Card' },
  { id: 'inv-4', invoiceNo: 'INV-2025-004', clientId: 'cl-5', clientName: 'Neha Sharma', clientEmail: 'neha.s@example.com', clientPhone: '+1 647-555-0125', date: '2025-05-24', dueDate: '2025-05-24', location: 'Brampton', status: 'Paid', items: [{ id: 'it-4', service: 'RMT Massage Therapy', quantity: 1, price: 100, amount: 100 }], subtotal: 100, tax: 13, discount: 0, total: 113, paymentMethod: 'Credit Card' },
  { id: 'inv-5', invoiceNo: 'INV-2025-005', clientId: 'cl-4', clientName: 'Sarah Jenkins', clientEmail: 'sarah.j@example.com', clientPhone: '+1 905-555-0112', date: '2025-05-12', dueDate: '2025-05-12', location: 'Mississauga', status: 'Paid', items: [{ id: 'it-5', service: 'Aroma Therapy Ritual', quantity: 1, price: 80, amount: 80 }], subtotal: 80, tax: 10.4, discount: 0, total: 90.4, paymentMethod: 'Debit' },
  { id: 'inv-6', invoiceNo: 'INV-2025-006', clientId: 'cl-6', clientName: 'David Miller', clientEmail: 'dmiller@example.com', clientPhone: '+1 416-555-0199', date: '2025-05-27', dueDate: '2025-05-27', location: 'Mississauga', status: 'Paid', items: [{ id: 'it-6', service: 'Sports Massage', quantity: 1, price: 115, amount: 115 }], subtotal: 115, tax: 14.95, discount: 0, total: 129.95, paymentMethod: 'Credit Card' },
  { id: 'inv-7', invoiceNo: 'INV-2025-007', clientId: 'cl-7', clientName: 'Jessica Taylor', clientEmail: 'jtaylor@example.com', clientPhone: '+1 905-555-0144', date: '2025-05-25', dueDate: '2025-05-25', location: 'Brampton', status: 'Paid', items: [{ id: 'it-7', service: 'Hot Stone Therapy', quantity: 1, price: 130, amount: 130 }], subtotal: 130, tax: 16.9, discount: 0, total: 146.9, paymentMethod: 'Credit Card' },
  { id: 'inv-8', invoiceNo: 'INV-2025-008', clientId: 'cl-8', clientName: 'Anita Patel', clientEmail: 'apatel@example.com', clientPhone: '+1 647-555-0166', date: '2025-05-20', dueDate: '2025-05-20', location: 'Mississauga', status: 'Paid', items: [{ id: 'it-8', service: 'Anti-Aging Elixir Facial', quantity: 1, price: 140, amount: 140 }], subtotal: 140, tax: 18.2, discount: 0, total: 158.2, paymentMethod: 'Credit Card' }
];

const DEFAULT_GIFTCARDS = [
  { id: 'gc-1', cardNumber: 'GC-AVS-2025-101', recipient: 'Simran Gill', buyer: 'Karan Gill', recipientEmail: 'simran@example.com', buyerEmail: 'karan@example.com', value: 200, balance: 200, status: 'Active', expiryDate: '2026-05-01', createdOn: '2025-05-01', location: 'Brampton', history: [] },
  { id: 'gc-2', cardNumber: 'GC-AVS-2025-102', recipient: 'Jessica Taylor', buyer: 'Mark Taylor', recipientEmail: 'jtaylor@example.com', buyerEmail: 'mtaylor@example.com', value: 150, balance: 50, status: 'Partially Used', expiryDate: '2026-04-15', createdOn: '2025-04-15', location: 'Brampton', history: [{ id: 'gh-1', date: '2025-05-10', description: 'Redeemed for Deep Tissue Massage', reference: 'INV-2025-098', debit: 100, credit: 0, balance: 50, by: 'Front Desk' }] }
];

const DEFAULT_NOTIFICATIONS = [
  { id: 'nt-1', title: 'New Appointment Booked', message: 'Neha Sharma confirmed RMT Massage Therapy.', time: '10 mins ago', read: false, type: 'appointment' },
  { id: 'nt-2', title: 'Invoice Settled', message: 'Invoice INV-2025-007 ($146.90) paid via Credit Card.', time: '1 hour ago', read: false, type: 'invoice' },
  { id: 'nt-3', title: 'New Inbound Lead', message: 'Gurpreet Singh submitted an inquiry for RMT Therapy.', time: '2 hours ago', read: false, type: 'lead' }
];

// In-Memory Store for Serverless Runtime
let clients = [...DEFAULT_CLIENTS];
let appointments = [...DEFAULT_APPOINTMENTS];
let leads = [...DEFAULT_LEADS];
let invoices = [...DEFAULT_INVOICES];
let giftCards = [...DEFAULT_GIFTCARDS];
let services = [...DEFAULT_SERVICES];
let packages = [...DEFAULT_PACKAGES];
let notifications = [...DEFAULT_NOTIFICATIONS];

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

// Dynamic Dashboard Aggregation Engine
function computeDashboardMetrics(locationParam, dateRangeParam, startDateParam, endDateParam) {
  let start = startDateParam;
  let end = endDateParam;
  const todayStr = new Date().toISOString().split('T')[0];

  if (!start && !end && dateRangeParam) {
    if (dateRangeParam.includes('Today')) {
      start = todayStr;
      end = todayStr;
    } else if (dateRangeParam.includes('Yesterday')) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      start = y.toISOString().split('T')[0];
      end = start;
    } else if (dateRangeParam.includes('Last 7 Days')) {
      const d7 = new Date();
      d7.setDate(d7.getDate() - 7);
      start = d7.toISOString().split('T')[0];
      end = todayStr;
    } else if (dateRangeParam.includes('Last 30 Days')) {
      const d30 = new Date();
      d30.setDate(d30.getDate() - 30);
      start = d30.toISOString().split('T')[0];
      end = todayStr;
    } else if (dateRangeParam.includes('May') && dateRangeParam.includes('2025')) {
      start = '2025-05-01';
      end = '2025-05-31';
    }
  }

  const isAllLocations = !locationParam || locationParam === 'All Locations' || locationParam === 'all';
  const targetLoc = isAllLocations ? null : locationParam.toLowerCase();

  const matchLocation = (itemLoc) => {
    if (!targetLoc) return true;
    return (itemLoc || '').toLowerCase().includes(targetLoc);
  };

  const matchDate = (itemDate) => {
    if (!start && !end) return true;
    if (!itemDate) return true;
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  };

  const filteredClients = clients.filter(c => matchLocation(c.location));
  const filteredAppointments = appointments.filter(a => matchLocation(a.location) && matchDate(a.date));
  const filteredInvoices = invoices.filter(i => matchLocation(i.location) && matchDate(i.date) && i.status === 'Paid');
  const filteredLeads = leads.filter(l => matchLocation(l.location));

  // KPIs
  const totalClientsCount = filteredClients.length;
  const totalAppointmentsCount = filteredAppointments.length;
  const todayPaid = filteredInvoices.filter(i => i.date === todayStr).reduce((sum, i) => sum + (i.total || 0), 0);
  const totalPeriodSales = filteredInvoices.reduce((sum, i) => sum + (i.total || 0), 0);

  // Revenue Series
  const revMap = new Map();
  for (const inv of filteredInvoices) {
    const d = inv.date || todayStr;
    revMap.set(d, (revMap.get(d) || 0) + (inv.total || 0));
  }
  const revenueSeries = Array.from(revMap.entries())
    .map(([date, revenue]) => ({ date, revenue: Math.round(revenue * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Appointment Status Overview
  let completedCount = 0;
  let upcomingCount = 0;
  let cancelledCount = 0;
  let noShowCount = 0;

  for (const apt of filteredAppointments) {
    const s = (apt.status || 'Pending').toLowerCase();
    if (s === 'completed') completedCount++;
    else if (s === 'cancelled') cancelledCount++;
    else if (s === 'no show' || s === 'no_show') noShowCount++;
    else upcomingCount++;
  }

  const aptTotal = filteredAppointments.length;
  const pct = (v) => aptTotal > 0 ? Math.round((v / aptTotal) * 100) : 0;

  const appointmentOverview = {
    total: aptTotal,
    completed: { count: completedCount, percentage: pct(completedCount) },
    upcoming: { count: upcomingCount, percentage: pct(upcomingCount) },
    cancelled: { count: cancelledCount, percentage: pct(cancelledCount) },
    noShow: { count: noShowCount, percentage: pct(noShowCount) },
  };

  // Location Performance (Both Locations always shown)
  const locPerf = DEFAULT_LOCATIONS.map(loc => {
    const apts = appointments.filter(a => a.location?.toLowerCase().includes(loc.shortName.toLowerCase()) && matchDate(a.date));
    const invs = invoices.filter(i => i.location?.toLowerCase().includes(loc.shortName.toLowerCase()) && matchDate(i.date) && i.status === 'Paid');
    const sales = invs.reduce((sum, i) => sum + (i.total || 0), 0);
    return {
      id: loc.id,
      name: loc.name,
      shortName: loc.shortName,
      appointments: apts.length,
      sales: Math.round(sales * 100) / 100,
    };
  });
  const maxSales = Math.max(...locPerf.map(l => l.sales), 1);
  const locationPerformance = locPerf.map(l => ({
    ...l,
    percentage: Math.round((l.sales / maxSales) * 100),
  }));

  // Top Services
  const svcMap = new Map();
  for (const apt of filteredAppointments) {
    const sName = apt.service || 'Signature Treatment';
    const sCat = apt.serviceCategory || 'Wellness';
    const cur = svcMap.get(sName) || { name: sName, category: sCat, bookings: 0, sales: 0 };
    cur.bookings += 1;
    cur.sales += apt.amount || 100;
    svcMap.set(sName, cur);
  }
  for (const inv of filteredInvoices) {
    for (const item of (inv.items || [])) {
      const sName = item.service || 'Clinical Treatment';
      const cur = svcMap.get(sName) || { name: sName, category: 'Clinical Treatment', bookings: 0, sales: 0 };
      cur.sales += item.amount || 0;
      svcMap.set(sName, cur);
    }
  }
  const topServices = Array.from(svcMap.values())
    .sort((a, b) => b.bookings - a.bookings || b.sales - a.sales)
    .slice(0, 5);

  // Recent Appointments
  const recentAppointments = [...filteredAppointments]
    .sort((a, b) => (b.date + ' ' + b.time).localeCompare(a.date + ' ' + a.time))
    .slice(0, 5)
    .map(a => ({
      id: a.id,
      clientName: a.clientName,
      clientId: a.clientId,
      service: a.service,
      date: a.date,
      time: a.time,
      status: a.status,
      location: a.location,
      amount: a.amount,
    }));

  // Lead Sources
  const srcMap = new Map();
  for (const ld of filteredLeads) {
    const s = ld.source || 'Website';
    srcMap.set(s, (srcMap.get(s) || 0) + 1);
  }
  const totalLeadsCount = filteredLeads.length;
  const leadSources = {
    total: totalLeadsCount,
    breakdown: Array.from(srcMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: totalLeadsCount > 0 ? Math.round((count / totalLeadsCount) * 100) : 0,
    })),
  };

  return {
    kpi: {
      totalClients: {
        value: totalClientsCount,
        change: '+14%',
        trend: 'up',
        comparisonText: 'vs last period',
      },
      totalAppointments: {
        value: totalAppointmentsCount,
        change: '+18%',
        trend: 'up',
        comparisonText: 'vs last period',
      },
      todaySales: {
        value: `$${todayPaid.toFixed(2)}`,
        change: 'Daily total',
        trend: 'neutral',
        comparisonText: 'settled today',
      },
      monthlySales: {
        value: `$${totalPeriodSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        change: '+18.5%',
        trend: 'up',
        comparisonText: 'vs last month',
      },
    },
    revenueOverview: {
      totalRevenue: totalPeriodSales,
      changePercent: '+18.5%',
      series: revenueSeries,
    },
    appointmentOverview,
    locationPerformance,
    topServices,
    recentAppointments,
    leadSources,
  };
}

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
      if (email === 'admin@auravitalstar.ca' && password === 'Admin@AVS2025') {
        return json(200, {
          success: true,
          data: {
            user: {
              id: 'usr-admin',
              name: 'AVS Admin',
              email: 'admin@auravitalstar.ca',
              role: 'ADMIN',
              location: 'All Locations'
            },
            token: 'avs_crm_session_jwt_mock_token_admin_2025'
          }
        });
      } else {
        return json(401, {
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
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

    // 5. DASHBOARD ROUTES
    if (pathname.startsWith('/api/dashboard')) {
      const locationParam = url.searchParams.get('location') || '';
      const dateRangeParam = url.searchParams.get('dateRange') || '';
      const startDateParam = url.searchParams.get('startDate') || '';
      const endDateParam = url.searchParams.get('endDate') || '';

      const metrics = computeDashboardMetrics(locationParam, dateRangeParam, startDateParam, endDateParam);

      if (pathname === '/api/dashboard/overview' || pathname === '/api/dashboard/summary') {
        return json(200, { success: true, data: metrics });
      }
      if (pathname === '/api/dashboard/revenue') {
        return json(200, { success: true, data: metrics.revenueOverview });
      }
      if (pathname === '/api/dashboard/appointments') {
        return json(200, { success: true, data: metrics.appointmentOverview });
      }
      if (pathname === '/api/dashboard/locations') {
        return json(200, { success: true, data: metrics.locationPerformance });
      }
      if (pathname === '/api/dashboard/top-services') {
        return json(200, { success: true, data: metrics.topServices });
      }
      if (pathname === '/api/dashboard/recent-appointments') {
        return json(200, { success: true, data: metrics.recentAppointments });
      }
      if (pathname === '/api/dashboard/lead-sources') {
        return json(200, { success: true, data: metrics.leadSources });
      }
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
          invoiceNo: 'INV-' + Date.now().toString().slice(-6),
          clientId: body.clientId || 'cl-1',
          clientName: body.clientName || 'Valued Client',
          clientEmail: body.clientEmail || '',
          clientPhone: body.clientPhone || '',
          date: body.date || new Date().toISOString().split('T')[0],
          dueDate: body.dueDate || new Date().toISOString().split('T')[0],
          location: body.location || 'Brampton',
          status: body.status || 'Paid',
          items: body.items || [{ id: 'it-1', service: 'Clinical Treatment', quantity: 1, price: 100, amount: 100 }],
          subtotal: parseFloat(body.subtotal || 100),
          tax: parseFloat(body.tax || 13),
          discount: parseFloat(body.discount || 0),
          total: parseFloat(body.total || 113),
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
