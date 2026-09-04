import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';
import env from '../config/env';
import { ok, fail, unauthorized } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth';

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return fail(res, 'VALIDATION_ERROR', 'Email and password are required');
  }

  const clean = email.toLowerCase().trim();
  const targetEmail = clean === 'admin' ? 'admin@auravitalstar.ca' : clean;

  if (targetEmail !== 'admin@auravitalstar.ca') {
    return unauthorized(res, 'Invalid username or password. Access denied.');
  }

  const user = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!user || !user.active) {
    return unauthorized(res, 'Invalid username or password. Access denied.');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return unauthorized(res, 'Invalid username or password. Access denied.');
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, locationId: user.locationId },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id },
  });

  return ok(res, {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, locationId: user.locationId },
  });
}

export async function me(req: AuthRequest, res: Response) {
  if (!req.user) return unauthorized(res);
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, locationId: true, active: true },
  });
  if (!user) return unauthorized(res, 'User not found');
  return ok(res, user);
}

export async function changePassword(req: AuthRequest, res: Response) {
  if (!req.user) return unauthorized(res);
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return fail(res, 'VALIDATION_ERROR', 'Current password and new password (min 8 chars) required');
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return unauthorized(res);

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return fail(res, 'INVALID_PASSWORD', 'Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.user.id }, data: { passwordHash } });
  return ok(res, { message: 'Password updated successfully' });
}
