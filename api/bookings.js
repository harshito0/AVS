import nodemailer from 'nodemailer';
import { recordWebsiteBooking } from './crmStore.js';

const SMTP_HOST = (process.env.SMTP_HOST || 'neo.herosite.pro').trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = (process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@auravitalstar.ca').trim();
const SMTP_PASS = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'C0d3kap#123').replace(/["'\s]/g, '');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'auravitalstar@gmail.com').trim();
const FROM_NAME = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
const FROM_EMAIL = (process.env.FROM_EMAIL || SMTP_USER).trim();

function getTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false,
      servername: SMTP_HOST
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      service: 'Aura Vital Star Serverless Booking & Email API',
      configuredGmail: SMTP_USER
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const booking = req.body || {};
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = booking.id || `AVS-${year}-${randomNum}`;
    const customerName = (booking.customerName || booking.name || booking.clientName || booking.fullName || 'Valued Guest').trim();
    const phone = (booking.phone || booking.guestPhone || booking.clientPhone || '').trim();
    const email = (booking.email || booking.guestEmail || booking.clientEmail || '').toLowerCase().trim();
    const service = booking.service || booking.serviceName || 'Signature Treatment';
    const duration = booking.duration || '60 min';
    const location = booking.location || booking.locationName || 'Brampton';
    const date = booking.date || new Date().toISOString().split('T')[0];
    const time = booking.time || '10:00 AM';
    const notes = booking.notes || '';
    const source = booking.source || 'QR Code';
    const status = 'Confirmed';

    const fullBooking = {
      ...booking,
      id: bookingId,
      customerName,
      name: customerName,
      clientName: customerName,
      phone,
      email,
      service,
      duration,
      location,
      date,
      time,
      notes,
      source,
      status,
      createdAt: new Date().toISOString()
    };

    // Save to CRM persistent database (Redis on Vercel) immediately
    let crmResult = null;
    try {
      crmResult = await recordWebsiteBooking(fullBooking);
    } catch (storeErr) {
      console.error('[Bookings API] Error saving to CRM store:', storeErr.message);
    }

    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px 12px; color: #1E2421; -webkit-font-smoothing: antialiased; }
          .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 10px 30px rgba(6,44,34,0.08); }
          .header { background: #062C22; color: #FAF5EA; padding: 34px 24px 28px; text-align: center; border-bottom: 3px solid #B9975B; }
          .header-brand { font-family: Georgia, 'Times New Roman', serif; font-size: 14px; letter-spacing: 0.22em; text-transform: uppercase; color: #DFBE77; margin: 0 0 6px 0; font-weight: 600; }
          .header h1 { font-family: Georgia, 'Times New Roman', serif; margin: 0 0 6px 0; font-size: 24px; color: #FAF5EA; font-weight: normal; }
          .header-sub { margin: 0; color: #C5D5CF; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
          .content { padding: 32px 28px; line-height: 1.65; color: #2A332E; }
          .status-banner { background: #EBF5F0; border: 1px solid #2D7A58; border-radius: 10px; padding: 12px 18px; margin: 18px 0 24px; text-align: center; color: #1E5C40; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; text-transform: uppercase; }
          .recap-box { background: #FAF7F2; border: 1px solid #E2D9CB; border-radius: 12px; padding: 22px 24px; margin: 22px 0; }
          .recap-title { font-size: 13px; font-weight: 700; color: #062C22; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 14px; border-bottom: 1px solid #EAE2D5; padding-bottom: 8px; }
          .recap-row { margin: 10px 0; font-size: 14px; display: flex; align-items: baseline; }
          .recap-label { font-weight: 700; color: #062C22; min-width: 130px; display: inline-block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; }
          .recap-value { color: #1E2421; flex: 1; }
          .reminder-box { background: #F4F8F5; border-left: 4px solid #062C22; padding: 16px 20px; margin: 24px 0; border-radius: 0 10px 10px 0; }
          .reminder-title { margin: 0 0 8px 0; font-weight: 700; color: #062C22; font-size: 14px; }
          .reminder-list { margin: 0; padding-left: 18px; font-size: 13px; color: #3A443E; line-height: 1.6; }
          .reminder-list li { margin: 5px 0; }
          .action-center { text-align: center; margin: 28px 0 12px; }
          .btn-primary { background: #062C22; color: #DFBE77 !important; padding: 13px 26px; border-radius: 8px; font-weight: 700; text-decoration: none; display: inline-block; font-size: 14px; border: 1px solid #B9975B; letter-spacing: 0.04em; }
          .footer { background: #F6F1E8; padding: 22px 24px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; line-height: 1.6; }
          .footer a { color: #8A682D; text-decoration: none; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <p class="header-brand">Aura Vital Star</p>
            <h1>Appointment Confirmation &amp; Visit Reminder</h1>
            <p class="header-sub">Luxury Sanctuary &bull; Holistic Rejuvenation</p>
          </div>
          <div class="content">
            <p style="font-size: 16px;">Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for choosing <strong>Aura Vital Star Rejuvenation Centre</strong>! We are delighted to confirm your upcoming appointment. Please keep this email handy as your visit reminder so you have all your details in one place.</p>
            
            <div class="status-banner">
              &#10003; Appointment Status: Confirmed
            </div>

            <div class="recap-box">
              <div class="recap-title">Appointment Summary</div>
              <div class="recap-row"><span class="recap-label">Reference ID:</span> <strong style="color: #8A682D; font-family: monospace; font-size: 15px;">${fullBooking.id}</strong></div>
              <div class="recap-row"><span class="recap-label">Treatment:</span> <strong>${fullBooking.service}</strong> (${duration})</div>
              <div class="recap-row"><span class="recap-label">Date:</span> <strong>${fullBooking.date}</strong></div>
              <div class="recap-row"><span class="recap-label">Time:</span> <strong>${fullBooking.time}</strong></div>
              <div class="recap-row"><span class="recap-label">Location:</span> <span><strong>${location} Centre</strong><br><span style="font-size: 12px; color: #666;">157 Queen Street West, Brampton, ON L6Y 1P9</span></span></div>
              <div class="recap-row"><span class="recap-label">Guest Name:</span> <span>${customerName}</span></div>
              ${phone ? `<div class="recap-row"><span class="recap-label">Phone:</span> <span>${phone}</span></div>` : ''}
              ${notes ? `<div class="recap-row"><span class="recap-label">Notes:</span> <em>"${notes}"</em></div>` : ''}
            </div>

            <div class="reminder-box">
              <div class="reminder-title">&#127807; Preparation &amp; Visit Reminders:</div>
              <ul class="reminder-list">
                <li><strong>Arrival:</strong> Please arrive 10 to 15 minutes before your scheduled appointment to unwind in our lounge and enjoy a complimentary botanical herbal tea.</li>
                <li><strong>Complimentary Parking:</strong> Dedicated guest parking is available on-site at our facility.</li>
                <li><strong>Rescheduling:</strong> If you need to adjust your time, please call or message us at least 24 hours in advance.</li>
              </ul>
            </div>

            <div class="action-center">
              <a href="tel:+16479875451" class="btn-primary">&#128222; Concierge Assistance: +1 647-987-5451</a>
            </div>

            <p style="margin-top: 26px; font-size: 14px; color: #4A544E;">Our specialist team is preparing your sanctuary prior to your arrival. We look forward to welcoming you.</p>
            <p style="margin-top: 20px; color: #062C22; font-weight: 700;">Warm regards,<br>The Aura Vital Star Team</p>
          </div>
          <div class="footer">
            <strong>Aura Vital Star Rejuvenation Centre</strong><br>
            157 Queen Street West, Brampton, ON L6Y 1P9 &bull; Phone: +1 647-987-5451<br>
            <a href="https://www.auravitalstar.ca">www.auravitalstar.ca</a> &bull; <a href="mailto:info@auravitalstar.ca">info@auravitalstar.ca</a>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #222;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 28px; border-top: 6px solid #062C22;">
          <h2 style="color: #062C22; margin-top: 0; font-size: 20px;">✨ New Appointment Received — Aura Vital Star</h2>
          <p style="font-size: 14px; color: #555;">A new appointment has been registered and synced to the CRM portal:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; width: 140px; color: #062C22;">Booking ID:</td><td style="padding: 8px 6px;"><strong style="color: #8A682D; font-family: monospace;">${fullBooking.id}</strong></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Channel / Source:</td><td style="padding: 8px 6px;"><strong style="background: #EBF5F0; color: #1E5C40; padding: 3px 8px; border-radius: 4px;">${source}</strong></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Customer Name:</td><td style="padding: 8px 6px;"><strong>${customerName}</strong></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Phone:</td><td style="padding: 8px 6px;"><a href="tel:${phone}" style="color: #062C22; font-weight: bold;">${phone || 'Not provided'}</a></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Email:</td><td style="padding: 8px 6px;"><a href="mailto:${email}" style="color: #062C22;">${email || 'Not provided'}</a></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Service:</td><td style="padding: 8px 6px;"><strong>${fullBooking.service}</strong> (${duration})</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Date &amp; Time:</td><td style="padding: 8px 6px;"><strong>${fullBooking.date}</strong> at <strong>${fullBooking.time}</strong></td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Location:</td><td style="padding: 8px 6px;">${location} Centre (157 Queen St W)</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Status:</td><td style="padding: 8px 6px;"><strong style="color: #2D7A58;">Confirmed</strong></td></tr>
            <tr><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Notes:</td><td style="padding: 8px 6px;">${notes || 'None'}</td></tr>
          </table>

          <div style="text-align: center; margin: 24px 0 10px;">
            <a href="https://www.auravitalstar.ca/crm/appointments" style="background: #062C22; color: #DFBE77; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 13px;">View in CRM Appointments Portal &rarr;</a>
          </div>

          <p style="font-size: 11px; color: #888; text-align: center; margin-top: 18px;">Recorded at ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</p>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    let emailSent = false;
    let emailError = null;

    const customerSubject = `Appointment Confirmation & Visit Reminder: ${fullBooking.service} — Aura Vital Star [${fullBooking.id}]`;
    const adminSubject = `[NEW APPOINTMENT - ${source}] ${customerName} - ${fullBooking.service} [${fullBooking.id}]`;

    // 1. Send confirmation & reminder email to customer (if email provided)
    if (email) {
      try {
        await transporter.sendMail({
          from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
          to: email,
          subject: customerSubject,
          html: customerHtml
        });
        emailSent = true;
      } catch (err) {
        console.error('Customer email delivery error:', err);
        emailError = err.message;
      }
    }

    // 2. Send notification to Admin
    try {
      await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml
      });
    } catch (adminErr) {
      console.warn('Admin notification email warning:', adminErr.message);
    }

    return res.status(200).json({
      success: true,
      booking: fullBooking,
      crmAppointment: crmResult?.appointment,
      crmClient: crmResult?.client,
      emailSent,
      emailError
    });
  } catch (err) {
    console.error('Serverless email dispatch error:', err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

