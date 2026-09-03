import { Lead } from '../types';

export const INITIAL_LEADS: Lead[] = [];

export const LEAD_STATS = {
  totalLeads: 0,
  followUp: 0,
  converted: 0,
  deadLeads: 0,
  conversionRate: '0%'
};

export const LEAD_STATUS_BREAKDOWN = [
  { name: 'Converted', value: 0, percentage: '0%', color: '#1B4332' },
  { name: 'Follow Up', value: 0, percentage: '0%', color: '#C5A880' },
  { name: 'Dead', value: 0, percentage: '0%', color: '#94A3B8' }
];
