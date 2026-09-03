import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

// GET /api/clients
export async function getClients(req: AuthRequest, res: Response) {
  try {
    const { search, location, status, page = '1', limit = '20', sortBy = 'createdAt', sortDir = 'desc' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where: any = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (location && location !== 'All Locations') {
      where.location = { shortName: location };
    }
    if (status) where.status = status;

    const validSortFields = ['fullName', 'createdAt', 'totalVisits', 'totalSpent', 'lastVisit'];
    const orderBy: any = {};
    orderBy[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortDir === 'asc' ? 'asc' : 'desc';

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: { location: { select: { shortName: true } } },
      }),
      prisma.client.count({ where }),
    ]);

    return ok(res, clients, { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err: any) {
    return serverError(res);
  }
}

// GET /api/clients/:id
export async function getClient(req: Request, res: Response) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        location: true,
        appointments: { orderBy: { createdAt: 'desc' }, include: { service: true, location: true } },
        invoices: { orderBy: { createdAt: 'desc' }, include: { items: true } },
        notes_list: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!client) return notFound(res, 'Client');
    return ok(res, client);
  } catch {
    return serverError(res);
  }
}

// POST /api/clients
export async function createClient(req: AuthRequest, res: Response) {
  try {
    const { firstName, lastName, phone, email, locationId, gender, dob, notes } = req.body;
    if (!firstName || !lastName || !phone) {
      return fail(res, 'VALIDATION_ERROR', 'First name, last name, and phone are required');
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const client = await prisma.client.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        fullName,
        phone: phone.trim(),
        email: email ? email.toLowerCase().trim() : null,
        locationId: locationId || null,
        gender: gender || null,
        dob: dob || null,
        notes: notes || null,
      },
      include: { location: true },
    });
    await prisma.notification.create({ data: { title: 'New Client Registered', message: `${fullName} has been added to the system.`, type: 'system' } });
    return created(res, client);
  } catch (err: any) {
    if (err.code === 'P2002') return fail(res, 'DUPLICATE', 'A client with this email already exists');
    return serverError(res);
  }
}

// PATCH /api/clients/:id
export async function updateClient(req: AuthRequest, res: Response) {
  try {
    const { firstName, lastName, phone, email, locationId, gender, dob, notes, status } = req.body;
    const data: any = {};
    if (firstName) { data.firstName = firstName.trim(); }
    if (lastName) { data.lastName = lastName.trim(); }
    if (firstName || lastName) {
      const existing = await prisma.client.findUnique({ where: { id: req.params.id } });
      if (existing) data.fullName = `${data.firstName || existing.firstName} ${data.lastName || existing.lastName}`;
    }
    if (phone) data.phone = phone.trim();
    if (email !== undefined) data.email = email ? email.toLowerCase().trim() : null;
    if (locationId !== undefined) data.locationId = locationId || null;
    if (gender !== undefined) data.gender = gender || null;
    if (dob !== undefined) data.dob = dob || null;
    if (notes !== undefined) data.notes = notes || null;
    if (status) data.status = status;

    const client = await prisma.client.update({ where: { id: req.params.id }, data, include: { location: true } });
    return ok(res, client);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Client');
    return serverError(res);
  }
}

// GET /api/clients/:id/appointments
export async function getClientAppointments(req: Request, res: Response) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { clientId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: { service: true, location: true, staff: true },
    });
    return ok(res, appointments);
  } catch {
    return serverError(res);
  }
}

// GET /api/clients/:id/invoices
export async function getClientInvoices(req: Request, res: Response) {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { clientId: req.params.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true, location: true },
    });
    return ok(res, invoices);
  } catch {
    return serverError(res);
  }
}

// POST /api/clients/:id/notes
export async function addClientNote(req: AuthRequest, res: Response) {
  try {
    const { content } = req.body;
    if (!content) return fail(res, 'VALIDATION_ERROR', 'Note content is required');
    const note = await prisma.note.create({
      data: {
        clientId: req.params.id,
        content: content.trim(),
        author: req.user?.email || 'Admin',
      },
    });
    return created(res, note);
  } catch {
    return serverError(res);
  }
}
