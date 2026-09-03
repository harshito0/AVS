import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export async function getLeads(req: AuthRequest, res: Response) {
  try {
    const { search, status, source, location, page = '1', limit = '20' } = req.query as Record<string, string>;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (status && status !== 'All') where.status = status;
    if (source && source !== 'All') where.source = source;
    if (location && location !== 'All Locations') {
      where.location = { shortName: location };
    }

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where, orderBy: { createdAt: 'desc' }, skip, take: parseInt(limit),
        include: { location: { select: { shortName: true } } },
      }),
      prisma.lead.count({ where }),
    ]);

    return ok(res, leads, { page: parseInt(page), limit: parseInt(limit), total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch {
    return serverError(res);
  }
}

export async function createLead(req: AuthRequest, res: Response) {
  try {
    const { name, phone, email, source, locationId, interestService, notes, status } = req.body;
    if (!name || !phone) return fail(res, 'VALIDATION_ERROR', 'Name and phone are required');

    const lead = await prisma.lead.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.toLowerCase().trim() : null,
        source: source || 'Manual',
        locationId: locationId || null,
        interestService: interestService || null,
        notes: notes || null,
        status: status || 'Follow Up',
      },
      include: { location: true },
    });

    await prisma.notification.create({
      data: { title: 'New Lead', message: `${name} (${source || 'Manual'}) has been added as a lead.`, type: 'lead' },
    });

    return created(res, lead);
  } catch {
    return serverError(res);
  }
}

export async function updateLead(req: AuthRequest, res: Response) {
  try {
    const { name, phone, email, source, locationId, interestService, notes, status, clientId } = req.body;
    const data: any = {};
    if (name) data.name = name.trim();
    if (phone) data.phone = phone.trim();
    if (email !== undefined) data.email = email ? email.toLowerCase().trim() : null;
    if (source) data.source = source;
    if (locationId !== undefined) data.locationId = locationId || null;
    if (interestService !== undefined) data.interestService = interestService || null;
    if (notes !== undefined) data.notes = notes || null;
    if (status) data.status = status;
    if (clientId !== undefined) data.clientId = clientId || null;

    const lead = await prisma.lead.update({ where: { id: req.params.id }, data, include: { location: true } });
    return ok(res, lead);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Lead');
    return serverError(res);
  }
}

export async function deleteLead(req: AuthRequest, res: Response) {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    return ok(res, { deleted: true });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Lead');
    return serverError(res);
  }
}
