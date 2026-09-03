import { Appointment, AppointmentStatus } from '../types';
import { appointmentsApi } from './apiClient';

function mapAppointment(a: any): Appointment {
  return {
    id: a.id,
    clientName: a.client?.fullName || a.guestName || 'Guest',
    clientId: a.clientId || '',
    phone: a.guestPhone || a.client?.phone || '',
    email: a.guestEmail || a.client?.email || '',
    service: a.serviceName || a.service?.name || 'Service',
    serviceCategory: a.serviceCategory || a.service?.category || 'General',
    staff: a.staff?.name || 'Staff Member',
    location: (a.location?.shortName || a.location || 'Brampton') as 'Brampton' | 'Mississauga',
    date: a.date || '',
    time: a.time || '',
    duration: a.duration || '60 min',
    status: (a.status || 'Pending') as AppointmentStatus,
    amount: a.amount ?? 0,
    notes: a.notes || undefined
  };
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await appointmentsApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapAppointment);
      }
    } catch (e) {
      console.error('[appointmentService] Failed to fetch appointments from API', e);
    }
    return [];
  },

  async createAppointment(data: Omit<Appointment, 'id'>): Promise<Appointment> {
    try {
      const res = await appointmentsApi.create({
        name: data.clientName,
        phone: data.phone,
        email: data.email,
        service: data.service,
        serviceCategory: data.serviceCategory,
        locationName: data.location,
        date: data.date,
        time: data.time,
        duration: data.duration,
        notes: data.notes,
        source: 'CRM'
      });
      if (res.success && res.data) {
        return mapAppointment(res.data);
      }
    } catch (e) {
      console.error('[appointmentService] Failed to create appointment via API', e);
    }
    throw new Error('Failed to create appointment');
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      let res;
      if (status === 'Confirmed') {
        res = await appointmentsApi.confirm(id);
      } else if (status === 'Completed') {
        res = await appointmentsApi.complete(id);
      } else if (status === 'Cancelled') {
        res = await appointmentsApi.cancel(id);
      } else if (status === 'No Show') {
        res = await appointmentsApi.noShow(id);
      } else {
        res = await appointmentsApi.update(id, { status });
      }

      if (res.success && res.data) {
        return mapAppointment(res.data);
      }
    } catch (e) {
      console.error('[appointmentService] Failed to update status via API', e);
    }
    throw new Error('Failed to update appointment status');
  },

  async deleteAppointment(id: string): Promise<boolean> {
    try {
      const res = await appointmentsApi.cancel(id);
      return res.success;
    } catch (e) {
      console.error('[appointmentService] Failed to cancel appointment', e);
      return false;
    }
  }
};
