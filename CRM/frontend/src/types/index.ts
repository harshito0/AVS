export type Location = 'All Locations' | 'Brampton' | 'Mississauga';

export interface StatMetric {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  comparisonText?: string;
  iconName?: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  email: string;
  location: 'Brampton' | 'Mississauga';
  totalVisits: number;
  lastVisit: string;
  lastService: string;
  totalSpent: number;
  status: 'Active' | 'Inactive';
  avatar?: string;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  dob: string;
  notes?: string;
  createdAt: string;
}

export type LeadSource = 'Instagram' | 'Website' | 'Facebook' | 'Referral' | 'Google' | 'Walk In';
export type LeadStatus = 'Follow Up' | 'Converted' | 'Dead';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  location: 'Brampton' | 'Mississauga';
  interestService: string;
  status: LeadStatus;
  addedOn: string;
  notes?: string;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface InvoiceItem {
  id: string;
  service: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  date: string;
  dueDate: string;
  location: 'Brampton' | 'Mississauga';
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number; // 13% HST Ontario
  discount: number;
  total: number;
  paymentMethod: 'Credit Card' | 'Debit' | 'Cash' | 'Gift Card' | 'E-Transfer';
  notes?: string;
}

export type GiftCardStatus = 'Active' | 'Partially Used' | 'Redeemed' | 'Expired';

export interface GiftCardHistoryItem {
  id: string;
  date: string;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
  by: string;
}

export interface GiftCard {
  id: string;
  cardNumber: string; // e.g. GC-AVS-100124
  recipient: string;
  buyer: string;
  recipientEmail?: string;
  buyerEmail?: string;
  value: number;
  balance: number;
  status: GiftCardStatus;
  expiryDate: string;
  createdOn: string;
  location: 'Brampton' | 'Mississauga';
  history: GiftCardHistoryItem[];
  notes?: string;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  clientName: string;
  clientId: string;
  phone: string;
  email: string;
  service: string;
  serviceCategory: string;
  staff: string;
  location: 'Brampton' | 'Mississauga';
  date: string; // YYYY-MM-DD
  time: string; // e.g. '10:00 AM'
  duration: string; // '60 min'
  status: AppointmentStatus;
  amount: number;
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Lounge' | 'Treatments' | 'Spa Suites' | 'Products';
  imageUrl: string;
  status: 'Published' | 'Draft';
  dateAdded: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Massage Therapy' | 'Facial & Skincare' | 'Hair Spa' | 'Nail Care' | 'Body Rituals' | 'Laser & Waxing';
  duration: string;
  price: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export interface PackageItem {
  id: string;
  name: string;
  category: string;
  servicesIncluded: string[];
  sessions: number;
  price: number;
  originalPrice: number;
  discount: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'invoice' | 'lead' | 'giftCard';
}

// ============================================================
// DASHBOARD OVERVIEW TYPES
// ============================================================

export interface DashboardKpiItem {
  value: string | number;
  raw?: number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  comparisonText?: string;
}

export interface DashboardKpiData {
  totalClients: DashboardKpiItem;
  totalAppointments: DashboardKpiItem;
  todaySales: DashboardKpiItem;
  monthlySales: DashboardKpiItem;
}

export interface RevenueSeriesPoint {
  date: string;
  revenue: number;
}

export interface RevenueOverviewData {
  totalRevenue: number;
  changePercent?: string;
  series: RevenueSeriesPoint[];
}

export interface AppointmentStatusBreakdown {
  count: number;
  percentage: number;
}

export interface AppointmentOverviewData {
  total: number;
  completed: AppointmentStatusBreakdown;
  upcoming: AppointmentStatusBreakdown;
  cancelled: AppointmentStatusBreakdown;
  noShow: AppointmentStatusBreakdown;
}

export interface LocationPerformanceItem {
  id: string;
  name: string;
  shortName: string;
  appointments: number;
  sales: number;
  percentage: number;
}

export interface TopServiceItem {
  name: string;
  category: string;
  bookings: number;
  sales: number;
}

export interface RecentAppointmentItem {
  id: string;
  clientName: string;
  clientId?: string;
  service: string;
  date: string;
  time: string;
  status: string;
  location: string;
  amount?: number;
}

export interface LeadSourceItem {
  source: string;
  count: number;
  percentage: number;
}

export interface LeadSourcesData {
  total: number;
  breakdown: LeadSourceItem[];
}

export interface DashboardOverviewData {
  kpi: DashboardKpiData;
  revenueOverview: RevenueOverviewData;
  appointmentOverview: AppointmentOverviewData;
  locationPerformance: LocationPerformanceItem[];
  topServices: TopServiceItem[];
  recentAppointments: RecentAppointmentItem[];
  leadSources: LeadSourcesData;
}

