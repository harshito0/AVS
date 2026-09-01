import React, { useState, useEffect } from 'react';
import { SERVICES } from './BookingPage';
import './salon.css';

export default function SalonPage({ onBookClick, onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Aura Vital Star Salon | Beauty & Salon Services';
  }, []);

  // Filter salon services
  const salonServices = SERVICES.filter(
    (s) => s.category.toUpperCase() === 'SALON' || s.category.toUpperCase().includes('HAIR') || s.category.toUpperCase().includes('NAIL') || s.category.toUpperCase().includes('BEAUTY')
  );

  const categories = ['ALL', 'HAIR CARE', 'BEAUTY & SKIN', 'NAIL CARE', 'WAXING & LASER'];

  const filteredServices = selectedCategory === 'ALL'
    ? salonServices
    : salonServices.filter((s) => {
        if (selectedCategory === 'HAIR CARE') return s.title.toLowerCase().includes('hair') || s.title.toLowerCase().includes('cut') || s.title.toLowerCase().includes('color') || s.title.toLowerCase().includes('blowout');
        if (selectedCategory === 'BEAUTY & SKIN') return s.title.toLowerCase().includes('facial') || s.title.toLowerCase().includes('skin') || s.title.toLowerCase().includes('beauty');
        if (selectedCategory === 'NAIL CARE') return s.title.toLowerCase().includes('manicure') || s.title.toLowerCase().includes('pedicure') || s.title.toLowerCase().includes('nail');
        if (selectedCategory === 'WAXING & LASER') return s.title.toLowerCase().includes('wax') || s.title.toLowerCase().includes('thread') || s.title.toLowerCase().includes('laser');
        return true;
      });

  const handleBookService = (serviceTitle) => {
    if (onBookClick) {
      onBookClick(null, `Salon Page - ${serviceTitle}`);
    }
  };

  return (
    <div className="avs-salon-page-wrapper">
      {/* ====================================================================
          SECTION 01 — SALON HERO
          ==================================================================== */}
      <section className="avs-salon-hero-section" aria-labelledby="salon-hero-title">
        {/* Full-width Panel Background Video (z-index: 1) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero_salon_editorial.jpg"
          className="avs-salon-hero-full-bg-video"
        >
          <source src="/scene_-_hair_wash_experience.mp4" type="video/mp4" />
          <source src="/salon_hero_video.mp4" type="video/mp4" />
          <source src="/salon_video.mp4" type="video/mp4" />
        </video>
        <div className="avs-salon-hero-full-video-overlay"></div>

        <div className="avs-salon-hero-bg-decor" aria-hidden="true">
          <div className="avs-salon-hero-emerald-glow"></div>
          <svg className="avs-salon-botanical-svg" viewBox="0 0 400 400" fill="none">
            <path d="M50 350 C120 250 250 180 350 50" stroke="rgba(185, 151, 91, 0.18)" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M150 250 C200 180 280 200 250 280" stroke="rgba(185, 151, 91, 0.12)" strokeWidth="1" />
          </svg>
        </div>

        <div className="avs-salon-hero-container">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="avs-salon-hero-content">
            <div className="avs-salon-eyebrow-pill">
              <span className="avs-eyebrow-dot"></span>
              <span>AURA VITAL STAR SALON</span>
            </div>

            <h1 className="avs-salon-hero-title" id="salon-hero-title">
              Beauty,<br />
              <span className="avs-hero-serif-italic">Refined.</span><br />
              <span className="avs-hero-gold-line">Made for You.</span>
            </h1>

            <p className="avs-salon-hero-desc">
              Discover a thoughtfully curated salon experience designed around your style, confidence and individuality.
            </p>

            <div className="avs-salon-hero-actions">
              <button
                type="button"
                className="avs-btn-salon-primary"
                onClick={() => {
                  const target = document.getElementById('salon-services');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>EXPLORE SALON SERVICES</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <button
                type="button"
                className="avs-btn-salon-secondary"
                onClick={(e) => onBookClick && onBookClick(e, 'Salon Hero CTA')}
              >
                <span>BOOK AN APPOINTMENT</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>

            <div className="avs-salon-hero-tag-row">
              <span>HAIR</span> &bull; <span>BEAUTY</span> &bull; <span>SELF-CARE</span>
            </div>
          </div>

          {/* Right Column: Asymmetric Luxury Campaign Frame */}
          <div className="avs-salon-hero-visual">
            <div className="avs-salon-vertical-text" aria-hidden="true">
              AURA VITAL STAR &bull; SALON EXPERIENCE
            </div>

            <div className="avs-salon-hero-img-card">
              <img
                src="/hero_salon_editorial.jpg"
                alt="Aura Vital Star Luxury Salon Interior"
                className="avs-salon-hero-img"
              />
              <div className="avs-salon-hero-img-badge">
                <span className="avs-hero-badge-title">HAIR &bull; SKIN &bull; NAILS</span>
                <span className="avs-hero-badge-sub">Brampton Rejuvenation Sanctuary</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 02 — THE SALON EXPERIENCE
          ==================================================================== */}
      <section className="avs-salon-experience-section">
        <div className="avs-salon-container">
          <div className="avs-salon-split-layout">
            {/* Left Portrait Editorial Image */}
            <div className="avs-salon-story-img-wrap">
              <img
                src="/salon_hair_styling.jpg"
                alt="Stylist creating personalized salon hair care at Aura Vital Star"
                className="avs-salon-story-img"
              />
              <div className="avs-salon-img-gold-border"></div>
            </div>

            {/* Right Story Copy */}
            <div className="avs-salon-story-content">
              <span className="avs-salon-section-eyebrow">THE SALON EXPERIENCE</span>
              <h2 className="avs-salon-section-heading">
                More than a style.<br />
                <em className="serif-accent">It's your moment.</em>
              </h2>

              <p className="avs-salon-story-paragraph">
                From everyday essentials to a complete beauty refresh, every salon experience at Aura Vital Star is designed to help you look your best and leave feeling renewed.
              </p>

              <div className="avs-salon-pillars-grid">
                <div className="avs-salon-pillar-item">
                  <span className="avs-pillar-num">01</span>
                  <h4 className="avs-pillar-title">PERSONALIZED</h4>
                  <p className="avs-pillar-desc">Your style, your way with tailored consultations.</p>
                </div>

                <div className="avs-salon-pillar-item">
                  <span className="avs-pillar-num">02</span>
                  <h4 className="avs-pillar-title">PREMIUM</h4>
                  <p className="avs-pillar-desc">Thoughtfully selected non-toxic beauty products.</p>
                </div>

                <div className="avs-salon-pillar-item">
                  <span className="avs-pillar-num">03</span>
                  <h4 className="avs-pillar-title">PROFESSIONAL</h4>
                  <p className="avs-pillar-desc">Experienced beauty specialists dedicated to your care.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 03 — SALON SERVICES
          ==================================================================== */}
      <section id="salon-services" className="avs-salon-services-section">
        <div className="avs-salon-container">
          <div className="avs-salon-section-header-center">
            <span className="avs-salon-section-eyebrow">OUR SALON SERVICES</span>
            <h2 className="avs-salon-section-heading">
              Your beauty,<br />
              <em className="serif-accent">beautifully considered.</em>
            </h2>
            <p className="avs-salon-section-subtext">
              Select from our curated menu of hair styling, aesthetic skin treatments, spa manicures, and precision body care.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="avs-salon-cat-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`avs-salon-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Magazine Style Grid */}
          <div className="avs-salon-magazine-grid">
            {filteredServices.map((svc) => (
              <article className="avs-salon-service-card" key={svc.id}>
                <div className="avs-salon-card-img-frame">
                  <img src={svc.image || '/hero_salon_editorial.jpg'} alt={svc.title} className="avs-salon-card-img" />
                  <span className="avs-salon-card-cat-badge">{svc.category}</span>
                </div>
                <div className="avs-salon-card-body">
                  <div className="avs-salon-card-top">
                    <h3 className="avs-salon-card-title">{svc.title}</h3>
                    <span className="avs-salon-card-price">{svc.price}</span>
                  </div>
                  <p className="avs-salon-card-desc">{svc.desc}</p>
                  <div className="avs-salon-card-footer">
                    <span className="avs-salon-dur">⏱ {svc.duration}</span>
                    <button
                      type="button"
                      className="avs-salon-card-book-btn"
                      onClick={() => handleBookService(svc.title)}
                    >
                      <span>BOOK THIS SERVICE</span> &rarr;
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 04 — FEATURED SALON EXPERIENCE
          ==================================================================== */}
      <section className="avs-salon-featured-section">
        <div className="avs-salon-featured-bg" style={{ backgroundImage: "url('/salon_bg.jpg')" }}></div>
        <div className="avs-salon-featured-overlay"></div>
        <div className="avs-salon-featured-content">
          <span className="avs-featured-eyebrow">THE AVS DIFFERENCE</span>
          <h2 className="avs-featured-headline">
            Your style.<br />
            <em className="serif-accent">Our expertise.</em>
          </h2>
          <p className="avs-featured-copy">
            A personalized approach, thoughtful attention to detail and an environment designed around your comfort.
          </p>
          <button
            type="button"
            className="avs-btn-salon-gold-action"
            onClick={(e) => onBookClick && onBookClick(e, 'Salon Featured Section')}
          >
            <span>DISCOVER THE EXPERIENCE</span> &rarr;
          </button>
        </div>
      </section>

      {/* ====================================================================
          SECTION 05 — HAIR / BEAUTY EDITORIAL
          ==================================================================== */}
      <section className="avs-salon-editorial-grid-section">
        <div className="avs-salon-container">
          <div className="avs-salon-section-header-center">
            <span className="avs-salon-section-eyebrow">THE SALON GALLERY</span>
            <h2 className="avs-salon-section-heading">Curated Beauty Moments</h2>
          </div>

          <div className="avs-salon-editorial-trio">
            {/* Visual 1: THE LOOK */}
            <div className="avs-editorial-card">
              <div className="avs-editorial-img-wrap">
                <img src="/salon_hair_styling.jpg" alt="The Look - Luxury Hair Styling" />
                <div className="avs-editorial-badge">01 &bull; THE LOOK</div>
              </div>
              <div className="avs-editorial-caption">
                <h4>Premium Hair Styling</h4>
                <p>Precision cuts, balayage, and signature blowout styling for every occasion.</p>
              </div>
            </div>

            {/* Visual 2: THE GLOW */}
            <div className="avs-editorial-card">
              <div className="avs-editorial-img-wrap">
                <img src="/salon_facial_glow.jpg" alt="The Glow - Skin & Aesthetics" />
                <div className="avs-editorial-badge">02 &bull; THE GLOW</div>
              </div>
              <div className="avs-editorial-caption">
                <h4>Skin &amp; Aesthetics</h4>
                <p>Deep cleansing hydra-facials and botanical treatments for a luminous complexion.</p>
              </div>
            </div>

            {/* Visual 3: THE DETAIL */}
            <div className="avs-editorial-card">
              <div className="avs-editorial-img-wrap">
                <img src="/salon_nails_beauty.jpg" alt="The Detail - Nails & Finishing" />
                <div className="avs-editorial-badge">03 &bull; THE DETAIL</div>
              </div>
              <div className="avs-editorial-caption">
                <h4>Nails &amp; Finishing</h4>
                <p>High-shine gel manicures, luxury spa pedicures, and precision finishing touches.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 06 — OUR SALON PROFESSIONALS
          ==================================================================== */}
      <section className="avs-salon-team-section">
        <div className="avs-salon-container">
          <div className="avs-salon-section-header-center">
            <span className="avs-salon-section-eyebrow">OUR BEAUTY PROFESSIONALS</span>
            <h2 className="avs-salon-section-heading">
              Expertise behind<br />
              <em className="serif-accent">every detail.</em>
            </h2>
          </div>

          <div className="avs-salon-team-grid">
            <div className="avs-team-card">
              <div className="avs-team-img-frame">
                <img src="/hero_facial.jpg" alt="Elena Rostova - Master Stylist" />
              </div>
              <div className="avs-team-info">
                <h4 className="avs-team-name">Elena Rostova</h4>
                <span className="avs-team-role">Master Hair Stylist &amp; Colorist</span>
                <p className="avs-team-spec">Specializing in balayage, precision cuts, and hair rejuvenation.</p>
              </div>
            </div>

            <div className="avs-team-card">
              <div className="avs-team-img-frame">
                <img src="/hero_wellness.jpg" alt="Sophia Chen - Senior Aesthetician" />
              </div>
              <div className="avs-team-info">
                <h4 className="avs-team-name">Sophia Chen</h4>
                <span className="avs-team-role">Senior Skin Specialist</span>
                <p className="avs-team-spec">Expert in botanical skin therapy, hydra-facials, and anti-aging treatments.</p>
              </div>
            </div>

            <div className="avs-team-card">
              <div className="avs-team-img-frame">
                <img src="/hero_relaxation.jpg" alt="Amara Patel - Nail Artist" />
              </div>
              <div className="avs-team-info">
                <h4 className="avs-team-name">Amara Patel</h4>
                <span className="avs-team-role">Lead Nail Artist &amp; Aesthetician</span>
                <p className="avs-team-spec">Mastery in gel nail artistry, spa manicures, and precision waxing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 07 — THE SALON SPACE
          ==================================================================== */}
      <section className="avs-salon-space-section">
        <div className="avs-salon-container">
          <div className="avs-salon-section-header-center">
            <span className="avs-salon-section-eyebrow">THE AVS SALON</span>
            <h2 className="avs-salon-section-heading">Designed for your beautiful escape.</h2>
          </div>

          <div className="avs-salon-collage-grid">
            <div className="avs-collage-main">
              <img src="/hero_salon_editorial.jpg" alt="Aura Vital Star Styling Studio Space" />
            </div>
            <div className="avs-collage-sub top">
              <img src="/salon_hair_styling.jpg" alt="Salon styling chair" />
            </div>
            <div className="avs-collage-sub bottom">
              <img src="/salon_nails_beauty.jpg" alt="Nail manicure space" />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              type="button"
              className="avs-btn-salon-outline"
              onClick={(e) => onBookClick && onBookClick(e, 'Salon Space Gallery')}
            >
              <span>TAKE A LOOK &bull; BOOK A VISIT</span> &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 08 — SALON PROMISE
          ==================================================================== */}
      <section className="avs-salon-promise-statement-section">
        <div className="avs-salon-container">
          <blockquote className="avs-salon-serif-quote">
            "You deserve to feel beautiful in your own way."
          </blockquote>
          <p className="avs-salon-promise-subtext">
            At Aura Vital Star, beauty is personal. Every detail is considered around you.
          </p>
          <div className="avs-salon-lotus-accent" aria-hidden="true">
            <svg viewBox="0 0 80 14" fill="none" width="80" height="14">
              <line x1="0" y1="7" x2="30" y2="7" stroke="#B9975B" strokeWidth="1"/>
              <circle cx="40" cy="7" r="4" stroke="#B9975B" strokeWidth="1.2"/>
              <line x1="50" y1="7" x2="80" y2="7" stroke="#B9975B" strokeWidth="1"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 09 — SALON CTA
          ==================================================================== */}
      <section className="avs-salon-final-cta-section">
        <div className="avs-salon-cta-bg" style={{ backgroundImage: "url('/hero_salon_editorial.jpg')" }}></div>
        <div className="avs-salon-cta-overlay"></div>
        <div className="avs-salon-cta-content">
          <span className="avs-salon-cta-eyebrow">YOUR NEXT LOOK STARTS HERE</span>
          <h2 className="avs-salon-cta-title">
            Ready for your<br />
            <em className="serif-gold">Aura Vital Star experience?</em>
          </h2>
          <p className="avs-salon-cta-sub">
            Book your salon appointment and make time for yourself in our Brampton sanctuary.
          </p>
          <div className="avs-salon-cta-buttons">
            <button
              type="button"
              className="avs-btn-salon-primary"
              onClick={(e) => onBookClick && onBookClick(e, 'Salon Final CTA')}
            >
              <span>BOOK APPOINTMENT</span> &rarr;
            </button>
            <button
              type="button"
              className="avs-btn-salon-secondary"
              onClick={() => {
                const target = document.getElementById('salon-services');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>EXPLORE SERVICES</span> &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
