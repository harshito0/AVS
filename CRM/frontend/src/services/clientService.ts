import { Client } from '../types';
import { clientsApi } from './apiClient';

function mapClient(c: any): Client {
  return {
    id: c.id,
    firstName: c.firstName || '',
    lastName: c.lastName || '',
    name: c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Client',
    phone: c.phone || '',
    email: c.email || '',
    location: (c.location?.shortName || c.location || 'Brampton') as 'Brampton' | 'Mississauga',
    totalVisits: c.totalVisits ?? 0,
    totalSpent: c.totalSpent ?? 0,
    lastVisit: c.lastVisit || 'None',
    lastService: c.lastService || 'None',
    status: (c.status || 'Active') as 'Active' | 'Inactive',
    avatar: c.avatar,
    gender: c.gender || 'Prefer not to say',
    dob: c.dob || '',
    notes: c.notes || '',
    createdAt: typeof c.createdAt === 'string' ? c.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
  };
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const res = await clientsApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        const apiClients = res.data.map(mapClient);
        // Also check if any clients exist in website localStorage bookings
        try {
          const raw = localStorage.getItem('avs_crm_bookings');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const localClients: Client[] = parsed.map((b: any, idx: number) => mapClient({
                id: 'cl-web-' + (b.id || idx),
                firstName: (b.customerName || b.name || 'Valued Guest').split(' ')[0],
                lastName: (b.customerName || b.name || '').split(' ').slice(1).join(' '),
                fullName: b.customerName || b.name || 'Valued Guest',
                phone: b.phone || '',
                email: b.email || '',
                location: b.location?.includes('Mississauga') ? 'Mississauga' : 'Brampton',
                totalVisits: 1,
                totalSpent: 120,
                lastVisit: b.date || new Date().toISOString().split('T')[0],
                lastService: b.service || 'AVS Signature Treatment',
                status: 'Active',
                createdAt: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
              }));
              const existingEmails = new Set(apiClients.map(c => c.email.toLowerCase()));
              const extras = localClients.filter(c => !c.email || !existingEmails.has(c.email.toLowerCase()));
              return [...extras, ...apiClients];
            }
          }
        } catch {}
        return apiClients;
      }
    } catch (e) {
      console.error('[clientService] Failed to fetch from API', e);
    }

    // Fallback if API offline
    try {
      const raw = localStorage.getItem('avs_crm_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((b: any, idx: number) => mapClient({
            id: 'cl-web-' + (b.id || idx),
            firstName: (b.customerName || b.name || 'Valued Guest').split(' ')[0],
            lastName: (b.customerName || b.name || '').split(' ').slice(1).join(' '),
            fullName: b.customerName || b.name || 'Valued Guest',
            phone: b.phone || '',
            email: b.email || '',
            location: b.location?.includes('Mississauga') ? 'Mississauga' : 'Brampton',
            totalVisits: 1,
            totalSpent: 120,
            lastVisit: b.date || new Date().toISOString().split('T')[0],
            lastService: b.service || 'AVS Signature Treatment',
            status: 'Active',
            createdAt: b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]
          }));
        }
      }
    } catch {}

    return [];
  },

  async getClientById(id: string): Promise<Client | undefined> {
    try {
      const res = await clientsApi.getById(id);
      if (res.success && res.data) {
        return mapClient(res.data);
      }
    } catch (e) {
      console.error('[clientService] Failed to fetch client', e);
    }
    return undefined;
  },

  async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'totalVisits' | 'totalSpent' | 'status' | 'lastVisit' | 'lastService'>): Promise<Client> {
    try {
      const res = await clientsApi.create({
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        phone: clientData.phone,
        email: clientData.email,
        gender: clientData.gender,
        dob: clientData.dob,
        notes: clientData.notes
      });
      if (res.success && res.data) {
        return mapClient(res.data);
      }
    } catch (e) {
      console.error('[clientService] Failed to create client via API', e);
    }
    throw new Error('Failed to create client');
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const res = await clientsApi.update(id, updates);
      if (res.success && res.data) {
        return mapClient(res.data);
      }
    } catch (e) {
      console.error('[clientService] Failed to update client via API', e);
    }
    throw new Error('Failed to update client');
  },

  async deleteClient(id: string): Promise<boolean> {
    // Soft delete or inactive
    try {
      const res = await clientsApi.update(id, { status: 'Inactive' });
      return res.success;
    } catch (e) {
      console.error('[clientService] Failed to delete client', e);
      return false;
    }
  },

  getStats() {
    return {
      totalClients: 0,
      newClientsThisMonth: 0,
      returningClients: 0,
      totalSpend: 0,
      avgSpendPerClient: 0
    };
  }
};
