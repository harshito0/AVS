import { Request, Response, NextFunction } from 'express';

export type ApiSuccess<T = unknown> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export function ok<T>(res: Response, data: T, meta?: ApiSuccess<T>['meta'], status = 200) {
  const body: ApiSuccess<T> = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

export function created<T>(res: Response, data: T) {
  return ok(res, data, undefined, 201);
}

export function fail(res: Response, code: string, message: string, status = 400) {
  const body: ApiError = { success: false, error: { code, message } };
  return res.status(status).json(body);
}

export function notFound(res: Response, entity = 'Resource') {
  return fail(res, 'NOT_FOUND', `${entity} not found`, 404);
}

export function unauthorized(res: Response, message = 'Authentication required') {
  return fail(res, 'UNAUTHORIZED', message, 401);
}

export function forbidden(res: Response, message = 'Access denied') {
  return fail(res, 'FORBIDDEN', message, 403);
}

export function serverError(res: Response, message = 'Internal server error') {
  return fail(res, 'SERVER_ERROR', message, 500);
}

// Global error handler middleware
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('[Error]', err.message);
  return serverError(res, process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong');
}
