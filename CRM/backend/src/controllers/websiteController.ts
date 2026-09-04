import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { ok, created, notFound, fail, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

// Services
export async function getServices(req: Request, res: Response) {
  try {
    const { status, category } = req.query as Record<string, string>;
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    } else if (!status) {
      where.status = 'Active';
    }
    if (category && category !== 'All') where.category = category;
    const services = await prisma.service.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] });
    return ok(res, services);
  } catch { return serverError(res); }
}

export async function createService(req: AuthRequest, res: Response) {
  try {
    const { name, category, description, price, duration, imageUrl, status, sortOrder } = req.body;
    if (!name || !category) return fail(res, 'VALIDATION_ERROR', 'Name and category are required');
    const service = await prisma.service.create({
      data: { name, category, description: description || null, price: parseFloat(price) || 0, duration: duration || '60 min', imageUrl: imageUrl || null, status: status || 'Active', sortOrder: parseInt(sortOrder) || 0 },
    });
    return created(res, service);
  } catch { return serverError(res); }
}

export async function updateService(req: AuthRequest, res: Response) {
  try {
    const data: any = {};
    const fields = ['name', 'category', 'description', 'price', 'duration', 'imageUrl', 'status', 'sortOrder'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        data[f] = f === 'price' ? parseFloat(req.body[f]) : f === 'sortOrder' ? parseInt(req.body[f]) : req.body[f];
      }
    }
    const service = await prisma.service.update({ where: { id: req.params.id as string }, data });
    return ok(res, service);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Service');
    return serverError(res);
  }
}

export async function deleteService(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    try {
      await prisma.service.delete({ where: { id } });
    } catch {
      await prisma.service.update({ where: { id }, data: { status: 'Inactive' } });
    }
    return ok(res, { deleted: true, id });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Service');
    return serverError(res);
  }
}

// Packages
export async function getPackages(req: Request, res: Response) {
  try {
    const { status } = req.query as Record<string, string>;
    const where: any = {};
    if (status) where.status = status;
    const packages = await prisma.package.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }], include: { servicesIncluded: true } });
    return ok(res, packages);
  } catch { return serverError(res); }
}

export async function createPackage(req: AuthRequest, res: Response) {
  try {
    const { name, category, description, price, originalPrice, discount, sessions, validity, imageUrl, status, sortOrder, servicesIncluded } = req.body;
    if (!name) return fail(res, 'VALIDATION_ERROR', 'Package name is required');
    const pkg = await prisma.package.create({
      data: {
        name, category: category || 'General', description: description || null,
        price: parseFloat(price) || 0, originalPrice: parseFloat(originalPrice) || 0,
        discount: parseFloat(discount) || 0, sessions: parseInt(sessions) || 1,
        validity: validity || null, imageUrl: imageUrl || null,
        status: status || 'Active', sortOrder: parseInt(sortOrder) || 0,
        servicesIncluded: {
          create: (Array.isArray(servicesIncluded) ? servicesIncluded : []).map((s: string) => ({ serviceName: s })),
        },
      },
      include: { servicesIncluded: true },
    });
    return created(res, pkg);
  } catch { return serverError(res); }
}

export async function updatePackage(req: AuthRequest, res: Response) {
  try {
    const data: any = {};
    const fields = ['name', 'category', 'description', 'price', 'originalPrice', 'discount', 'sessions', 'validity', 'imageUrl', 'status', 'sortOrder'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        const numFields = ['price', 'originalPrice', 'discount', 'sessions', 'sortOrder'];
        data[f] = numFields.includes(f) ? parseFloat(req.body[f]) : req.body[f];
      }
    }
    const pkg = await prisma.package.update({ where: { id: req.params.id }, data, include: { servicesIncluded: true } });
    return ok(res, pkg);
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Package');
    return serverError(res);
  }
}

// Gallery
export async function getGallery(req: Request, res: Response) {
  try {
    const { status, category } = req.query as Record<string, string>;
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    } else if (!status) {
      where.status = 'Published';
    }
    if (category && category !== 'All' && category !== 'ALL') where.category = category;
    const images = await prisma.galleryImage.findMany({ where, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
    return ok(res, images);
  } catch { return serverError(res); }
}

export async function addGalleryImage(req: AuthRequest, res: Response) {
  try {
    const { title, altText, imageUrl, category, sortOrder, status } = req.body;
    if (!title || !imageUrl) return fail(res, 'VALIDATION_ERROR', 'Title and image URL are required');
    const image = await prisma.galleryImage.create({
      data: { title, altText: altText || null, imageUrl, category: category || 'General', sortOrder: parseInt(sortOrder) || 0, status: status || 'Published' },
    });
    return created(res, image);
  } catch { return serverError(res); }
}

export async function deleteGalleryImage(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    await prisma.galleryImage.delete({ where: { id } });
    return ok(res, { deleted: true, id });
  } catch (err: any) {
    if (err.code === 'P2025') return notFound(res, 'Gallery image');
    return serverError(res);
  }
}

// Locations
export async function getLocations(_req: Request, res: Response) {
  try {
    const locations = await prisma.location.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
    return ok(res, locations);
  } catch { return serverError(res); }
}
