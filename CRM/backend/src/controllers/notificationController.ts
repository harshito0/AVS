import { Response } from 'express';
import prisma from '../config/prisma';
import { ok, serverError } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export async function getNotifications(req: AuthRequest, res: Response) {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' }, take: 50,
    });
    const unread = await prisma.notification.count({ where: { read: false } });
    return ok(res, { notifications, unread });
  } catch { return serverError(res); }
}

export async function markRead(req: AuthRequest, res: Response) {
  try {
    await prisma.notification.update({ where: { id: req.params.id }, data: { read: true } });
    return ok(res, { updated: true });
  } catch { return serverError(res); }
}

export async function markAllRead(_req: AuthRequest, res: Response) {
  try {
    await prisma.notification.updateMany({ where: { read: false }, data: { read: true } });
    return ok(res, { updated: true });
  } catch { return serverError(res); }
}
