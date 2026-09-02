import React, { useEffect, useRef, useState } from 'react';
import './rmt.css';

const rmtServices = [
  {
    id: 'therapeutic',
    title: 'Therapeutic Massage',
    desc: 'Targeted techniques to address tension, discomfort and areas of concern. Each session is adapted to your specific needs for meaningful, lasting relief.',
    image: '/rmt_therapeutic.jpg',
    duration: '60 – 90 min',
  },
  {
    id: 'relaxation',
    title: 'Relaxation Massage',
    desc: 'A full-body, flowing treatment designed to calm the nervous system, ease muscle tension and restore your sense of balance and ease.',
    image: '/rmt_relaxation.jpg',
    duration: '60 – 90 min',
  },
  {
    id: 'deep-tissue',
    title: 'Deep Tissue Massage',
    desc: 'Focused pressure applied to deeper layers of muscle and connective tissue, helping to release chronic patterns of tension and improve mobility.',
    image: '/rmt_deep_tissue.jpg',
    duration: '60 – 90 min',
  },
  {
    id: 'prenatal',
    title: 'Prenatal Massage',
    desc: 'Specially adapted care for mothers-to-be. Gentle, supportive techniques designed to promote comfort, reduce strain and support your changing body.',
    image: '/rmt_prenatal.jpg',
    duration: '60 min',
  },
  {
    id: 'sports',
    title: 'Sports & Recovery Massage',
    desc: 'Designed for active individuals, this treatment supports muscle recovery, reduces post-activity soreness and helps maintain performance and flexibility.',
    image: '/rmt_sports.jpg',
    duration: '60 – 90 min',
  },
  {
    id: 'customized',
    title: 'Customized Massage Therapy',
    desc: 'Not sure which treatment is right for you? We build a personalized session around your goals, preferences and areas of focus — your comfort guides everything.',
    image: '/rmt_customized.jpg',
    duration: 'Flexible',
  },
];

const whyPillars = [
  {
    icon: 'person',
    title: 'Personalized Approach',
    desc: 'Every session begins with a conversation. We listen to your goals and tailor each treatment entirely around you.',
  },
  {
    icon: 'star',
    title: 'Professional Environment',
    desc: 'Our treatment rooms are thoughtfully designed for comfort, privacy and calm — so you can truly unwind.',
  },
  {
    icon: 'heart',
    title: 'Client-Focused Care',
    desc: 'Your wellbeing is our priority at every step, from the moment you arrive to the moment you leave.',
  },
  {
    icon: 'leaf',
    title: 'Comfortable Experience',
    desc: 'We take every measure to ensure you feel at ease, supported and respected throughout your entire visit.',
  },
  {
    icon: 'shield',
    title: 'Wellness-Focused',
    desc: 'We believe in massage therapy as part of a holistic wellness journey — not just a one-time treat.',
  },
];

function RMTIcon({ name }) {
  switch (name) {
    case 'person':
      return (
        <svg viewBox="0 0 56 56" fill="none" width="26" height="26">
          <circle cx="28" cy="20" r="7" stroke="#C59A3F" strokeWidth="1.6" />
          <path d="M14 44c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#C59A3F" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 56 56" fill="none" width="26" height="26">
          <polygon points="28,14 31.5,22 40,22 33.5,27.5 36,36 28,31 20,36 22.5,27.5 16,22 24.5,22" stroke="#C59A3F" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg viewBox="0 0 56 56" fill="none" width="26" height="26">
          <path d="M28 40C28 40 14 32 14 22C14 17 17.5 14 22 14C24.5 14 27 15.5 28 17.5C29 15.5 31.5 14 34 14C38.5 14 42 17 42 22C42 32 28 40 28 40Z" stroke="#C59A3F" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        </svg>
      );
    case 'leaf':
      return (
        <svg viewBox="0 0 56 56" fill="none" width="26" height="26">
          <path d="M28 42C28 42 14 34 14 22C14 14 20 10 28 12C36 10 42 14 42 22C42 34 28 42 28 42Z" stroke="#C59A3F" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M28 12V42" stroke="#C59A3F" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 56 56" fill="none" width="26" height="26">
          <path d="M28 12C28 12 16 18 16 28C16 36 21 40 28 42C35 40 40 36 40 28C40 18 28 12 28 12Z" stroke="#C59A3F" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M22 28l4 4 8-8" stroke="#C59A3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default function RMTPage({ onBookClick, onBackToHome, onNavClick }) {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Registered Massage Therapy (RMT) | Aura Vital Star';
  }, []);

  useEffect(() => {
    const observers = [];
    Object.entries(sectionRefs.current).forEach(([key, el]) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, key]));
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const setRef = (key) => (el) => {
    sectionRefs.current[key] = el;
  };

  const handleBook = (e, source = 'RMT Page') => {
    if (e) e.preventDefault();
    if (onBookClick) onBookClick(e, source);
  };

  const handleNavToServices = (e) => {
    if (e) e.preventDefault();
    if (onNavClick) onNavClick(e, '#services');
  };

  return (
    <div className="rmt-page">

      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="rmt-hero" aria-labelledby="rmt-hero-heading" id="rmt-hero">
        <div className="rmt-hero-img-wrap">
          <img
            src="/rmt_hero_massage.jpg"
            alt="Professional RMT therapist providing massage treatment at Aura Vital Star wellness centre"
            className="rmt-hero-img"
          />
          <div className="rmt-hero-overlay" />
        </div>

        <div className="rmt-hero-content">
          <div
            className={`rmt-hero-inner ${visibleSections.has('hero') ? 'rmt-visible' : ''}`}
            ref={setRef('hero')}
          >
            <div className="rmt-eyebrow-pill">
              <span className="rmt-eyebrow-dot" />
              <span>AURA VITAL STAR — REGISTERED MASSAGE THERAPY</span>
            </div>

            <h1 className="rmt-hero-heading" id="rmt-hero-heading">
              Registered<br />
              <span className="rmt-hero-serif">Massage Therapy</span>
            </h1>

            <div className="rmt-hero-divider" aria-hidden="true">
              <svg viewBox="0 0 80 14" fill="none" width="80" height="14">
                <line x1="0" y1="7" x2="28" y2="7" stroke="#C59A3F" strokeWidth="1" />
                <circle cx="40" cy="7" r="4" stroke="#C59A3F" strokeWidth="1.2" />
                <line x1="52" y1="7" x2="80" y2="7" stroke="#C59A3F" strokeWidth="1" />
              </svg>
            </div>

            <p className="rmt-hero-sub">
              Personalized care to help you relax, restore and feel your best.
            </p>

            <div className="rmt-hero-ctas">
              <button
                type="button"
                className="rmt-btn-primary"
                onClick={(e) => handleBook(e, 'RMT Hero — Book Appointment')}
                id="rmt-hero-book-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span>Book an Appointment</span>
              </button>
              <a
                href="tel:+16479875451"
                className="rmt-btn-secondary"
                id="rmt-hero-contact-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Contact Us</span>
              </a>
            </div>

            <div className="rmt-hero-badges">
              <div className="rmt-hero-badge">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.4C17.25 22.15 21 17.25 21 12V6L12 2z" stroke="#C59A3F" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="#C59A3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>RMP Certified</span>
              </div>
              <div className="rmt-hero-badge">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <circle cx="12" cy="8" r="4" stroke="#C59A3F" strokeWidth="1.5" />
                  <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#C59A3F" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>Expert Therapists</span>
              </div>
              <div className="rmt-hero-badge">
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                  <path d="M12 22c0 0-8-4.5-8-11V5l8-3 8 3v6c0 6.5-8 11-8 11z" stroke="#C59A3F" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <span>Safe &amp; Hygienic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          INTRODUCTION
      ====================================================== */}
      <section
        className={`rmt-intro ${visibleSections.has('intro') ? 'rmt-visible' : ''}`}
        ref={setRef('intro')}
        aria-labelledby="rmt-intro-heading"
      >
        <div className="rmt-intro-inner">
          <div className="rmt-intro-text">
            <p className="rmt-section-eyebrow">At Aura Vital Star</p>
            <h2 className="rmt-section-heading" id="rmt-intro-heading">
              Personalized Massage Therapy<br />
              <span className="rmt-heading-accent">at Aura Vital Star</span>
            </h2>
            <div className="rmt-heading-line" aria-hidden="true" />
            <p className="rmt-intro-body">
              At Aura Vital Star, our registered massage therapy services are built around one principle: <em>you</em>. No two sessions are the same. Our therapists take the time to understand your needs, preferences and wellness goals before every treatment.
            </p>
            <p className="rmt-intro-body">
              Whether you're looking to unwind after a long week, address areas of chronic discomfort, or simply invest in your ongoing wellbeing, our team is here to provide thoughtful, professional care in a warm and welcoming environment.
            </p>
            <p className="rmt-intro-body">
              We believe massage therapy is a meaningful part of a balanced, healthy lifestyle — and we're honoured to support you on that journey.
            </p>
          </div>

          <div className="rmt-intro-stats">
            <div className="rmt-stat-card">
              <span className="rmt-stat-num">6+</span>
              <span className="rmt-stat-label">Specialized Treatments</span>
            </div>
            <div className="rmt-stat-card">
              <span className="rmt-stat-num">100%</span>
              <span className="rmt-stat-label">Registered Professionals</span>
            </div>
            <div className="rmt-stat-card">
              <span className="rmt-stat-num">2</span>
              <span className="rmt-stat-label">Locations Serving You</span>
            </div>
            <div className="rmt-stat-card">
              <span className="rmt-stat-num">★ 5.0</span>
              <span className="rmt-stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          RMT SERVICES
      ====================================================== */}
      <section
        className={`rmt-services ${visibleSections.has('services') ? 'rmt-visible' : ''}`}
        ref={setRef('services')}
        aria-labelledby="rmt-services-heading"
        id="rmt-services-grid"
      >
        <div className="rmt-services-inner">
          <div className="rmt-services-header">
            <p className="rmt-section-eyebrow">What We Offer</p>
            <h2 className="rmt-section-heading" id="rmt-services-heading">RMT Services</h2>
            <div className="rmt-heading-line" aria-hidden="true" />
            <p className="rmt-services-sub">
              From targeted therapeutic care to full-body relaxation, our range of massage therapy services is designed to meet you where you are.
            </p>
          </div>

          <div className="rmt-services-grid">
            {rmtServices.map((service, i) => (
              <div
                className="rmt-svc-card"
                key={service.id}
                id={`rmt-service-${service.id}`}
                style={{ '--card-delay': `${i * 0.08}s` }}
              >
                <div className="rmt-svc-img-wrap">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rmt-svc-img"
                  />
                  <div className="rmt-svc-img-overlay" />
                  <div className="rmt-svc-duration-badge">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    {service.duration}
                  </div>
                </div>
                <div className="rmt-svc-body">
                  <h3 className="rmt-svc-title">{service.title}</h3>
                  <p className="rmt-svc-desc">{service.desc}</p>
                  <button
                    type="button"
                    className="rmt-svc-book-btn"
                    onClick={(e) => handleBook(e, `RMT Service — ${service.title}`)}
                    id={`rmt-book-${service.id}`}
                  >
                    <span>Book This Service</span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          WHY CHOOSE AVS
      ====================================================== */}
      <section
        className={`rmt-why ${visibleSections.has('why') ? 'rmt-visible' : ''}`}
        ref={setRef('why')}
        aria-labelledby="rmt-why-heading"
      >
        <div className="rmt-why-inner">
          <div className="rmt-why-image-col">
            <div className="rmt-why-img-frame">
              <img
                src="/rmt_why_avs.jpg"
                alt="Tranquil massage therapy room at Aura Vital Star"
                className="rmt-why-img"
              />
              <div className="rmt-why-img-accent" aria-hidden="true" />
              <div className="rmt-why-emblem" aria-hidden="true">
                <svg viewBox="0 0 60 60" fill="none" width="52" height="52">
                  <circle cx="30" cy="30" r="28" stroke="#C59A3F" strokeWidth="1.2" />
                  <path d="M30 16 C30 16 22 22 22 29 C22 33 25 36 30 37 C35 36 38 33 38 29 C38 22 30 16 30 16Z" fill="#C59A3F" opacity="0.85" />
                  <path d="M22 22 C18 20 15 22 14 26 C15 30 18 32 22 32" stroke="#C59A3F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  <path d="M38 22 C42 20 45 22 46 26 C45 30 42 32 38 32" stroke="#C59A3F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rmt-why-content-col">
            <p className="rmt-section-eyebrow">The AVS Difference</p>
            <h2 className="rmt-section-heading" id="rmt-why-heading">
              Why Choose AVS<br />
              <span className="rmt-heading-accent">for RMT?</span>
            </h2>
            <div className="rmt-heading-line" aria-hidden="true" />

            <div className="rmt-why-pillars">
              {whyPillars.map((pillar) => (
                <div className="rmt-why-pillar" key={pillar.title}>
                  <div className="rmt-why-icon">
                    <RMTIcon name={pillar.icon} />
                  </div>
                  <div className="rmt-why-pillar-text">
                    <h3 className="rmt-why-pillar-title">{pillar.title}</h3>
                    <p className="rmt-why-pillar-desc">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="rmt-btn-primary rmt-why-cta"
              onClick={(e) => handleBook(e, 'RMT Why AVS CTA')}
              id="rmt-why-book-btn"
            >
              <span>Book Your Session</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          HOW IT WORKS
      ====================================================== */}
      <section
        className={`rmt-how ${visibleSections.has('how') ? 'rmt-visible' : ''}`}
        ref={setRef('how')}
        aria-labelledby="rmt-how-heading"
      >
        <div className="rmt-how-inner">
          <div className="rmt-how-header">
            <p className="rmt-section-eyebrow">Your Journey</p>
            <h2 className="rmt-section-heading" id="rmt-how-heading">How It Works</h2>
            <div className="rmt-heading-line" aria-hidden="true" />
          </div>

          <div className="rmt-steps">
            <div className="rmt-step" id="rmt-step-1">
              <div className="rmt-step-num-wrap">
                <span className="rmt-step-num">01</span>
                <div className="rmt-step-connector" aria-hidden="true" />
              </div>
              <div className="rmt-step-content">
                <div className="rmt-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
                    <circle cx="20" cy="14" r="6" stroke="#C59A3F" strokeWidth="1.4" />
                    <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#C59A3F" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M30 18l2 2 4-4" stroke="#C59A3F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="rmt-step-title">Consultation</h3>
                <p className="rmt-step-desc">We take time to understand your needs, health history and preferences before your session begins. Your comfort and goals shape everything.</p>
              </div>
            </div>

            <div className="rmt-step" id="rmt-step-2">
              <div className="rmt-step-num-wrap">
                <span className="rmt-step-num">02</span>
                <div className="rmt-step-connector" aria-hidden="true" />
              </div>
              <div className="rmt-step-content">
                <div className="rmt-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
                    <path d="M20 6C14 6 10 11 10 16c0 4 2 7 5 9l1 5h8l1-5c3-2 5-5 5-9 0-5-4-10-10-10z" stroke="#C59A3F" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
                    <path d="M16 22c1.5 2 6.5 2 8 0" stroke="#C59A3F" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="rmt-step-title">Personalized Session</h3>
                <p className="rmt-step-desc">Experience a treatment built entirely around you — your therapist adapts techniques, pressure and focus areas in real time to ensure the best possible result.</p>
              </div>
            </div>

            <div className="rmt-step" id="rmt-step-3">
              <div className="rmt-step-num-wrap">
                <span className="rmt-step-num">03</span>
              </div>
              <div className="rmt-step-content">
                <div className="rmt-step-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" fill="none" width="32" height="32">
                    <circle cx="20" cy="18" r="8" stroke="#C59A3F" strokeWidth="1.4" />
                    <path d="M20 10V18l5 3" stroke="#C59A3F" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M8 32c3-3 7-4 12-4s9 1 12 4" stroke="#C59A3F" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="rmt-step-title">Relax &amp; Rebalance</h3>
                <p className="rmt-step-desc">Take time to unwind after your session. We'll provide aftercare recommendations and check in to ensure you leave feeling restored and refreshed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          BOOKING CTA
      ====================================================== */}
      <section
        className={`rmt-cta ${visibleSections.has('cta') ? 'rmt-visible' : ''}`}
        ref={setRef('cta')}
        aria-labelledby="rmt-cta-heading"
      >
        <div className="rmt-cta-bg" aria-hidden="true">
          <div className="rmt-cta-watermark">RMT</div>
          <svg className="rmt-cta-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z" fill="rgba(197, 154, 63, 0.04)" />
          </svg>
        </div>

        <div className="rmt-cta-inner">
          <div className="rmt-cta-text">
            <p className="rmt-section-eyebrow rmt-section-eyebrow--dark">Your Wellness, Your Priority</p>
            <h2 className="rmt-cta-heading" id="rmt-cta-heading">
              Make Time for<br />
              <span className="rmt-cta-serif">Your Wellness</span>
            </h2>
            <div className="rmt-cta-divider" aria-hidden="true">
              <svg viewBox="0 0 80 14" fill="none" width="80" height="14">
                <line x1="0" y1="7" x2="28" y2="7" stroke="#C59A3F" strokeWidth="1" />
                <circle cx="40" cy="7" r="4" stroke="#C59A3F" strokeWidth="1.2" />
                <line x1="52" y1="7" x2="80" y2="7" stroke="#C59A3F" strokeWidth="1" />
              </svg>
            </div>
            <p className="rmt-cta-sub">
              Book your RMT appointment at Aura Vital Star. Our registered therapists are ready to support your wellbeing journey.
            </p>
          </div>

          <div className="rmt-cta-actions">
            <button
              type="button"
              className="rmt-btn-primary rmt-btn-lg"
              onClick={(e) => handleBook(e, 'RMT Booking CTA')}
              id="rmt-cta-book-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>Book an Appointment</span>
            </button>
            <button
              type="button"
              className="rmt-btn-outline"
              onClick={handleNavToServices}
              id="rmt-cta-explore-btn"
            >
              <span>Explore AVS Services</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="rmt-cta-contact-line">
            <span>or call us at</span>
            <a href="tel:+16479875451" className="rmt-cta-phone" aria-label="Call +1 647-987-5451">+1 647-987-5451</a>
          </div>
        </div>
      </section>
    </div>
  );
}
