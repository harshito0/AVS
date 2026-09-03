import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';
import { sendBookingConfirmationEmail, sendStatusUpdateEmail } from '../services/emailService';

// Helper: find or create client from booking data
async function findOrCreateClient(data: {
  name: string; phone: string; email?: string; locationId?: string;
}) {
  const normalizedPhone = data.phone.replace(/\D/g, '');
  const normalizedEmail = data.email ? data.email.toLowerCase().trim() : null;

  // Search by email first, then phone
  let client = null;
  if (normalizedEmail) {
    client = await prisma.client.findFirst({ where: { email: normalizedEmail } });
  }
  if (!client) {
    client = await prisma.client.findFirst({
      where: { phone: { contains: normalizedPhone.slice(-7) } }, // last 7 digits
    });
  }

  if (!client) {
    const parts = data.name.trim().split(' ');
    const firstName = parts[0] || 'Guest';
    const lastName = parts.slice(1).join(' ') || '';
    client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        fullName: data.name.trim(),
        phone: data.phone.trim(),
        email: normalizedEmail,
        locationId: data.locationId || null,
      },
    });
    await prisma.notification.create({
      data: { title: 'New Client', message: `${data.name} has booked their first appointment.`, type: 'appointment' },
    });
  }
  return client;
}

// GET /api/appointments
export async function getAppointments(req: AuthRequest, res: Response) {
  try {
    const { search, location, status, date, dateFrom, dateTo, page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};

    if (search) {
      where.OR = [
        { guestName: { contains: search } },
        { serviceName: { contains: search } },
        { client: { fullName: { contains: search } } },
      ];
    }
    if (status && status !== 'All') where.status = status;
    if (date) where.date = date;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = dateFrom;
      if (dateTo) where.date.lte = dateTo;
    }
    if (location && location !== 'All Locations') {
      where.location = { shortName: location };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        orderBy: [{ date: 'desc' }, { time: 'asc' }],
        skip,
        take: parseInt(limit),
        include: { client: { select: { fullName: true } }, service: true, location: true, staff: true },
      }),
      prisma.appointment.count({ where }),
    ]);

    return ok(res, appointments, { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch {
    return serverError(res);
  }
}

// GET /api/appointments/:id
export async function getAppointment(req: Request, res: Response) {
  try {
    const apt = await prisma.appointment.findUnique({
      where: { id: req.params.id },
      include: { client: true, service: true, location: true, staff: true },
    });
    if (!apt) return notFound(res, 'Appointment');
    return ok(res, apt);
  } catch {
    return serverError(res);
  }
}

// POST /api/appointments â€” Public: website/QR booking
export async function createAppointment(req: Request, res: Response) {
  try {
    const { name, phone, email, service, serviceCategory, locationId, locationName, date, time, duration, notes, source } = req.body;

    if (!name || !phone || !service || !date || !time) {
      return fail(res, 'VALIDATION_ERROR', 'Name, phone, service, date, and time are required');
    }
    if (!locationId && !locationName) {
      return fail(res, 'VALIDATION_ERROR', 'Location is required');
    }

    // Resolve location
    let location = null;
    if (locationId) {
      location = await prisma.location.findUnique({ where: { id: locationId } });
    } else if (locationName) {
      location = await prisma.location.findFirst({ where: { name: { contains: locationName } } });
    }

    // Find or create client
    const client = await findOrCreateClient({ name, phone, email, locationId: location?.id });

    // Create appointment
    const apptId = `APT-${Date.now().toString().slice(-8)}`;
    const appointment = await prisma.appointment.create({
      data: {
        id: apptId,
        clientId: client.id,
        locationId: location?.id || null,
        serviceName: service,
        serviceCategory: serviceCategory || null,
        guestName: name,
        guestPhone: phone,
        guestEmail: email || null,
        date,
        time,
        duration: duration || '60 min',
        status: 'Pending',
        source: source || 'Website',
        notes: notes || null,
      },
      include: { client: true, location: true },
    });

    // Update client stats
    await prisma.client.update({
      where: { id: client.id },
      data: { totalVisits: { increment: 1 }, lastVisit: date, lastService: service },
    });

    // Create CRM notification
    await prisma.notification.create({
      data: {
        title: 'New Appointment',
        message: `${name} booked ${service} on ${date} at ${time}`,
        type: 'appointment',
      },
    });

    // Send emails (non-blocking)
    sendBookingConfirmationEmail({
      id: apptId,
      customerName: name,
      phone,
      email,
      service,
      location: location?.name || locationName || 'AVS Centre',
      date,
      time,
      duration,
      notes,
    }).catch(console.error);

    return created(res, appointment);
  } catch (err: any) {
    console.error('[Appointment Create]', err.message);
    return serverError(res);
  }
}

// PATCH /api/appointments/:id
export async function updateAppointment(req: AuthRequest, res: Response) {
  try {
    const { serviceName, date, time, duration, notes, staffId, amount } = req.body;
    const data: any = {};
    if (serviceName) data.serviceName = serviceName;
    if (date) data.date = date;
    if (time) data.time = time;
    if (duration) data.duration = duration;
    if (notes !== undefined) data.notes = notes;
    if (staffId !== undefined) data.staffId = staffId || null;
    if (amount !== undefined) data.amount = amount;

    const apt = await prisma.appointment.update({ where: { id: req.params.id }, data });
    return ok(res, apt);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Appointment');
    return serverError(res);
  }
}

// POST /api/appointments/:id/confirm
export async function confirmAppointment(req: AuthRequest, res: Response) {
  return updateStatus(req, res, 'Confirmed');
}

export async function completeAppointment(req: AuthRequest, res: Response) {
  return updateStatus(req, res, 'Completed');
}

export async function cancelAppointment(req: AuthRequest, res: Response) {
  return updateStatus(req, res, 'Cancelled');
}

export async function noShowAppointment(req: AuthRequest, res: Response) {
  return updateStatus(req, res, 'No Show');
}

async function updateStatus(req: AuthRequest, res: Response, status: string) {
  try {
    const apt = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status },
      include: { client: true, location: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action: 'STATUS_CHANGED',
        entity: 'Appointment',
        entityId: apt.id,
        details: JSON.stringify({ status }),
      },
    });

    // Send email if confirmed or cancelled
    if (['Confirmed', 'Cancelled'].includes(status)) {
      const email = apt.guestEmail || apt.client?.email;
      if (email) {
        sendStatusUpdateEmail({
          id: apt.id,
          customerName: apt.guestName || apt.client?.fullName || 'Valued Guest',
          email,
          service: apt.serviceName,
          location: apt.location?.name || '',
          date: apt.date,
          time: apt.time,
          status,
        }).catch(console.error);
      }
    }

    return ok(res, apt);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Appointment');
    return serverError(res);
  }
}
