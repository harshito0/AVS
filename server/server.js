import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllBookings, insertBooking, updateStatus } from './db.js';
import { sendBookingEmails, sendOtpEmail, sendContactInquiryEmail } from './email.js';
import { recordWebsiteBooking, loadCrmStore } from '../api/crmStore.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health & diagnostics endpoint
app.get('/api/health', (req, res) => {
  const hasGmail = Boolean(
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD &&
    process.env.GMAIL_APP_PASSWORD !== 'your_16_char_app_password'
  );
  res.json({
    status: 'ok',
    service: 'Aura Vital Star Booking & Database API',
    database: 'active',
    gmailConfigured: hasGmail,
    configuredGmailUser: hasGmail ? process.env.GMAIL_USER : 'Not configured yet'
  });
});

// In-memory store for active OTP verification codes
const otpStore = new Map();

// POST /api/send-otp — Dispatch OTP to email
app.post('/api/send-otp', async (req, res) => {
  const { email, name } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address is required' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store with 10-minute expiry
  otpStore.set(cleanEmail, {
    otp: generatedOtp,
    expiresAt: Date.now() + 10 * 60 * 1000,
    name: name || 'Valued Guest'
  });

  console.log(`🔐 Generated OTP for ${cleanEmail}: ${generatedOtp}`);

  const result = await sendOtpEmail(cleanEmail, name, generatedOtp);
  if (result.success) {
    return res.json({ 
      success: true, 
      message: `Verification code sent to ${cleanEmail}`,
      otp: result.otp
    });
  } else {
    console.error(`❌ SMTP dispatch failed for ${cleanEmail}:`, result.error || result.reason);
    return res.status(500).json({ 
      success: false, 
      error: `Failed to dispatch OTP email: ${result.error || result.reason || 'Check SMTP configuration'}`
    });
  }
});

// POST /api/verify-otp — Validate submitted OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = otp.toString().trim();
  const record = otpStore.get(cleanEmail);

  if (!record) {
    return res.status(400).json({ 
      success: false, 
      error: 'No active OTP found for this email. Please click "Resend Code".' 
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanEmail);
    return res.status(400).json({ 
      success: false, 
      error: 'The OTP code has expired (valid for 10 minutes). Please click "Resend Code".' 
    });
  }

  if (record.otp !== cleanOtp) {
    return res.status(400).json({ 
      success: false, 
      error: 'Incorrect verification code. Please check your email inbox/spam and try again.' 
    });
  }

  // Verification successful!
  otpStore.delete(cleanEmail);
  console.log(`✅ Email verified successfully for: ${cleanEmail}`);
  return res.json({ success: true, message: 'Email verified successfully!' });
});

// GET all stored bookings
app.get('/api/bookings', (req, res) => {
  try {
    const bookings = getAllBookings();
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, error: 'Database read failure' });
  }
});

// POST a new booking appointment
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    if (!bookingData.customerName && !bookingData.name) {
      return res.status(400).json({ success: false, error: 'Customer name is required' });
    }

    // 1. Store permanently in database
    const savedRecord = insertBooking(bookingData);
    console.log(`📝 Stored booking ${savedRecord.id} for ${savedRecord.customerName} in database.`);

    // 2. Synchronously record to CRM store (clients & appointments)
    let crmResult = null;
    try {
      crmResult = await recordWebsiteBooking(savedRecord);
    } catch (crmErr) {
      console.error('Error saving to CRM store:', crmErr.message);
    }

    // 3. Dispatch real confirmation email + OTP via SMTP
    let emailResult = { success: false, reason: 'Pending' };
    try {
      emailResult = await sendBookingEmails({
        ...savedRecord,
        source: bookingData.source || savedRecord.source || 'Website'
      });
    } catch (emailErr) {
      console.error('Non-blocking email error:', emailErr);
      emailResult = { success: false, error: emailErr.message };
    }

    res.status(201).json({
      success: true,
      booking: savedRecord,
      crmAppointment: crmResult?.appointment,
      crmClient: crmResult?.client,
      bookingId: savedRecord.id,
      emailResult
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, error: 'Failed to process booking' });
  }
});

// POST /api/appointments — Public website & QR booking endpoint
app.post('/api/appointments', async (req, res) => {
  try {
    const bookingData = req.body || {};
    const customerName = (bookingData.customerName || bookingData.name || bookingData.clientName || 'Valued Guest').trim();
    const cleanData = {
      ...bookingData,
      customerName,
      source: bookingData.source || 'QR Code'
    };

    // 1. Store in bookings database
    const savedRecord = insertBooking(cleanData);

    // 2. Record in CRM store (creates Client & Appointment)
    let crmResult = null;
    try {
      crmResult = await recordWebsiteBooking(savedRecord);
    } catch (crmErr) {
      console.error('Error saving to CRM store:', crmErr.message);
    }

    // 3. Dispatch confirmation to Client & notification to Admin
    let emailResult = { success: false };
    try {
      emailResult = await sendBookingEmails({
        ...savedRecord,
        source: cleanData.source
      });
    } catch (emailErr) {
      console.error('Non-blocking email error:', emailErr);
    }

    res.status(201).json({
      success: true,
      data: crmResult?.appointment || savedRecord,
      client: crmResult?.client,
      booking: savedRecord,
      bookingId: savedRecord.id,
      emailResult
    });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ success: false, error: 'Failed to process appointment' });
  }
});

// GET /api/appointments — Fetch appointments from CRM store
app.get('/api/appointments', async (req, res) => {
  try {
    const store = await loadCrmStore();
    res.json({ success: true, data: store.appointments || [] });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

// GET /api/clients — Fetch clients from CRM store
app.get('/api/clients', async (req, res) => {
  try {
    const store = await loadCrmStore();
    res.json({ success: true, data: store.clients || [] });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch clients' });
  }
});

// PATCH update booking status
app.patch('/api/bookings/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }
    const updated = updateStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.json({ success: true, booking: updated });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ success: false, error: 'Failed to update booking status' });
  }
});

// POST /api/contact — Handle contact inquiries
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }

    const contactsFile = path.join(__dirname, 'data', 'contacts.json');
    let contacts = [];
    try {
      const fs = await import('fs');
      if (fs.existsSync(contactsFile)) {
        contacts = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
      }
      const newContact = {
        id: `contact_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        service: service || 'General Inquiry',
        message: message.trim(),
        createdAt: new Date().toISOString()
      };
      contacts.push(newContact);
      fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
      console.log(`✉️ Received and stored contact inquiry from: ${name} (${email})`);

      // Dispatch real email notification to Admin Gmail (auravitalstar@gmail.com)
      let emailResult = { success: false };
      try {
        emailResult = await sendContactInquiryEmail(newContact);
      } catch (eErr) {
        console.error('Email dispatch error:', eErr);
      }

      res.status(201).json({ success: true, contact: newContact, emailResult });
    } catch (fsErr) {
      console.error('Error writing to contacts.json:', fsErr);
      res.status(200).json({ success: true, note: 'Message acknowledged' });
    }
  } catch (err) {
    console.error('Error processing contact inquiry:', err);
    res.status(500).json({ success: false, error: 'Failed to process inquiry' });
  }
});

// Reviews File Path
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

// GET /api/reviews — Fetch all client reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const fs = await import('fs');
    if (fs.existsSync(reviewsFile)) {
      const data = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
      return res.json({ success: true, reviews: data });
    }
    return res.json({ success: true, reviews: [] });
  } catch (err) {
    console.error('Error reading reviews:', err);
    res.status(500).json({ success: false, error: 'Failed to read reviews' });
  }
});

// POST /api/reviews — Client submit a review
app.post('/api/reviews', async (req, res) => {
  try {
    const { name, quote, rating, service } = req.body || {};
    if (!name || !name.trim() || !quote || !quote.trim()) {
      return res.status(400).json({ success: false, error: 'Name and review message are required.' });
    }

    const fs = await import('fs');
    let reviews = [];
    if (fs.existsSync(reviewsFile)) {
      try {
        reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
      } catch (pErr) {
        reviews = [];
      }
    }

    const nameParts = name.trim().split(/\s+/);
    const avatar = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : name.trim().slice(0, 2).toUpperCase();

    const newReview = {
      id: `rev-${Date.now()}`,
      author: name.trim(),
      quote: quote.trim(),
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
      service: service ? service.trim() : 'Holistic Wellness Care',
      avatar,
      date: 'Recent',
      createdAt: new Date().toISOString()
    };

    reviews.unshift(newReview);
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8');
    console.log(`⭐ New review submitted by ${name.trim()} (${newReview.rating} stars)`);

    res.status(201).json({ success: true, review: newReview, reviews });
  } catch (err) {
    console.error('Error posting review:', err);
    res.status(500).json({ success: false, error: 'Failed to save review' });
  }
});

app.listen(PORT, () => {
  console.log(`✨ AVS Booking Server & Database running on http://localhost:${PORT}`);
  console.log(`📧 Gmail notifications: ${process.env.GMAIL_USER || 'Add credentials to server/.env'}`);
});

