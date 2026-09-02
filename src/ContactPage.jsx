import { useState, useEffect } from 'react';
import './contact.css';

const SERVICE_OPTIONS = [
  'Select a service',
  'Hair Spa & Head Massage',
  'Facials – All Types of Facials',
  'Foot Spa – Pamper Your Feet',
  'Body Massage & Pain Relief Therapy',
  'Waxing & Laser',
  'Full Arm Waxing',
  'Under Arm Waxing',
  'Bikini Waxing',
  'Pedicure – Pamper Your Feet',
  'Manicure – Pamper Your Hands',
  'Party & Bridal Makeup',
  'Body Polishing',
  'Organic Spa & Facials',
  'Couple Retreats',
  'Full Body Waxing',
  'Other'
];

const FAQ_ITEMS = [
  {
    q: 'What services do you offer?',
    a: 'Aura Vital Star offers a comprehensive suite of luxury treatments including Registered Massage Therapy (RMT), clinical & organic facials, Japanese hair spa & scalp therapy, manicure & pedicure rituals, body polishing, waxing & laser treatments, bridal makeup, and custom medical orthotics.'
  },
  {
    q: 'Where is Aura Vital Star located?',
    a: 'We are conveniently located at 157 Queen Street West, Brampton, ON L6Y 1P9. Dedicated client parking is available directly on site.'
  },
  {
    q: 'How can I book an appointment?',
    a: 'You can book directly on our website through our interactive 24/7 concierge booking system, call our reception at +1 647-987-5451, or email us at info@auravitalstar.ca.'
  },
  {
    q: 'Do I need an appointment before visiting?',
    a: 'We recommend reserving your appointment in advance to ensure your preferred time slot and therapist. However, we also welcome walk-ins based on daily practitioner availability.'
  },
  {
    q: 'Do you offer couple experiences?',
    a: 'Yes, we offer specialized Couple Retreat packages featuring dual treatment suites, customized massage therapy, and relaxing aromatherapy rituals designed for shared tranquility.'
  }
];

export default function ContactPage({ onBookClick, onNavClick }) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Contact Aura Vital Star | Spa & Wellness Centre in Brampton';
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Select a service',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex((prev) => (prev === idx ? -1 : idx));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your full name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide a message or inquiry details.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Attempt backend dispatch
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        // Gracefully persist locally if server is offline or static deploy
        const stored = JSON.parse(localStorage.getItem('avs_contact_inquiries') || '[]');
        stored.push({ ...formData, submittedAt: new Date().toISOString() });
        localStorage.setItem('avs_contact_inquiries', JSON.stringify(stored));
      }
    } catch {
      // Offline fallback
      const stored = JSON.parse(localStorage.getItem('avs_contact_inquiries') || '[]');
      stored.push({ ...formData, submittedAt: new Date().toISOString() });
      localStorage.setItem('avs_contact_inquiries', JSON.stringify(stored));
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'Select a service',
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    const el = document.getElementById('contact-form-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="contact-page-wrapper">
      {/* ========================================================
          1. CONTACT HERO (CINEMATIC WITH FOREST GREEN OVERLAY)
          ======================================================== */}
      <section className="contact-hero" aria-label="Contact Aura Vital Star">
        <div className="contact-hero-bg">
          <img
            src="/about_hero_interior.webp"
            alt="Aura Vital Star Brampton sanctuary reception and lounge"
            className="contact-hero-bg-img"
            width="1600"
            height="900"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="contact-hero-overlay" aria-hidden="true"></div>
        <div className="contact-hero-decor-line" aria-hidden="true"></div>

        <div className="contact-hero-container">
          <span className="contact-hero-eyebrow">
            ✦ AURA VITAL STAR REJUVENATION CENTRE ✦
          </span>
          <h1 className="contact-hero-title">
            Let’s Begin Your Wellness Journey.
            <span className="contact-hero-title-accent">Connect With AVS</span>
          </h1>
          <p className="contact-hero-desc">
            Whether you’re ready to book your first treatment or simply have a question,
            our team is here to help you find the right experience.
          </p>

          <div className="contact-hero-cta-group">
            <button
              type="button"
              className="contact-btn-primary"
              onClick={(e) => onBookClick && onBookClick(e, 'Contact Hero')}
            >
              <span>BOOK YOUR APPOINTMENT</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a
              href="#contact-form-section"
              className="contact-btn-secondary"
              onClick={scrollToForm}
            >
              <span>GET IN TOUCH</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. CONTACT INFORMATION & FORM (2-COLUMN SPLIT)
          ======================================================== */}
      <section id="contact-form-section" className="contact-main-section" aria-labelledby="contact-heading">
        <div className="contact-split-grid">
          {/* Column 1: Contact Info */}
          <div className="contact-info-col">
            <div>
              <span className="contact-section-eyebrow">CONCIERGE &amp; INQUIRIES</span>
              <h2 className="contact-section-heading" id="contact-heading">
                Visit Aura Vital Star
              </h2>
              <p className="contact-info-intro">
                Located in the heart of Brampton, our sanctuary is designed for serenity,
                personalized care, and complete restorative peace.
              </p>
            </div>

            <div className="contact-cards-stack">
              {/* Location */}
              <a
                href="https://maps.google.com/?q=157+Queen+Street+West+Brampton+ON"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-card"
              >
                <div className="contact-card-icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8"/>
                    <circle cx="12" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-tag">LOCATION</span>
                  <p className="contact-card-main-text">157 Queen Street West</p>
                  <p className="contact-card-sub-text">Brampton, ON L6Y 1P9 • Free Parking On Site</p>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:+16479875451" className="contact-info-card">
                <div className="contact-card-icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-tag">PHONE</span>
                  <p className="contact-card-main-text">+1 647-987-5451</p>
                  <p className="contact-card-sub-text">Direct Line • Available 7 Days a Week</p>
                </div>
              </a>

              {/* Email */}
              <a href="mailto:info@auravitalstar.ca" className="contact-info-card">
                <div className="contact-card-icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-tag">EMAIL</span>
                  <p className="contact-card-main-text">info@auravitalstar.ca</p>
                  <p className="contact-card-sub-text">Client Concierge &amp; Treatment Enquiries</p>
                </div>
              </a>

              {/* Website */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavClick) onNavClick(e, 'home');
                }}
                className="contact-info-card"
              >
                <div className="contact-card-icon-wrap" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div className="contact-card-content">
                  <span className="contact-card-tag">WEBSITE</span>
                  <p className="contact-card-main-text">www.auravitalstar.ca</p>
                  <p className="contact-card-sub-text">Official Centre Portal &amp; 24/7 Booking</p>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Interactive Contact Form */}
          <div className="contact-form-card">
            {!isSubmitted ? (
              <>
                <div className="contact-form-header">
                  <h2 className="contact-form-title">Send Us a Message</h2>
                  <p className="contact-form-sub">
                    We’d love to hear from you. Fill out the form and our team will get back to you.
                  </p>
                </div>

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  {/* Full Name */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-name" className="contact-label">
                      <span>FULL NAME</span>
                      <span className="contact-required-mark">*</span>
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className={`contact-input ${errors.name ? 'has-error' : ''}`}
                      autoComplete="name"
                      required
                    />
                    {errors.name && <span className="contact-error-msg">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-email" className="contact-label">
                      <span>EMAIL ADDRESS</span>
                      <span className="contact-required-mark">*</span>
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={`contact-input ${errors.email ? 'has-error' : ''}`}
                      autoComplete="email"
                      required
                    />
                    {errors.email && <span className="contact-error-msg">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-phone" className="contact-label">
                      <span>PHONE NUMBER</span>
                      <span style={{ color: '#8C9991', fontSize: '0.74rem' }}>OPTIONAL</span>
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                      className="contact-input"
                      autoComplete="tel"
                    />
                  </div>

                  {/* Service Interest */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-service" className="contact-label">
                      <span>SERVICE INTEREST</span>
                      <span style={{ color: '#8C9991', fontSize: '0.74rem' }}>OPTIONAL</span>
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="contact-select"
                    >
                      {SERVICE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} disabled={opt === 'Select a service'}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div className="contact-form-group">
                    <label htmlFor="contact-message" className="contact-label">
                      <span>MESSAGE</span>
                      <span className="contact-required-mark">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help you?"
                      className={`contact-textarea ${errors.message ? 'has-error' : ''}`}
                      required
                    />
                    {errors.message && <span className="contact-error-msg">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="contact-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>SENDING MESSAGE...</span>
                    ) : (
                      <>
                        <span>SEND MESSAGE</span>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                          <path d="M2 8h12M10 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="contact-success-panel" role="status" aria-live="polite">
                <div className="contact-success-icon" aria-hidden="true">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="contact-success-title">Thank You.</h3>
                <p className="contact-success-text">
                  Your message has been received. Our AVS concierge team will review your inquiry
                  and be in touch shortly.
                </p>
                <button
                  type="button"
                  className="contact-reset-btn"
                  onClick={handleResetForm}
                >
                  Back to Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. QUICK CONTACT ACTIONS STRIP
          ======================================================== */}
      <section className="contact-quick-actions-section" aria-label="Quick contact actions">
        <div className="contact-quick-inner">
          <p className="contact-quick-eyebrow">DIRECT REACH</p>
          <h2 className="contact-quick-title">Need Assistance?</h2>

          <div className="contact-quick-grid">
            {/* Call */}
            <a href="tel:+16479875451" className="contact-quick-card">
              <div className="contact-quick-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </div>
              <span className="contact-quick-label">CALL AVS</span>
              <span className="contact-quick-value">+1 647-987-5451</span>
            </a>

            {/* Email */}
            <a href="mailto:info@auravitalstar.ca" className="contact-quick-card">
              <div className="contact-quick-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </div>
              <span className="contact-quick-label">EMAIL AVS</span>
              <span className="contact-quick-value">info@auravitalstar.ca</span>
            </a>

            {/* Book Appointment */}
            <button
              type="button"
              className="contact-quick-card"
              onClick={(e) => onBookClick && onBookClick(e, 'Quick Actions')}
            >
              <div className="contact-quick-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8"/>
                </svg>
              </div>
              <span className="contact-quick-label">SCHEDULE TREATMENT</span>
              <span className="contact-quick-value">BOOK APPOINTMENT</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. LOCATION & MAP SECTION
          ======================================================== */}
      <section className="contact-map-section" aria-labelledby="map-heading">
        <div className="contact-map-header">
          <span className="contact-section-eyebrow">OUR SANCTUARY ADDRESS</span>
          <h2 className="contact-section-heading" id="map-heading">Find Us in Brampton</h2>
          <p className="contact-info-intro">
            A serene retreat located on Queen Street West, designed to provide seamless
            accessibility with private client parking.
          </p>
        </div>

        <div className="contact-map-frame-wrap">
          <iframe
            title="Aura Vital Star Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2884.2882772023537!2d-79.7712396!3d43.6837946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b15e45a27e7f7%3A0x6b4be93333333333!2s157%20Queen%20St%20W%2C%20Brampton%2C%20ON%20L6Y%201P9!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
            className="contact-map-iframe"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />

          <div className="contact-map-card-floating">
            <span className="contact-map-floating-tag">PRIMARY SANCTUARY</span>
            <h3 className="contact-map-floating-title">Aura Vital Star</h3>
            <p className="contact-map-floating-addr">
              157 Queen Street West<br />
              Brampton, ON L6Y 1P9
            </p>
            <a
              href="https://maps.google.com/?q=157+Queen+Street+West+Brampton+ON"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-directions-btn"
            >
              <span>GET DIRECTIONS</span>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ARRIVAL EXPERIENCE (3 STAGES)
          ======================================================== */}
      <section className="contact-arrival-section" aria-labelledby="arrival-heading">
        <div className="contact-arrival-inner">
          <div className="contact-arrival-header">
            <span className="contact-section-eyebrow" style={{ color: '#E0C076' }}>
              THE AVS EXPERIENCE
            </span>
            <h2 className="contact-arrival-title" id="arrival-heading">
              Your Visit Starts Here.
            </h2>
            <p className="contact-arrival-sub">
              Step into a calm and welcoming environment where beauty, wellness and
              relaxation come together.
            </p>
          </div>

          <div className="contact-arrival-grid">
            {/* 01 ARRIVE */}
            <div className="contact-arrival-card">
              <span className="contact-arrival-step-num">01</span>
              <h3 className="contact-arrival-step-title">ARRIVE</h3>
              <p className="contact-arrival-step-desc">
                Find your way to our Brampton wellness space. Enjoy complimentary client parking and our tranquil reception lounge.
              </p>
            </div>

            {/* 02 UNWIND */}
            <div className="contact-arrival-card">
              <span className="contact-arrival-step-num">02</span>
              <h3 className="contact-arrival-step-title">UNWIND</h3>
              <p className="contact-arrival-step-desc">
                Settle in and leave the outside world behind. Savor warm herbal infusions while your practitioner prepares your custom suite.
              </p>
            </div>

            {/* 03 REJUVENATE */}
            <div className="contact-arrival-card">
              <span className="contact-arrival-step-num">03</span>
              <h3 className="contact-arrival-step-title">REJUVENATE</h3>
              <p className="contact-arrival-step-desc">
                Enjoy an experience designed around you, delivered with clinical mastery, luxurious botanicals, and personalized care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. GRAND OPENING & LIMITED-TIME 30% OFFER
          ======================================================== */}
      <section className="contact-opening-section" aria-labelledby="opening-heading">
        <div className="contact-opening-inner">
          <div>
            <span className="contact-opening-date-badge">
              ✦ GRAND OPENING CELEBRATION • 16TH OF SEPTEMBER 2026 ✦
            </span>
            <h2 className="contact-opening-title" id="opening-heading">
              Your New Wellness Ritual Awaits.
            </h2>
            <p className="contact-opening-desc">
              Join us for the Grand Opening of Aura Vital Star Rejuvenation Centre.
              A new beginning of wellness, beauty &amp; you.
            </p>
            <button
              type="button"
              className="contact-btn-primary"
              onClick={(e) => onBookClick && onBookClick(e, 'Grand Opening')}
            >
              <span>BOOK YOUR APPOINTMENT</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* 30% Offer Card */}
          <div className="contact-offer-card">
            <span className="contact-offer-pill">SPECIAL INAUGURAL PRIVILEGE</span>
            <div className="contact-offer-headline">30% OFF</div>
            <p className="contact-offer-subtitle">ON ALL SERVICES</p>
            <p className="contact-offer-fineprint">
              Valid for first-time clients during the Grand Opening Period.
              Reserve your ritual in advance to lock in your preferred schedule.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. INTERACTIVE FAQ MINI SECTION
          ======================================================== */}
      <section className="contact-faq-section" aria-labelledby="faq-heading">
        <div className="contact-faq-header">
          <span className="contact-section-eyebrow">COMMON INQUIRIES</span>
          <h2 className="contact-faq-title" id="faq-heading">Have Questions?</h2>
          <p className="contact-faq-sub">
            Helpful answers to guide your first visit to Aura Vital Star.
          </p>
        </div>

        <div className="contact-faq-accordion">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={item.q}
                className={`contact-faq-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="contact-faq-trigger"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="contact-faq-q-text">{item.q}</span>
                  <span className="contact-faq-icon" aria-hidden="true">
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="contact-faq-content">
                    <p className="contact-faq-answer">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
