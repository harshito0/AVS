import { Appointment, AppointmentStatus } from '../types';
import { appointmentsApi } from './apiClient';

function mapAppointment(a: any): Appointment {
  const clientName =
    a.clientName ||
    a.client?.fullName ||
    a.guestName ||
    a.customerName ||
    a.name ||
    'Valued Guest';

  const phone =
    a.phone ||
    a.guestPhone ||
    a.client?.phone ||
    a.clientPhone ||
    '';

  const email =
    a.email ||
    a.guestEmail ||
    a.client?.email ||
    a.clientEmail ||
    '';

  const service =
    (typeof a.service === 'string' ? a.service : a.service?.name) ||
    a.serviceName ||
    'AVS Treatment';

  const serviceCategory =
    a.serviceCategory ||
    a.service?.category ||
    'General Wellness';

  const staff =
    (typeof a.staff === 'string' ? a.staff : a.staff?.name) ||
    a.staffName ||
    a.specialist ||
    'Staff Specialist';

  const location = (a.location?.shortName || a.location || 'Brampton') as 'Brampton' | 'Mississauga';

  return {
    id: a.id,
    clientName,
    clientId: a.clientId || '',
    phone,
    email,
    service,
    serviceCategory,
    staff,
    location,
    date: a.date || '',
    time: a.time || '',
    duration: a.duration || '60 min',
    status: (a.status || 'Pending') as AppointmentStatus,
    amount: typeof a.amount === 'number' ? a.amount : (Number(a.amount) || 0),
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
        clientName: data.clientName,
        customerName: data.clientName,
        phone: data.phone,
        guestPhone: data.phone,
        email: data.email,
        guestEmail: data.email,
        service: data.service,
        serviceName: data.service,
        serviceCategory: data.serviceCategory,
        staff: data.staff,
        staffName: data.staff,
        location: data.location,
        locationName: data.location,
        date: data.date,
        time: data.time,
        duration: data.duration,
        amount: data.amount,
        status: data.status || 'Confirmed',
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
      const res = await appointmentsApi.delete(id);
      return res.success;
    } catch (e) {
      console.error('[appointmentService] Failed to delete appointment', e);
      return false;
    }
  }
};

