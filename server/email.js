import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * Creates and verifies Gmail SMTP transporter with robust timeout options
 */
function getTransporter() {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'cqknfoboepgqhlyw').replace(/\s+/g, '');

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
    connectionTimeout: 25000,
    greetingTimeout: 25000,
    socketTimeout: 25000
  });
}

/**
 * Dispatches an OTP verification code email to a user
 */
export async function sendOtpEmail(email, name = 'Valued Guest', otp) {
  const transporter = getTransporter();
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
  const fromName = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
  const fromEmail = (process.env.FROM_EMAIL || hostUser).trim();

  if (!transporter) {
    return {
      success: false,
      reason: 'Credentials not configured. Please add SMTP or GMAIL credentials to server/.env'
    };
  }

  const otpCode = otp || Math.floor(100000 + Math.random() * 900000).toString();

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
    console.error('❌ Failed to dispatch OTP email:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Dispatches both customer confirmation email and admin notification email for a booking
 */
export async function sendBookingEmails(booking) {
  const transporter = getTransporter();
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || hostUser).trim();
  const fromName = (process.env.FROM_NAME || 'Aura Vital Star Concierge').trim();
  const fromEmail = (process.env.FROM_EMAIL || hostUser).trim();

  if (!transporter) {
    console.warn('⚠️ SMTP credentials not configured. Skipping live email dispatch.');
    return { success: false, reason: 'Credentials not configured' };
  }

  const otpCode = booking.otp || Math.floor(100000 + Math.random() * 900000).toString();

  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
        .card { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 8px 24px rgba(6,44,34,0.08); }
        .header { background: #062C22; color: #FAF5EA; padding: 32px 24px; text-align: center; border-bottom: 2px solid #B9975B; }
        .header h1 { font-family: Georgia, serif; margin: 0 0 6px 0; font-size: 26px; color: #FAF5EA; }
        .header p { margin: 0; color: #DFBE77; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; }
        .content { padding: 32px 28px; line-height: 1.6; }
        .otp-badge { background: #062C22; color: #DFBE77; border: 1px solid #B9975B; padding: 16px 28px; border-radius: 8px; font-size: 28px; font-weight: 700; letter-spacing: 0.25em; text-align: center; margin: 20px 0; display: block; }
        .recap-box { background: #FAF7F2; border: 1px solid #E2D9CB; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .recap-row { margin: 8px 0; font-size: 15px; }
        .recap-label { font-weight: 600; color: #062C22; display: inline-block; width: 110px; }
        .footer { background: #F6F1E8; padding: 20px 28px; font-size: 13px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>AURA VITAL STAR</p>
          <h1>Registration &amp; Appointment Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${booking.customerName}</strong>,</p>
          <p>Thank you for choosing Aura Vital Star. Your email registration verification code is below:</p>
          
          <div class="otp-badge">${otpCode}</div>

          <div class="recap-box">
            <div class="recap-row"><span class="recap-label">Reference:</span> <strong>${booking.id}</strong></div>
            <div class="recap-row"><span class="recap-label">Service:</span> ${booking.service} (${booking.duration || '60 min'})</div>
            <div class="recap-row"><span class="recap-label">Location:</span> ${booking.location}</div>
            <div class="recap-row"><span class="recap-label">Date:</span> ${booking.date}</div>
            <div class="recap-row"><span class="recap-label">Time:</span> ${booking.time}</div>
            ${booking.notes ? `<div class="recap-row"><span class="recap-label">Notes:</span> <em>"${booking.notes}"</em></div>` : ''}
          </div>

          <p>Our dedicated team is preparing your sanctuary prior to your arrival. If you have any questions or need to adjust your time, please call us at <strong>+1 647-987-5451</strong>.</p>
          <p>We look forward to welcoming you.</p>
          <p style="margin-top: 24px; color: #062C22; font-weight: 600;">Warm regards,<br>The Aura Vital Star Team</p>
        </div>
        <div class="footer">
          157 Queen Street West, Brampton, ON L6Y 1P9 &bull; <a href="https://www.auravitalstar.ca" style="color: #B9975B; text-decoration: none;">www.auravitalstar.ca</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 8px; border-left: 5px solid #062C22;">
        <h2 style="color: #062C22; margin-top: 0;">✨ New Appointment Booking Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 140px;">Booking Ref:</td><td style="padding: 8px;">${booking.id}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Customer:</td><td style="padding: 8px;">${booking.customerName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${booking.email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Phone:</td><td style="padding: 8px;">${booking.phone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Service:</td><td style="padding: 8px;">${booking.service}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Date & Time:</td><td style="padding: 8px;">${booking.date} at ${booking.time}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Location:</td><td style="padding: 8px;">${booking.location}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Staff Pref:</td><td style="padding: 8px;">${booking.staff || 'Any available specialist'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${booking.notes || 'None'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">OTP Code:</td><td style="padding: 8px; font-weight: bold; color: #062C22;">${otpCode}</td></tr>
        </table>
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
          Aura Vital Star Booking Management System
        </div>
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
        subject: `Your Aura Vital Star Verification OTP: ${otpCode} [${booking.id}]`,
        html: customerHtml
      });
      console.log(`✅ Customer confirmation email sent to: ${booking.email}`);
    }

    // 2. Send notification to admin
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: `NEW APPOINTMENT: ${booking.customerName} - ${booking.service} [${booking.id}]`,
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
  const hostUser = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
  const adminEmail = (process.env.ADMIN_EMAIL || hostUser).trim();
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
