import nodemailer from 'nodemailer';

const SMTP_HOST = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' || SMTP_PORT === 465;
const SMTP_USER = (process.env.SMTP_USER || process.env.GMAIL_USER || 'auravitalstar@gmail.com').trim();
const SMTP_PASS = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || 'cqknfoboepgqhlyw').replace(/\s+/g, '');
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
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
      service: 'Aura Vital Star OTP Dispatcher API',
      gmailUser: GMAIL_USER
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, name } = req.body || {};

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      error: 'A valid email address is required to send an OTP.'
    });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const recipientName = name || 'Valued Guest';
  const cleanEmail = email.toLowerCase().trim();

  // Store in global cache for verify-otp
  if (!global.__avs_otp_cache) {
    global.__avs_otp_cache = new Map();
  }
  global.__avs_otp_cache.set(cleanEmail, {
    otp: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F7F3EC; margin: 0; padding: 24px; color: #1E2421; }
        .card { max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E0D9CB; overflow: hidden; box-shadow: 0 8px 24px rgba(6,44,34,0.08); }
        .header { background: #062C22; color: #FAF5EA; padding: 28px 24px; text-align: center; border-bottom: 2px solid #B9975B; }
        .header h1 { font-family: Georgia, serif; margin: 0 0 4px 0; font-size: 24px; color: #FAF5EA; }
        .header p { margin: 0; color: #DFBE77; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; }
        .content { padding: 28px; line-height: 1.6; text-align: center; }
        .otp-badge { background: #062C22; color: #DFBE77; border: 1px solid #B9975B; padding: 18px 32px; border-radius: 10px; font-size: 32px; font-weight: 800; letter-spacing: 0.3em; display: inline-block; margin: 22px 0; }
        .footer { background: #F6F1E8; padding: 16px 24px; font-size: 12px; color: #68706B; text-align: center; border-top: 1px solid #E8DCBE; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <p>AURA VITAL STAR</p>
          <h1>Verification OTP</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${recipientName}</strong>,</p>
          <p>Here is your 6-digit One-Time Password (OTP) to complete your email registration:</p>
          
          <div class="otp-badge">${otpCode}</div>

          <p style="font-size: 13px; color: #68706B;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          
          <p style="margin-top: 24px; color: #062C22; font-weight: 600; text-align: left;">Warm regards,<br>The Aura Vital Star Team</p>
        </div>
        <div class="footer">
          157 Queen Street West, Brampton, ON L6Y 1P9 &bull; <a href="https://www.auravitalstar.ca" style="color: #B9975B; text-decoration: none;">www.auravitalstar.ca</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: `Your Aura Vital Star Verification OTP: ${otpCode}`,
      html: htmlContent
    });

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      email,
      otp: otpCode
    });
  } catch (err) {
    console.error('Failed to send OTP via Nodemailer:', err);
    return res.status(500).json({
      success: false,
      error: `Failed to send OTP: ${err.message}`
    });
  }
}
