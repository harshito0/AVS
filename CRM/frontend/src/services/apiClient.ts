// ============================================================
// AVS CRM — Centralized API Client
// All service files should use this instead of localStorage
// ============================================================

const API_BASE = '/api';

// Token management
const TOKEN_KEY = 'avs_crm_auth_token';
const USER_KEY = 'avs_crm_auth_user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Build headers
function buildHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ============================================================
// Core fetch wrapper
// ============================================================
export type ApiResult<T> =
  | { success: true; data: T; meta?: { page?: number; limit?: number; total?: number; totalPages?: number } }
  | { success: false; error: { code: string; message: string } };

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  includeAuth = true
): Promise<ApiResult<T>> {
  try {
    const url = `${API_BASE}${path}`;
    const options: RequestInit = {
      method,
      headers: buildHeaders(includeAuth),
    };
    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);

    // Handle 401 for protected endpoints — redirect to login
    if (res.status === 401 && path !== '/auth/login') {
      clearToken();
      const base = import.meta.env.BASE_URL || '/';
      window.location.href = base.endsWith('/') ? `${base}login` : `${base}/login`;
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Session expired. Please login again.' } };
    }

    let json: any;
    try {
      json = await res.json();
    } catch {
      json = { success: false, error: { code: 'HTTP_ERROR', message: `Server error (${res.status})` } };
    }
    return json as ApiResult<T>;
  } catch (err: any) {
    console.error(`[API] ${method} ${path} failed:`, err.message);
    return { success: false, error: { code: 'NETWORK_ERROR', message: 'Network error. Please check your connection.' } };
  }
}

// Typed convenience wrappers
export const apiGet = <T>(path: string) => request<T>('GET', path);
export const apiPost = <T>(path: string, body?: unknown, auth = true) => request<T>('POST', path, body, auth);
export const apiPatch = <T>(path: string, body?: unknown) => request<T>('PATCH', path, body);
export const apiDelete = <T>(path: string) => request<T>('DELETE', path);

// ============================================================
// Auth helpers
// ============================================================
export async function loginApi(email: string, password: string) {
  const result = await apiPost<{ token: string; user: unknown }>('/auth/login', { email, password }, false);
  if (result.success) {
    setToken(result.data.token);
    setStoredUser(result.data.user);
  }
  return result;
}

export async function getMeApi() {
  return apiGet<{ id: string; name: string; email: string; role: string }>('/auth/me');
}

// ============================================================
// Feature-specific type-safe wrappers
// ============================================================

import { DashboardOverviewData } from '../types';

// Dashboard
export const dashboardApi = {
  getSummary: () => apiGet<any>('/dashboard/summary'),
  getOverview: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<DashboardOverviewData>(`/dashboard/overview${qs}`);
  },
};

// Locations
export const locationsApi = {
  getAll: () => apiGet<any[]>('/locations'),
};

// Clients
export const clientsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/clients${qs}`);
  },
  getById: (id: string) => apiGet<any>(`/clients/${id}`),
  create: (data: unknown) => apiPost<any>('/clients', data),
  update: (id: string, data: unknown) => apiPatch<any>(`/clients/${id}`, data),
  getAppointments: (id: string) => apiGet<any[]>(`/clients/${id}/appointments`),
  getInvoices: (id: string) => apiGet<any[]>(`/clients/${id}/invoices`),
  addNote: (id: string, content: string) => apiPost<any>(`/clients/${id}/notes`, { content }),
};

// Leads
export const leadsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/leads${qs}`);
  },
  create: (data: unknown) => apiPost<any>('/leads', data),
  update: (id: string, data: unknown) => apiPatch<any>(`/leads/${id}`, data),
  delete: (id: string) => apiDelete<any>(`/leads/${id}`),
};

// Appointments
export const appointmentsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/appointments${qs}`);
  },
  getById: (id: string) => apiGet<any>(`/appointments/${id}`),
  create: (data: unknown) => apiPost<any>('/appointments', data, false), // Public
  update: (id: string, data: unknown) => apiPatch<any>(`/appointments/${id}`, data),
  confirm: (id: string) => apiPost<any>(`/appointments/${id}/confirm`),
  complete: (id: string) => apiPost<any>(`/appointments/${id}/complete`),
  cancel: (id: string) => apiPost<any>(`/appointments/${id}/cancel`),
  noShow: (id: string) => apiPost<any>(`/appointments/${id}/no-show`),
};

// Invoices
export const invoicesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/invoices${qs}`);
  },
  getById: (id: string) => apiGet<any>(`/invoices/${id}`),
  create: (data: unknown) => apiPost<any>('/invoices', data),
  update: (id: string, data: unknown) => apiPatch<any>(`/invoices/${id}`, data),
};

// Gift Cards
export const giftCardsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/gift-cards${qs}`);
  },
  getById: (id: string) => apiGet<any>(`/gift-cards/${id}`),
  create: (data: unknown) => apiPost<any>('/gift-cards', data),
  redeem: (id: string, data: unknown) => apiPost<any>(`/gift-cards/${id}/redeem`, data),
};

// Services (CMS)
export const servicesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/services${qs}`);
  },
  create: (data: unknown) => apiPost<any>('/services', data),
  update: (id: string, data: unknown) => apiPatch<any>(`/services/${id}`, data),
  delete: (id: string) => apiDelete<any>(`/services/${id}`),
};

// Packages (CMS)
export const packagesApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/packages${qs}`);
  },
  create: (data: unknown) => apiPost<any>('/packages', data),
  update: (id: string, data: unknown) => apiPatch<any>(`/packages/${id}`, data),
};

// Gallery (CMS)
export const galleryApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiGet<any[]>(`/gallery${qs}`);
  },
  add: (data: unknown) => apiPost<any>('/gallery', data),
  delete: (id: string) => apiDelete<any>(`/gallery/${id}`),
};

// Notifications
export const notificationsApi = {
  getAll: () => apiGet<any>('/notifications'),
  markRead: (id: string) => apiPatch<any>(`/notifications/${id}/read`),
  markAllRead: () => apiPost<any>('/notifications/read-all'),
};

export default { apiGet, apiPost, apiPatch, apiDelete };
