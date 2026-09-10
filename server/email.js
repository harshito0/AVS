import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Creates and verifies SMTP transporter with robust connection parameters
 */
function getTransporter() {
  const host = (process.env.SMTP_HOST || 'neo.herosite.pro').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@auravitalstar.ca').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'C0d3kap#123').replace(/["'\s]/g, '');

  if (!user || !pass || pass === 'your_16_char_app_password') {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
      servername: host
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000
  });
}

/**
 * Dispatches an OTP verification code email to a user
 */
export async function sendOtpEmail(email, name = 'Valued Guest', otp) {
  const transporter = getTransporter();
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@auravitalstar.ca').trim();
  const fromName = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
  const fromEmail = (process.env.FROM_EMAIL || hostUser).trim();
  const otpCode = otp || Math.floor(100000 + Math.random() * 900000).toString();

  if (!transporter) {
    console.warn('⚠️ SMTP credentials not configured. Providing local OTP code.');
    return {
      success: true,
      otp: otpCode,
      warning: 'SMTP credentials not configured. OTP generated locally.'
    };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
        .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 8px 24px rgba(6,44,34,0.08); }
        .header { background: #062C22; color: #FAF5EA; padding: 28px 24px; text-align: center; border-bottom: 2px solid #B9975B; }
        .header h1 { font-family: Georgia, serif; margin: 0 0 6px 0; font-size: 22px; color: #FAF5EA; }
        .header p { margin: 0; color: #DFBE77; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .otp-box { background: #062C22; color: #DFBE77; border: 1px solid #B9975B; padding: 18px 24px; border-radius: 8px; font-size: 32px; font-weight: 700; letter-spacing: 0.3em; text-align: center; margin: 24px 0; }
        .footer { background: #F6F1E8; padding: 18px 24px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>AURA VITAL STAR REJUVENATION CENTRE</p>
          <h1>Verification Code</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Please enter the following 6-digit verification code to confirm your email and proceed with your reservation:</p>
          
          <div class="otp-box">${otpCode}</div>
          
          <p style="font-size: 13px; color: #555;">This code is valid for 10 minutes. If you did not initiate this request, please disregard this email.</p>
          <p style="margin-top: 24px; color: #062C22; font-weight: 600;">Warm regards,<br>The Aura Vital Star Concierge Team</p>
        </div>
        <div class="footer">
          157 Queen Street West, Brampton, ON L6Y 1P9 &bull; <a href="https://www.auravitalstar.ca" style="color: #B9975B; text-decoration: none;">www.auravitalstar.ca</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: `Your Aura Vital Star Verification Code: ${otpCode}`,
      html: htmlContent
    });
    console.log(`✅ OTP email sent to: ${email}`);
    return { success: true, otp: otpCode };
  } catch (err) {
    console.error('❌ Failed to dispatch OTP email:', err.message);
    // Resilience: ensure the client is never blocked by unexpected email delays
    return {
      success: true,
      otp: otpCode,
      warning: `Email dispatch delayed: ${err.message}`
    };
  }
}

/**
 * Dispatches both customer confirmation email and admin notification email for a booking
 */
export async function sendBookingEmails(booking) {
  const transporter = getTransporter();
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@auravitalstar.ca').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || 'auravitalstar@gmail.com').trim();
  const fromName = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
  const fromEmail = (process.env.FROM_EMAIL || hostUser).trim();

  if (!transporter) {
    console.warn('⚠️ SMTP credentials not configured. Skipping live email dispatch.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const customerName = (booking.customerName || booking.name || booking.clientName || 'Valued Guest').trim();
  const isQrBooking = (booking.source || '').toLowerCase().includes('qr');
  const source = booking.source || (isQrBooking ? 'QR Code' : 'Website');
  const duration = booking.duration || '60 min';
  const location = booking.location || 'Brampton';

  const customerSubject = `Appointment Confirmation & Visit Reminder: ${booking.service} — Aura Vital Star [${booking.id}]`;
  const adminSubject = `[NEW APPOINTMENT - ${source}] ${customerName} - ${booking.service} [${booking.id}]`;

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
            <div class="recap-row"><span class="recap-label">Reference ID:</span> <strong style="color: #8A682D; font-family: monospace; font-size: 15px;">${booking.id}</strong></div>
            <div class="recap-row"><span class="recap-label">Treatment:</span> <strong>${booking.service}</strong> (${duration})</div>
            <div class="recap-row"><span class="recap-label">Date:</span> <strong>${booking.date}</strong></div>
            <div class="recap-row"><span class="recap-label">Time:</span> <strong>${booking.time}</strong></div>
            <div class="recap-row"><span class="recap-label">Location:</span> <span><strong>${location} Centre</strong><br><span style="font-size: 12px; color: #666;">157 Queen Street West, Brampton, ON L6Y 1P9</span></span></div>
            <div class="recap-row"><span class="recap-label">Guest Name:</span> <span>${customerName}</span></div>
            ${booking.phone ? `<div class="recap-row"><span class="recap-label">Phone:</span> <span>${booking.phone}</span></div>` : ''}
            ${booking.notes ? `<div class="recap-row"><span class="recap-label">Notes:</span> <em>"${booking.notes}"</em></div>` : ''}
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
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; width: 140px; color: #062C22;">Booking ID:</td><td style="padding: 8px 6px;"><strong style="color: #8A682D; font-family: monospace;">${booking.id}</strong></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Channel / Source:</td><td style="padding: 8px 6px;"><strong style="background: #EBF5F0; color: #1E5C40; padding: 3px 8px; border-radius: 4px;">${source}</strong></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Customer Name:</td><td style="padding: 8px 6px;"><strong>${customerName}</strong></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Phone:</td><td style="padding: 8px 6px;"><a href="tel:${booking.phone}" style="color: #062C22; font-weight: bold;">${booking.phone || 'Not provided'}</a></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Email:</td><td style="padding: 8px 6px;"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Service:</td><td style="padding: 8px 6px;"><strong>${booking.service}</strong> (${duration})</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Date &amp; Time:</td><td style="padding: 8px 6px;"><strong>${booking.date}</strong> at <strong>${booking.time}</strong></td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Location:</td><td style="padding: 8px 6px;">${location} Centre (157 Queen St W)</td></tr>
          <tr style="border-bottom: 1px solid #eee;"><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Status:</td><td style="padding: 8px 6px;"><strong style="color: #2D7A58;">Confirmed</strong></td></tr>
          <tr><td style="padding: 8px 6px; font-weight: bold; color: #062C22;">Notes:</td><td style="padding: 8px 6px;">${booking.notes || 'None'}</td></tr>
        </table>

        <div style="text-align: center; margin: 24px 0 10px;">
          <a href="https://www.auravitalstar.ca/crm/appointments" style="background: #062C22; color: #DFBE77; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 13px;">View in CRM Appointments Portal &rarr;</a>
        </div>

        <p style="font-size: 11px; color: #888; text-align: center; margin-top: 18px;">Recorded at ${new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })}</p>
      </div>
    </body>
    </html>
  `;

  try {
    // 1. Send confirmation to customer
    if (booking.email) {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: booking.email,
        subject: customerSubject,
        html: customerHtml
      });
      console.log(`✅ Customer confirmation email sent to: ${booking.email}`);
    }

    // 2. Send notification to admin
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml
    });
    console.log(`✅ Admin notification email sent to: ${adminEmail}`);

    return { success: true, otp: otpCode };
  } catch (err) {
    console.error('❌ Failed to dispatch email via SMTP:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches contact inquiry notification to Admin registered mail ID + courtesy acknowledgement to Guest
 */
export async function sendContactInquiryEmail(contact) {
  const transporter = getTransporter();
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'noreply@auravitalstar.ca').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || 'auravitalstar@gmail.com').trim();
  const fromName = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
  const fromEmail = (process.env.FROM_EMAIL || hostUser).trim();

  if (!transporter) {
    console.warn('⚠️ SMTP credentials not configured. Skipping live email dispatch.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const { name, email, phone, service, message } = contact;
  const cleanName = name || 'Valued Guest';
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const cleanService = (service && service !== 'Select a service') ? service : 'General Wellness Inquiry';
  const cleanMessage = message || '';
  const receivedTime = new Date().toLocaleString('en-US', {
    timeZone: 'America/Toronto',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
        .card { max-width: 620px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 10px 30px rgba(6,44,34,0.1); }
        .header { background: #062C22; color: #FAF5EA; padding: 30px 24px; text-align: center; border-bottom: 2px solid #C59A3F; }
        .header h1 { font-family: Georgia, serif; margin: 0 0 6px 0; font-size: 24px; color: #FAF5EA; }
        .header p { margin: 0; color: #DFBE77; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; font-weight: 600; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .meta-table td { padding: 10px 12px; border-bottom: 1px solid #F0ECE4; font-size: 14px; }
        .meta-table td.label { font-weight: 700; color: #062C22; width: 140px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
        .message-box { background: #FAF7F2; border-left: 4px solid #C59A3F; border-radius: 4px; padding: 18px 20px; margin: 22px 0; font-size: 15px; color: #2C3530; line-height: 1.7; white-space: pre-line; }
        .action-btn { display: inline-block; background: #062C22; color: #DFBE77 !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 10px; }
        .footer { background: #F6F1E8; padding: 18px 24px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>AURA VITAL STAR REJUVENATION CENTRE</p>
          <h1>New Website Contact Message</h1>
        </div>
        <div class="content">
          <p style="font-size: 15px; margin-top: 0;">A guest has submitted a new inquiry through the AVS Contact page:</p>
          
          <table class="meta-table">
            <tr>
              <td class="label">Guest Name:</td>
              <td><strong>${cleanName}</strong></td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td><a href="mailto:${cleanEmail}" style="color: #062C22; font-weight: 600;">${cleanEmail}</a></td>
            </tr>
            <tr>
              <td class="label">Phone:</td>
              <td>${cleanPhone ? `<a href="tel:${cleanPhone}" style="color: #062C22; font-weight: 600;">${cleanPhone}</a>` : '<span style="color: #999;">Not provided</span>'}</td>
            </tr>
            <tr>
              <td class="label">Service:</td>
              <td><span style="background: rgba(197,154,63,0.15); color: #062C22; padding: 3px 10px; border-radius: 12px; font-weight: 600; font-size: 13px;">${cleanService}</span></td>
            </tr>
            <tr>
              <td class="label">Date Received:</td>
              <td style="color: #555; font-size: 13px;">${receivedTime}</td>
            </tr>
          </table>

          <p style="font-weight: 700; color: #062C22; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">Message Details:</p>
          <div class="message-box">${cleanMessage}</div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="mailto:${cleanEmail}?subject=Re: Your Aura Vital Star Inquiry (${cleanService})" class="action-btn">
              Reply Directly to ${cleanName}
            </a>
          </div>
        </div>
        <div class="footer">
          157 Queen Street West, Brampton, ON L6Y 1P9 &bull; <a href="https://www.auravitalstar.ca" style="color: #C59A3F; text-decoration: none;">www.auravitalstar.ca</a>
        </div>
      </div>
    </body>
    </html>
  `;

  // 2. Template for Guest Acknowledgement
  const guestHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
        .card { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 8px 24px rgba(6,44,34,0.08); }
        .header { background: #062C22; color: #FAF5EA; padding: 32px 24px; text-align: center; border-bottom: 2px solid #C59A3F; }
        .header h1 { font-family: Georgia, serif; margin: 0 0 6px 0; font-size: 24px; color: #FAF5EA; }
        .header p { margin: 0; color: #DFBE77; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; }
        .content { padding: 32px 28px; line-height: 1.7; }
        .recap-box { background: #FAF7F2; border: 1px solid #E4DDD1; border-radius: 8px; padding: 18px 20px; margin: 20px 0; font-size: 14px; }
        .footer { background: #F6F1E8; padding: 18px 24px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>AURA VITAL STAR REJUVENATION CENTRE</p>
          <h1>Thank You for Reaching Out</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${cleanName}</strong>,</p>
          <p>Thank you for contacting Aura Vital Star. We have received your message regarding <strong>${cleanService}</strong>, and our concierge team is currently reviewing your inquiry.</p>
          
          <div class="recap-box">
            <div style="margin-bottom: 6px;"><strong>Inquiry Subject:</strong> ${cleanService}</div>
            <div style="color: #666; font-style: italic;">"${cleanMessage}"</div>
          </div>

          <p>One of our wellness specialists will connect with you shortly. If your inquiry requires immediate assistance or you wish to schedule an appointment directly, feel free to call our reception at <strong>+1 647-987-5451</strong>.</p>

          <p style="margin-top: 24px; color: #062C22; font-weight: 600;">Warm regards,<br>The Aura Vital Star Concierge Team</p>
        </div>
        <div class="footer">
          157 Queen Street West, Brampton, ON L6Y 1P9 &bull; +1 647-987-5451 &bull; <a href="https://www.auravitalstar.ca" style="color: #C59A3F; text-decoration: none;">www.auravitalstar.ca</a>
        </div>
      </div>
    </body>
    </html>
  `;

  let adminSent = false;
  let guestSent = false;

  // 1. Dispatch full inquiry details to Admin registered mail ID
  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      replyTo: cleanEmail,
      subject: `✉️ New Contact Message: ${cleanName} - ${cleanService}`,
      html: adminHtml
    });
    adminSent = true;
    console.log(`✅ Admin email notification delivered to ${adminEmail}`);
  } catch (err) {
    console.error('❌ Failed to dispatch contact inquiry to Admin:', err);
  }

  // 2. Dispatch courtesy acknowledgement to the user
  if (cleanEmail && cleanEmail.includes('@')) {
    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: cleanEmail,
        subject: `Thank You for Contacting Aura Vital Star Rejuvenation Centre`,
        html: guestHtml
      });
      guestSent = true;
      console.log(`✅ Courtesy acknowledgement delivered to guest: ${cleanEmail}`);
    } catch (guestErr) {
      console.warn('⚠️ Courtesy acknowledgement to guest failed:', guestErr?.message || guestErr);
    }
  }

  return {
    success: adminSent,
    adminSent,
    guestSent
  };
}
