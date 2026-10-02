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

  const location = 'Brampton';

  let status: AppointmentStatus = 'Confirmed';
  const rawStatus = (a.status || 'Confirmed').toString().trim();
  if (/^pending$/i.test(rawStatus)) status = 'Pending';
  else if (/^confirmed$/i.test(rawStatus)) status = 'Confirmed';
  else if (/^completed$/i.test(rawStatus)) status = 'Completed';
  else if (/^cancelled$/i.test(rawStatus)) status = 'Cancelled';
  else if (/^no[-_\s]?show$/i.test(rawStatus)) status = 'No Show';

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
    status,
    amount: typeof a.amount === 'number' ? a.amount : (Number(a.amount) || 0),
    notes: a.notes || undefined,
    source: a.source || 'QR Code',
    dob: a.dob || a.consentForm?.dob || undefined,
    address: a.address || a.consentForm?.address || undefined,
    consentForm: a.consentForm || null,
    consentCompleted: Boolean(a.consentCompleted ?? a.consentForm)
  };
}

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    try {
      const res = await appointmentsApi.getAll({ limit: '100' });
      if (res.success && Array.isArray(res.data)) {
        const apiApts = res.data.map(mapAppointment);
        // Also merge any bookings from website localStorage by ID
        try {
          const raw = localStorage.getItem('avs_crm_bookings');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const localApts = parsed.map(mapAppointment);
              const existingIds = new Set(apiApts.map((a: Appointment) => a.id));
              const extras = localApts.filter((a: Appointment) => !existingIds.has(a.id));
              return [...extras, ...apiApts];
            }
          }
        } catch {
          // ignore parsing error
        }
        return apiApts;
      }
    } catch (e) {
      console.error('[appointmentService] Failed to fetch appointments from API', e);
    }

    // Fallback if API is offline
    try {
      const raw = localStorage.getItem('avs_crm_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map(mapAppointment);
        }
      }
    } catch {
      // ignore
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

