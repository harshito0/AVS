import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from both root .env and server/.env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server', '.env') });

const otpStore = new Map();

/**
 * Integrated Vite Dev API Middleware Plugin
 * Ensures /api/send-otp, /api/verify-otp, /api/contact, and /api/bookings
 * work 100% reliably in development without needing a separate backend process.
 */
function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/')) return next();

        const readBody = () =>
          new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });

        const sendJson = (statusCode, obj) => {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
          res.statusCode = statusCode;
          res.end(JSON.stringify(obj));
        };

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        try {
          // GET /api/health
          if (url.startsWith('/api/health')) {
            return sendJson(200, {
              status: 'ok',
              service: 'Aura Vital Star Integrated Dev API',
              smtpHost: process.env.SMTP_HOST || 'neo.herosite.pro'
            });
          }

          // POST /api/send-otp
          if (url.startsWith('/api/send-otp') && req.method === 'POST') {
            const body = await readBody();
            const { email, name } = body;
            if (!email || !email.includes('@')) {
              return sendJson(400, { success: false, error: 'Valid email address is required' });
            }

            const cleanEmail = email.toLowerCase().trim();
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

            otpStore.set(cleanEmail, {
              otp: generatedOtp,
              expiresAt: Date.now() + 10 * 60 * 1000,
              name: name || 'Valued Guest'
            });

            console.log(`🔐 [Vite Dev API] Generated OTP for ${cleanEmail}: ${generatedOtp}`);

            const { sendOtpEmail } = await import('./server/email.js');
            const result = await sendOtpEmail(cleanEmail, name, generatedOtp);

            if (result.success) {
              return sendJson(200, {
                success: true,
                message: `Verification code sent to ${cleanEmail}`,
                otp: result.otp
              });
            } else {
              console.error(`❌ [Vite Dev API] Failed to send OTP:`, result.error || result.reason);
              return sendJson(500, {
                success: false,
                error: result.error || result.reason || 'Failed to dispatch OTP email'
              });
            }
          }

          // POST /api/verify-otp
          if (url.startsWith('/api/verify-otp') && req.method === 'POST') {
            const body = await readBody();
            const { email, otp } = body;
            if (!email || !otp) {
              return sendJson(400, {
                success: false,
                error: 'Email and 6-digit OTP code are required.'
              });
            }

            const cleanEmail = email.toLowerCase().trim();
            const cleanOtp = otp.toString().trim();
            const record = otpStore.get(cleanEmail);

            if (!record) {
              return sendJson(400, {
                success: false,
                error: 'No active OTP found for this email. Please click "Resend Code".'
              });
            }

            if (Date.now() > record.expiresAt) {
              otpStore.delete(cleanEmail);
              return sendJson(400, {
                success: false,
                error: 'The OTP code has expired. Please click "Resend Code".'
              });
            }

            if (record.otp !== cleanOtp) {
              return sendJson(400, {
                success: false,
                error: 'Incorrect verification code. Please check your email and try again.'
              });
            }

            otpStore.delete(cleanEmail);
            console.log(`✅ [Vite Dev API] Email verified successfully for: ${cleanEmail}`);
            return sendJson(200, { success: true, message: 'Email verified successfully!' });
          }

          // POST /api/contact
          if (url.startsWith('/api/contact') && req.method === 'POST') {
            const body = await readBody();
            const { name, email, phone, service, message } = body;
            if (!name || !email || !message) {
              return sendJson(400, {
                success: false,
                error: 'Name, email, and message are required.'
              });
            }

            const { sendContactInquiryEmail } = await import('./server/email.js');
            const emailResult = await sendContactInquiryEmail({
              name,
              email,
              phone,
              service,
              message
            });
            return sendJson(200, { success: true, emailResult });
          }

          // POST /api/bookings
          if (url.startsWith('/api/bookings') && req.method === 'POST') {
            const body = await readBody();
            const { insertBooking } = await import('./server/db.js');
            const { sendBookingEmails } = await import('./server/email.js');

            const savedRecord = insertBooking(body);
            let emailResult = { success: false };
            try {
              emailResult = await sendBookingEmails(savedRecord);
            } catch (err) {
              console.error('[Vite Dev API] Booking email error:', err);
            }

            return sendJson(201, { success: true, booking: savedRecord, emailResult });
          }

          // GET /api/bookings
          if (url.startsWith('/api/bookings') && req.method === 'GET') {
            const { getAllBookings } = await import('./server/db.js');
            return sendJson(200, { success: true, bookings: getAllBookings() });
          }

          // CRM API Delegation for Services, Packages, Gallery, and Dashboard
          if (
            url.startsWith('/api/services') ||
            url.startsWith('/api/packages') ||
            url.startsWith('/api/gallery') ||
            url.startsWith('/api/dashboard') ||
            url.startsWith('/api/auth') ||
            url.startsWith('/api/clients') ||
            url.startsWith('/api/appointments')
          ) {
            const { default: crmHandler } = await import('./api/crm.js');
            return await crmHandler(req, res);
          }

          next();
        } catch (err) {
          console.error('[Vite Dev API] Error:', err);
          sendJson(500, { success: false, error: err.message });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  build: {
    target: 'esnext',
    cssMinify: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
