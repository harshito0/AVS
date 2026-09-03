import { Lead, LeadStatus, LeadSource } from '../types';
import { leadsApi } from './apiClient';

function mapLead(l: any): Lead {
  return {
    id: l.id,
    name: l.name || 'Lead',
    phone: l.phone || '',
    email: l.email || '',
    source: (l.source || 'Website') as LeadSource,
    location: (l.location?.shortName || l.location || 'Brampton') as 'Brampton' | 'Mississauga',
    interestService: l.interestService || 'General Inquiry',
    status: (l.status || 'Follow Up') as LeadStatus,
    addedOn: typeof l.createdAt === 'string' ? l.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    notes: l.notes || undefined
  };
}

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    try {
      const res = await leadsApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapLead);
      }
    } catch (e) {
      console.error('[leadService] Failed to fetch leads from API', e);
    }
    return [];
  },

  async createLead(leadData: Omit<Lead, 'id' | 'addedOn'>): Promise<Lead> {
    try {
      const res = await leadsApi.create({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        source: leadData.source,
        interestService: leadData.interestService,
        status: leadData.status,
        notes: leadData.notes
      });
      if (res.success && res.data) {
        return mapLead(res.data);
      }
    } catch (e) {
      console.error('[leadService] Failed to create lead via API', e);
    }
    throw new Error('Failed to create lead');
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    try {
      const res = await leadsApi.update(id, { status });
      if (res.success && res.data) {
        return mapLead(res.data);
      }
    } catch (e) {
      console.error('[leadService] Failed to update lead status via API', e);
    }
    throw new Error('Failed to update lead status');
  },

  async deleteLead(id: string): Promise<boolean> {
    try {
      const res = await leadsApi.delete(id);
      return res.success;
    } catch (e) {
      console.error('[leadService] Failed to delete lead', e);
      return false;
    }
  },

  getStats() {
    return {
      totalLeads: 0,
      followUp: 0,
      converted: 0,
      deadLeads: 0,
      conversionRate: '0%'
    };
  }
};
