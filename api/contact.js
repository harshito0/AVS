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
      service: 'Aura Vital Star Contact Email API',
      configuredGmail: GMAIL_USER
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, service, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = (phone || '').trim();
    const cleanService = (service && service !== 'Select a service') ? service : 'General Wellness Inquiry';
    const cleanMessage = message.trim();
    const receivedTime = new Date().toLocaleString('en-US', {
      timeZone: 'America/Toronto',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const transporter = getTransporter();

    // 1. Email to Admin (Your Gmail: auravitalstar@gmail.com)
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

    // 2. Courtesy Confirmation to the Guest
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
            <p>Thank you for contacting Aura Vital Star. We have received your message regarding <strong>${cleanService}</strong>, and our concierge team is reviewing your inquiry.</p>
            
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

    // Send email to ADMIN (registered mail id)
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: cleanEmail,
      subject: `✉️ New Contact Message: ${cleanName} - ${cleanService}`,
      html: adminHtml
    });
    console.log(`✅ Admin email notification delivered to ${ADMIN_EMAIL}`);

    // Send courtesy confirmation to Guest
    try {
      await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: cleanEmail,
        subject: `Thank You for Contacting Aura Vital Star Rejuvenation Centre`,
        html: guestHtml
      });
      console.log(`✅ Guest confirmation delivered to ${cleanEmail}`);
    } catch (guestErr) {
      console.warn('Non-blocking guest auto-reply notice:', guestErr?.message || guestErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully to Aura Vital Star.'
    });
  } catch (error) {
    console.error('❌ Error in /api/contact handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email'
    });
  }
}
