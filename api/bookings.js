import nodemailer from 'nodemailer';

const SMTP_HOST = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
const SMTP_PASS = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'cqknfoboepgqhlyw').replace(/\s+/g, '');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || SMTP_USER).trim();
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
    connectionTimeout: 25000,
    greetingTimeout: 25000,
    socketTimeout: 25000
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
      configuredGmail: GMAIL_USER
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
    const customerName = booking.customerName || booking.name || 'Valued Guest';

    // Generate 6-Digit Verification OTP for Email Registration/Booking
    const otpCode = booking.otp || Math.floor(100000 + Math.random() * 900000).toString();

    const fullBooking = {
      ...booking,
      id: bookingId,
      customerName,
      otp: otpCode,
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

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
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>Thank you for choosing Aura Vital Star. Your email registration verification code is below:</p>
            
            <div class="otp-badge">${otpCode}</div>

            <p style="font-size: 13px; color: #666; text-align: center;">Use this OTP code to verify your email registration. If you did not request this code, please ignore this email.</p>
            
            <div class="recap-box">
              ${(fullBooking.serviceImage || fullBooking.image) ? `<div style="margin-bottom: 14px; border-radius: 8px; overflow: hidden; border: 1px solid #B9975B;"><img src="https://www.auravitalstar.ca${fullBooking.serviceImage || fullBooking.image}" alt="${fullBooking.service}" style="width: 100%; height: 160px; object-fit: cover; display: block;" /></div>` : ''}
              <div class="recap-row"><span class="recap-label">Reference:</span> <strong>${fullBooking.id}</strong></div>
              <div class="recap-row"><span class="recap-label">Service:</span> <strong>${fullBooking.service || 'Signature Treatment'}</strong> (${fullBooking.duration || '60 min'})</div>
              <div class="recap-row"><span class="recap-label">Location:</span> ${fullBooking.location || 'Brampton Rejuvenation Centre (157 Queen St W)'}</div>
              <div class="recap-row"><span class="recap-label">Date &amp; Time:</span> ${fullBooking.date} at ${fullBooking.time}</div>
              ${fullBooking.notes ? `<div class="recap-row"><span class="recap-label">Notes:</span> <em>"${fullBooking.notes}"</em></div>` : ''}
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
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 24px;">
          <h2 style="color: #062C22; margin-top: 0;">✨ New Registration &amp; Appointment Received — Aura Vital Star</h2>
          <p>A new appointment has been registered through the live website / QR portal:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 6px; font-weight: bold; width: 140px;">Booking ID:</td><td>${fullBooking.id}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">OTP Code:</td><td><strong>${otpCode}</strong></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Customer Name:</td><td>${customerName}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Phone:</td><td><a href="tel:${fullBooking.phone}">${fullBooking.phone}</a></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Email:</td><td><a href="mailto:${fullBooking.email}">${fullBooking.email}</a></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Service:</td><td>${fullBooking.service}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Location:</td><td>${fullBooking.location}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Date &amp; Time:</td><td>${fullBooking.date} at ${fullBooking.time}</td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Channel / Source:</td><td><strong>${fullBooking.source || 'Website'}</strong></td></tr>
            <tr><td style="padding: 6px; font-weight: bold;">Notes:</td><td>${fullBooking.notes || 'None'}</td></tr>
          </table>
          <p style="font-size: 12px; color: #888;">Recorded at ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    let emailSent = false;
    let emailError = null;

    // 1. Send confirmation + OTP to customer (if email provided)
    if (fullBooking.email) {
      try {
        await transporter.sendMail({
          from: `"Aura Vital Star Rejuvenation" <${GMAIL_USER}>`,
          to: fullBooking.email,
          subject: `Your Aura Vital Star Verification OTP: ${otpCode} [${fullBooking.id}]`,
          html: customerHtml
        });
        emailSent = true;
      } catch (err) {
        console.error('Customer email delivery error:', err);
        emailError = err.message;
      }
    }

    // 2. Send alert to Admin
    try {
      await transporter.sendMail({
        from: `"AVS Booking Engine" <${GMAIL_USER}>`,
        to: ADMIN_EMAIL,
        subject: `NEW APPOINTMENT: ${customerName} - ${fullBooking.service} [${fullBooking.id}]`,
        html: adminHtml
      });
    } catch (adminErr) {
      console.warn('Admin notification email warning:', adminErr.message);
    }

    return res.status(200).json({
      success: true,
      booking: fullBooking,
      otp: otpCode,
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

