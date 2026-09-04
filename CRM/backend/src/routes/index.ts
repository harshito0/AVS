import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import env from '../config/env';
import { authenticate, requireManagerOrAdmin } from '../middleware/auth';

// Controllers
import { login, me, changePassword } from '../controllers/authController';
import { getSummary, getDashboardOverview } from '../controllers/dashboardController';
import { getClients, getClient, createClient, updateClient, getClientAppointments, getClientInvoices, addClientNote } from '../controllers/clientController';
import { getLeads, createLead, updateLead, deleteLead } from '../controllers/leadController';
import {
  getAppointments, getAppointment, createAppointment, updateAppointment,
  confirmAppointment, completeAppointment, cancelAppointment, noShowAppointment
} from '../controllers/appointmentController';
import { getInvoices, getInvoice, createInvoice, updateInvoice } from '../controllers/invoiceController';
import { getGiftCards, getGiftCard, createGiftCard, redeemGiftCard } from '../controllers/giftCardController';
import {
  getServices, createService, updateService, deleteService,
  getPackages, createPackage, updatePackage,
  getGallery, addGalleryImage, deleteGalleryImage,
  getLocations,
} from '../controllers/websiteController';
import { getNotifications, markRead, markAllRead } from '../controllers/notificationController';

const router = Router();

// Configure image file uploads
const uploadDir = path.resolve(env.UPLOAD_DIR);
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `avs-${unique}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: (env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024 }
});

// File upload endpoint for images
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  return res.json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// ---- Health Check ----
router.get('/health', (_req, res) => res.json({ success: true, status: 'ok', service: 'AVS CRM API', timestamp: new Date().toISOString() }));

// ---- Auth ----
router.post('/auth/login', login);
router.get('/auth/me', authenticate, me);
router.post('/auth/change-password', authenticate, changePassword);

// ---- Dashboard ----
router.get('/dashboard/summary', authenticate, getSummary);
router.get('/dashboard/overview', authenticate, getDashboardOverview);

// ---- Locations (public) ----
router.get('/locations', getLocations);

// ---- Services (public GET, admin write) ----
router.get('/services', getServices);
router.post('/services', authenticate, requireManagerOrAdmin, createService);
router.patch('/services/:id', authenticate, requireManagerOrAdmin, updateService);
router.delete('/services/:id', authenticate, requireManagerOrAdmin, deleteService);

// ---- Packages (public GET, admin write) ----
router.get('/packages', getPackages);
router.post('/packages', authenticate, requireManagerOrAdmin, createPackage);
router.patch('/packages/:id', authenticate, requireManagerOrAdmin, updatePackage);

// ---- Gallery (public GET, admin write) ----
router.get('/gallery', getGallery);
router.post('/gallery', authenticate, requireManagerOrAdmin, addGalleryImage);
router.delete('/gallery/:id', authenticate, requireManagerOrAdmin, deleteGalleryImage);

// ---- Clients ----
router.get('/clients', authenticate, getClients);
router.post('/clients', authenticate, createClient);
router.get('/clients/:id', authenticate, getClient);
router.patch('/clients/:id', authenticate, updateClient);
router.get('/clients/:id/appointments', authenticate, getClientAppointments);
router.get('/clients/:id/invoices', authenticate, getClientInvoices);
router.post('/clients/:id/notes', authenticate, addClientNote);

// ---- Leads ----
router.get('/leads', authenticate, getLeads);
router.post('/leads', authenticate, createLead);
router.patch('/leads/:id', authenticate, updateLead);
router.delete('/leads/:id', authenticate, deleteLead);

// ---- Appointments (POST is public for website booking) ----
router.get('/appointments', authenticate, getAppointments);
router.post('/appointments', createAppointment);
router.get('/appointments/:id', authenticate, getAppointment);
router.patch('/appointments/:id', authenticate, updateAppointment);
router.post('/appointments/:id/confirm', authenticate, confirmAppointment);
router.post('/appointments/:id/complete', authenticate, completeAppointment);
router.post('/appointments/:id/cancel', authenticate, cancelAppointment);
router.post('/appointments/:id/no-show', authenticate, noShowAppointment);

// ---- Invoices ----
router.get('/invoices', authenticate, getInvoices);
router.post('/invoices', authenticate, createInvoice);
router.get('/invoices/:id', authenticate, getInvoice);
router.patch('/invoices/:id', authenticate, updateInvoice);

// ---- Gift Cards ----
router.get('/gift-cards', authenticate, getGiftCards);
router.post('/gift-cards', authenticate, createGiftCard);
router.get('/gift-cards/:id', authenticate, getGiftCard);
router.post('/gift-cards/:id/redeem', authenticate, redeemGiftCard);

// ---- Notifications ----
router.get('/notifications', authenticate, getNotifications);
router.patch('/notifications/:id/read', authenticate, markRead);
router.post('/notifications/read-all', authenticate, markAllRead);

export default router;
