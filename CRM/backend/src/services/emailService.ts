import nodemailer from 'nodemailer';
import env from '../config/env';

function getTransporter() {
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn('[Email] SMTP credentials not configured');
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 25000,
    greetingTimeout: 25000,
    socketTimeout: 25000,
  });
}

interface BookingEmailData {
  id: string;
  customerName: string;
  phone?: string;
  email?: string;
  service: string;
  location: string;
  date: string;
  time: string;
  duration?: string;
  notes?: string;
  status?: string;
}

export async function sendBookingConfirmationEmail(booking: BookingEmailData) {
  const transporter = getTransporter();
  if (!transporter) return { success: false, reason: 'SMTP not configured' };

  const customerHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
  .card { max-width: 580px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 8px 24px rgba(6,44,34,0.08); }
  .header { background: #062C22; padding: 32px 28px; text-align: center; border-bottom: 2px solid #C9A227; }
  .header h1 { font-family: Georgia, serif; color: #FAF5EA; margin: 0 0 6px; font-size: 22px; }
  .header p { color: #DFBE77; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; margin: 0; }
  .content { padding: 32px 28px; line-height: 1.7; }
  .recap { background: #FAF7F2; border: 1px solid #E2D9CB; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .recap-row { margin: 8px 0; font-size: 15px; }
  .recap-label { font-weight: 700; color: #062C22; display: inline-block; min-width: 100px; }
  .status-badge { display: inline-block; background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .footer { background: #F6F1E8; padding: 18px 28px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <p>AURA VITAL STAR REJUVENATION CENTRE</p>
    <h1>Appointment Request Received</h1>
  </div>
  <div class="content">
    <p>Dear <strong>${booking.customerName}</strong>,</p>
    <p>Thank you for choosing Aura Vital Star. Your appointment request has been received successfully.</p>
    <div class="recap">
      <div class="recap-row"><span class="recap-label">Reference:</span> <strong>${booking.id}</strong></div>
      <div class="recap-row"><span class="recap-label">Service:</span> ${booking.service}${booking.duration ? ` (${booking.duration})` : ''}</div>
      <div class="recap-row"><span class="recap-label">Location:</span> ${booking.location}</div>
      <div class="recap-row"><span class="recap-label">Date:</span> ${booking.date}</div>
      <div class="recap-row"><span class="recap-label">Time:</span> ${booking.time}</div>
      <div class="recap-row"><span class="recap-label">Status:</span> <span class="status-badge">Pending Confirmation</span></div>
      ${booking.notes ? `<div class="recap-row"><span class="recap-label">Notes:</span> <em>"${booking.notes}"</em></div>` : ''}
    </div>
    <p>Our team will confirm your appointment shortly. For immediate assistance, please call <strong>+1 647-987-5451</strong>.</p>
    <p>We look forward to welcoming you.</p>
    <p style="color:#062C22; font-weight:600; margin-top:24px;">Warm regards,<br>The Aura Vital Star Team</p>
  </div>
  <div class="footer">157 Queen Street West, Brampton, ON L6Y 1P9 &bull; <a href="https://www.auravitalstar.ca" style="color:#C9A227;">auravitalstar.ca</a></div>
</div>
</body>
</html>`;

  const adminHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
<div style="max-width:600px; margin:0 auto; background:#fff; padding:30px; border-radius:8px; border-left:5px solid #062C22;">
  <h2 style="color:#062C22; margin-top:0;">✨ New Appointment Booking</h2>
  <table style="width:100%; border-collapse:collapse; margin-top:16px;">
    <tr><td style="padding:8px; font-weight:bold; width:140px;">Reference:</td><td style="padding:8px;">${booking.id}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold;">Customer:</td><td style="padding:8px;">${booking.customerName}</td></tr>
    <tr><td style="padding:8px; font-weight:bold;">Phone:</td><td style="padding:8px;">${booking.phone || 'N/A'}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;">${booking.email || 'N/A'}</td></tr>
    <tr><td style="padding:8px; font-weight:bold;">Service:</td><td style="padding:8px;">${booking.service}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold;">Date & Time:</td><td style="padding:8px;">${booking.date} at ${booking.time}</td></tr>
    <tr><td style="padding:8px; font-weight:bold;">Location:</td><td style="padding:8px;">${booking.location}</td></tr>
    <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold;">Notes:</td><td style="padding:8px;">${booking.notes || 'None'}</td></tr>
  </table>
  <p style="margin-top:20px; font-size:12px; color:#888;">Aura Vital Star Booking System — ${new Date().toLocaleString()}</p>
</div>
</body>
</html>`;

  try {
    if (booking.email) {
      await transporter.sendMail({
        from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
        to: booking.email,
        subject: `Appointment Request Received — ${booking.service} [${booking.id}]`,
        html: customerHtml,
      });
      console.log(`[Email] Confirmation sent to ${booking.email}`);
    }

    await transporter.sendMail({
      from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
      to: env.ADMIN_EMAIL,
      subject: `[NEW BOOKING] ${booking.customerName} — ${booking.service} on ${booking.date}`,
      html: adminHtml,
    });
    console.log(`[Email] Admin notification sent to ${env.ADMIN_EMAIL}`);

    return { success: true };
  } catch (err: any) {
    console.error('[Email] Send error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendStatusUpdateEmail(booking: BookingEmailData) {
  const transporter = getTransporter();
  if (!transporter || !booking.email) return { success: false };

  const statusMessages: Record<string, string> = {
    Confirmed: 'Your appointment has been <strong>confirmed</strong>! We look forward to seeing you.',
    Cancelled: 'Your appointment has been <strong>cancelled</strong>. Please contact us to reschedule.',
    Completed: 'Thank you for visiting Aura Vital Star. We hope to see you again soon!',
  };

  const message = statusMessages[booking.status || ''] || `Your appointment status is now: ${booking.status}`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #F7F3EC; padding: 24px; }
  .card { max-width:560px; margin:0 auto; background:#fff; border-radius:12px; border:1px solid #E0D9CB; overflow:hidden; }
  .header { background:#062C22; padding:28px; text-align:center; border-bottom:2px solid #C9A227; }
  .header h1 { color:#FAF5EA; font-size:20px; margin:0; }
  .header p { color:#DFBE77; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; margin:4px 0 0; }
  .content { padding:28px; line-height:1.7; }
  .footer { background:#F6F1E8; padding:16px 28px; font-size:12px; color:#68706B; text-align:center; border-top:1px solid #E8DCBE; }
</style></head>
<body>
<div class="card">
  <div class="header"><p>AURA VITAL STAR</p><h1>Appointment Update</h1></div>
  <div class="content">
    <p>Dear <strong>${booking.customerName}</strong>,</p>
    <p>${message}</p>
    <p><strong>Service:</strong> ${booking.service}<br><strong>Date:</strong> ${booking.date} at ${booking.time}<br><strong>Location:</strong> ${booking.location}</p>
    <p>Questions? Call us at <strong>+1 647-987-5451</strong>.</p>
    <p style="color:#062C22; font-weight:600; margin-top:20px;">Warm regards,<br>The Aura Vital Star Team</p>
  </div>
  <div class="footer">157 Queen Street West, Brampton, ON L6Y 1P9</div>
</div>
</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"${env.FROM_NAME}" <${env.FROM_EMAIL}>`,
      to: booking.email,
      subject: `Your AVS Appointment — ${booking.status}`,
      html,
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
