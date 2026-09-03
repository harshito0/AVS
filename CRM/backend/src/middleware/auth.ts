import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import { unauthorized, forbidden } from '../utils/apiResponse';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    locationId?: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unauthorized(res);
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
      locationId?: string;
    };
    req.user = payload;
    return next();
  } catch {
    return unauthorized(res, 'Invalid or expired token');
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return unauthorized(res);
    if (!roles.includes(req.user.role)) {
      return forbidden(res, `Required role: ${roles.join(' or ')}`);
    }
    return next();
  };
}

export const requireAdmin = requireRole('ADMIN');
export const requireManagerOrAdmin = requireRole('ADMIN', 'MANAGER');
