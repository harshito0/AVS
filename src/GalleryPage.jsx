import React, { useState, useEffect, useCallback } from 'react';
import './gallery.css';

const CATEGORIES = [
  'ALL',
  'SPA & WELLNESS',
  'HAIR CARE',
  'FACIALS & SKIN',
  'MASSAGE',
  'MANICURE & PEDICURE',
  'WAXING & LASER',
  'MAKEUP',
  'COUPLE EXPERIENCES',
  'AVS SPACE'
];

const GALLERY_ITEMS = [
  // 1. SPA & WELLNESS (Feature)
  {
    id: 'spa-1',
    category: 'SPA & WELLNESS',
    title: 'Basalt Hot Stone Ritual',
    subtitle: 'Warm minerals & restorative botanicals',
    desc: 'Heated volcanic basalt stones combined with organic essential oils melt deep muscular tension, restoring vital energy and serene inner balance.',
    image: '/gallery_hot_stones.webp',
    alt: 'Luxury hot stone ritual with basalt stones, natural orchids, and aromatic candles',
    spanClass: 'span-feature'
  },
  // 2. FACIALS & SKIN (Portrait)
  {
    id: 'facial-1',
    category: 'FACIALS & SKIN',
    title: 'Glow & Rejuvenate',
    subtitle: 'Cellular hydration & brightening',
    desc: 'Personalized facial experiences designed to deeply nourish, refresh, and restore your natural, luminous radiant complexion.',
    image: '/hero_facial.webp',
    alt: 'Rejuvenating facial skincare treatment at Aura Vital Star',
    spanClass: 'span-portrait'
  },
  // 3. AVS SPACE (Landscape)
  {
    id: 'space-1',
    category: 'AVS SPACE',
    title: 'The Grand AVS Sanctuary',
    subtitle: 'Architectural wellness lounge',
    desc: 'Step into our tranquil sanctuary featuring curved emerald velvet, fluted natural oak, and warm ambient glow designed for ultimate peace.',
    image: '/gallery_lounge_interior.webp',
    alt: 'Luxury boutique spa reception and lounge interior with curved green velvet seating',
    spanClass: 'span-landscape'
  },
  // 4. MASSAGE (Landscape)
  {
    id: 'massage-1',
    category: 'MASSAGE',
    title: 'Therapeutic Massage Therapy',
    subtitle: 'RMT certified muscle release',
    desc: 'Targeted deep tissue and relaxation strokes by certified Registered Massage Professionals designed to alleviate tension and improve mobility.',
    image: '/hero_massage.webp',
    alt: 'Professional massage therapy session in tranquil treatment suite',
    spanClass: 'span-landscape'
  },
  // 5. HAIR CARE (Square)
  {
    id: 'hair-1',
    category: 'HAIR CARE',
    title: 'Scalp Detox & Hair Spa',
    subtitle: 'Botanical infusion & head massage',
    desc: 'An invigorating scalp massage and deeply restorative hair treatment using nourishing botanical extracts for silky, healthy shine.',
    image: '/svc_hair_head.webp',
    alt: 'Nourishing scalp massage and Japanese style hair spa ritual',
    spanClass: 'span-small'
  },
  // 6. COUPLE EXPERIENCES (Wide)
  {
    id: 'couple-1',
    category: 'COUPLE EXPERIENCES',
    title: 'Harmony Couples Retreat',
    subtitle: 'Shared peace & dual relaxation',
    desc: 'Immerse together in a private candlelit suite with dual treatment beds, hot aromatic towel compresses, and personalized massage therapy.',
    image: '/svc_couple_retreat.webp',
    alt: 'Luxury couple spa environment with two treatment beds and candles',
    spanClass: 'span-wide'
  },
  // 7. MANICURE & PEDICURE (Square)
  {
    id: 'nails-1',
    category: 'MANICURE & PEDICURE',
    title: 'Couture Nail Artistry',
    subtitle: 'Precision shaping & gel pampering',
    desc: 'Refined manicure treatments featuring premium non-toxic polishes, gentle cuticular grooming, and restorative hand massage.',
    image: '/salon_nails_beauty.webp',
    alt: 'Elegant manicure and nail styling treatment',
    spanClass: 'span-square'
  },
  // 8. MAKEUP (Portrait)
  {
    id: 'makeup-1',
    category: 'MAKEUP',
    title: 'Haute Bridal & Glamour',
    subtitle: 'Editorial radiant elegance',
    desc: 'Flawless makeup artistry tailored for brides and special events, highlighting your natural beauty with camera-ready luminous grace.',
    image: '/svc_bridal_makeup.webp',
    alt: 'Bridal makeup and luxury beauty styling preparation',
    spanClass: 'span-portrait'
  },
  // 9. SPA & WELLNESS (Landscape)
  {
    id: 'spa-2',
    category: 'SPA & WELLNESS',
    title: 'Botanical Body Polish',
    subtitle: 'Exfoliation & golden hydration',
    desc: 'An exquisite full-body polish with sea salts and organic oils, sloughing away dull cells to reveal velvety, glowing skin.',
    image: '/svc_body_polishing.webp',
    alt: 'Full body botanical polishing and detox treatment',
    spanClass: 'span-landscape'
  },
  // 10. AVS SPACE (Square)
  {
    id: 'space-2',
    category: 'AVS SPACE',
    title: 'Private Sanctuary Suite',
    subtitle: 'Serene acoustic isolation',
    desc: 'Each treatment room at AVS is private, climate-controlled, and infused with calming aromatherapy notes for total peace of mind.',
    image: '/about_hero_interior.webp',
    alt: 'Private luxury spa treatment suite interior with warm ivory lighting',
    spanClass: 'span-square'
  },
  // 11. WAXING & LASER (Landscape)
  {
    id: 'waxing-1',
    category: 'WAXING & LASER',
    title: 'Precision Silkening Care',
    subtitle: 'Gentle & long-lasting smoothness',
    desc: 'Advanced hair removal performed by seasoned estheticians in an impeccably hygienic, soothing clinical environment.',
    image: '/svc_waxing_laser.webp',
    alt: 'Professional laser and waxing beauty treatment room',
    spanClass: 'span-landscape'
  },
  // 12. HAIR CARE (Landscape)
  {
    id: 'hair-2',
    category: 'HAIR CARE',
    title: 'Haute Salon Styling',
    subtitle: 'Master cut & gloss finish',
    desc: 'Bespoke hair design, tailored color balayage, and luxurious blowout experiences that elevate your signature style.',
    image: '/salon_hair_styling.webp',
    alt: 'Professional hair stylist creating an elegant blowout look',
    spanClass: 'span-landscape'
  },
  // 13. MASSAGE (Square)
  {
    id: 'massage-2',
    category: 'MASSAGE',
    title: 'Swedish Gentle Relaxation',
    subtitle: 'Long flowing restorative strokes',
    desc: 'A calming full-body massage designed to soothe the nervous system, stimulate circulation, and dissolve daily fatigue.',
    image: '/rmt_relaxation.webp',
    alt: 'Relaxing Swedish massage therapy treatment at AVS',
    spanClass: 'span-square'
  },
  // 14. MANICURE & PEDICURE (Landscape)
  {
    id: 'nails-2',
    category: 'MANICURE & PEDICURE',
    title: 'Herbal Foot Spa & Pedicure',
    subtitle: 'Invigorating soak & acupressure',
    desc: 'Revitalize tired feet with warm organic herbal soaks, invigorating sugar scrub exfoliation, and targeted reflexology pressure.',
    image: '/svc_foot_spa.webp',
    alt: 'Relaxing foot spa and pedicure treatment with natural florals',
    spanClass: 'span-landscape'
  },
  // 15. FACIALS & SKIN (Square)
  {
    id: 'facial-2',
    category: 'FACIALS & SKIN',
    title: 'Luminous Facial Glow',
    subtitle: 'Deep pore detox & peptide mask',
    desc: 'Advanced clinical esthetics infused with botanical peptides, visibly plumping and evening skin texture in a single ritual.',
    image: '/salon_facial_glow.webp',
    alt: 'Glowing skin facial treatment with hydrating mask',
    spanClass: 'span-square'
  },
  // 16. AVS SPACE (Landscape)
  {
    id: 'space-3',
    category: 'AVS SPACE',
    title: 'Modern Salon Studio',
    subtitle: 'Where style meets tranquility',
    desc: 'Our expansive salon floor combines modern minimalist lines with Italian styling chairs and soft warm lighting.',
    image: '/salon_bg.webp',
    alt: 'Interior of Aura Vital Star luxury hair salon and styling chairs',
    spanClass: 'span-landscape'
  },
  // 17. MASSAGE (Square)
  {
    id: 'massage-3',
    category: 'MASSAGE',
    title: 'Deep Tissue Release',
    subtitle: 'Chronic tension management',
    desc: 'Specialized deep muscular therapy targeting persistent neck, shoulder, and back tightness for long-term physical freedom.',
    image: '/rmt_deep_tissue.webp',
    alt: 'Deep tissue therapy by certified massage professional',
    spanClass: 'span-square'
  },
  // 18. SPA & WELLNESS (Landscape)
  {
    id: 'spa-3',
    category: 'SPA & WELLNESS',
    title: 'Mind & Body Harmony',
    subtitle: 'A holistic wellness journey',
    desc: 'Curated wellness packages pairing massage, hydro-comfort, and peaceful meditation in an unhurried, restorative atmosphere.',
    image: '/hero_wellness.webp',
    alt: 'Holistic wellness sanctuary experience with soft green accents',
    spanClass: 'span-landscape'
  }
];

const SOCIAL_PHOTOS = [
  { img: '/gallery_hot_stones.webp', alt: 'Hot stone ritual' },
  { img: '/hero_facial.webp', alt: 'Facial rejuvenation' },
  { img: '/gallery_lounge_interior.webp', alt: 'AVS sanctuary lounge' },
  { img: '/svc_bridal_makeup.webp', alt: 'Haute beauty look' },
  { img: '/svc_couple_retreat.webp', alt: 'Couple retreat suite' },
  { img: '/salon_nails_beauty.webp', alt: 'Nail couture' }
];

export default function GalleryPage({ onBookClick, onNavClick }) {
  const [galleryList, setGalleryList] = useState(GALLERY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Load dynamic gallery items from CRM CMS
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((result) => {
        const data = Array.isArray(result) ? result : (result?.data || []);
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((item, idx) => ({
            id: item.id || `crm-gal-${idx}`,
            category: (item.category || 'AVS SPACE').toUpperCase(),
            title: item.title,
            subtitle: item.category || 'Aura Vital Star',
            desc: item.description || item.desc || 'Experience pure clinical wellness and relaxation at Aura Vital Star.',
            image: item.imageUrl || item.image || '/gallery_hot_stones.webp',
            alt: item.title || 'Aura Vital Star luxury gallery scene',
            spanClass: item.spanClass || (idx % 6 === 0 ? 'span-feature' : idx % 5 === 0 ? 'span-wide' : idx % 3 === 0 ? 'span-portrait' : 'span-landscape')
          }));
          setGalleryList(mapped);
        }
      })
      .catch((err) => console.warn('Gallery live API load fallback:', err));
  }, []);

  const dynamicCategories = [
    'ALL',
    ...Array.from(new Set([
      ...CATEGORIES.filter((c) => c !== 'ALL'),
      ...galleryList.map((i) => i.category.toUpperCase())
    ]))
  ];

  // Filter gallery items
  const filteredItems = selectedCategory === 'ALL'
    ? galleryList
    : galleryList.filter((item) => item.category.toUpperCase() === selectedCategory.toUpperCase());

  // Lightbox handlers
  const openLightbox = (item) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev + 1) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    }
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, nextLightbox, prevLightbox]);

  // Smooth scroll to gallery grid
  const scrollToGallery = (e) => {
    e.preventDefault();
    const target = document.getElementById('gallery-grid-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="gallery-page">
      {/* ========================================================
          1. CINEMATIC HERO SECTION
          ======================================================== */}
      <section className="gallery-hero" aria-labelledby="gallery-hero-heading">
        <div className="gallery-hero-bg">
          <img loading="lazy" decoding="async" className="gallery-hero-img"
            src="/hero_wellness.webp"
            alt="Aura Vital Star luxury wellness environment"
          />
        </div>
        <div className="gallery-hero-overlay" aria-hidden="true" />

        <div className="gallery-hero-content">
          <p className="gallery-hero-eyebrow">
            Aura Vital Star &bull; Rejuvenation Centre
          </p>
          <h1 className="gallery-hero-title" id="gallery-hero-heading">
            Moments of Beauty.
            <span>Moments of Wellness.</span>
          </h1>
          <p className="gallery-hero-script">Experience AVS</p>

          <div className="gallery-gold-line" aria-hidden="true">
            <span className="line" />
            <span className="diamond" />
            <span className="line" />
          </div>

          <p className="gallery-hero-desc">
            Step inside Aura Vital Star and discover a world designed for relaxation,
            beauty, rejuvenation and self-care.
          </p>

          <a
            href="#gallery-grid-section"
            onClick={scrollToGallery}
            className="gallery-hero-cta"
            aria-label="Explore Our Gallery"
          >
            <span>Explore Our Gallery</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v10M3 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* ========================================================
          2. INTERACTIVE CATEGORY FILTER
          ======================================================== */}
      <section className="gallery-filter-section" aria-label="Gallery category filters">
        <div className="gallery-filter-container">
          <div className="gallery-filter-track" role="tablist">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="gallery-active-info">
            <span className="gallery-count-badge">
              Showing {filteredItems.length} curated {filteredItems.length === 1 ? 'moment' : 'moments'}
            </span>
            <span className="gallery-hint">Click any photo for details &amp; fullscreen view</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PREMIUM EDITORIAL MASONRY GALLERY
          ======================================================== */}
      <section className="gallery-grid-section" id="gallery-grid-section" aria-label="Curated gallery photos">
        <div className="gallery-masonry-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`masonry-item ${item.spanClass}`}
              onClick={() => openLightbox(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(item);
                }
              }}
              aria-label={`View ${item.title}`}
            >
              <div className="masonry-img-wrap">
                <img loading="lazy" decoding="async" className="masonry-img"
                  src={item.image}
                  alt={item.alt}
                />
                <div className="masonry-overlay">
                  <span className="masonry-badge">{item.category}</span>
                  <div className="masonry-title-row">
                    <h3 className="masonry-title">{item.title}</h3>
                    <div className="masonry-arrow" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. FULLSCREEN IMAGE LIGHTBOX
          ======================================================== */}
      {activeItem && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="lightbox-content">
            <button
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close fullscreen view"
            >
              &times;
            </button>

            <button
              className="lightbox-nav-btn prev"
              onClick={prevLightbox}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M11 2L5 8l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className="lightbox-nav-btn next"
              onClick={nextLightbox}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="lightbox-img-side">
              <img loading="lazy" decoding="async" className="lightbox-img"
                src={activeItem.image}
                alt={activeItem.alt}
              />
            </div>

            <div className="lightbox-info-side">
              <div>
                <span className="lightbox-category-tag">{activeItem.category}</span>
                <h2 className="lightbox-title">{activeItem.title}</h2>
                <div className="lightbox-divider" />
                <p className="lightbox-desc">{activeItem.desc}</p>
              </div>

              <div className="lightbox-meta">
                <span className="lightbox-counter">
                  {lightboxIndex + 1} of {filteredItems.length}
                </span>
                <button
                  className="lightbox-cta-btn"
                  onClick={(e) => {
                    closeLightbox();
                    if (onBookClick) onBookClick(e, `Gallery Lightbox: ${activeItem.title}`);
                  }}
                >
                  Book This Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. FEATURED GALLERY EXPERIENCE
          “Every Detail Has a Purpose.”
          ======================================================== */}
      <section className="gallery-editorial-section" aria-labelledby="editorial-heading">
        <div className="gallery-editorial-container">
          <div className="editorial-img-frame">
            <img loading="lazy" decoding="async" src="/about_hero_interior.webp"
              alt="Aura Vital Star private treatment suite interior"
            />
            <div className="editorial-img-badge">
              <span>AVS Sanctuary Experience</span>
            </div>
          </div>

          <div className="editorial-text-col">
            <p className="editorial-eyebrow">The AVS Philosophy</p>
            <h2 className="editorial-heading" id="editorial-heading">
              Every Detail Has a Purpose.
            </h2>
            <p className="editorial-desc">
              From calming spaces to personalized beauty rituals, every detail at AVS
              is thoughtfully designed to make your experience feel exceptional.
            </p>

            <div className="editorial-points-grid">
              <div className="editorial-point">
                <span className="editorial-point-title">Relax</span>
                <p className="editorial-point-desc">Slow down and reconnect.</p>
              </div>
              <div className="editorial-point">
                <span className="editorial-point-title">Rejuvenate</span>
                <p className="editorial-point-desc">Restore your natural glow.</p>
              </div>
              <div className="editorial-point">
                <span className="editorial-point-title">Radiate</span>
                <p className="editorial-point-desc">Leave feeling renewed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. BEFORE YOUR EXPERIENCE
          “Your AVS Experience” (4 Stages)
          ======================================================== */}
      <section className="gallery-stages-section" aria-labelledby="stages-heading">
        <div className="stages-header">
          <p className="stages-eyebrow">Your Wellness Journey</p>
          <h2 className="stages-heading" id="stages-heading">
            Your AVS Experience
          </h2>
        </div>

        <div className="stages-grid">
          <div className="stage-card">
            <span className="stage-num">01</span>
            <h3 className="stage-name">Arrive</h3>
            <p className="stage-desc">Step into your sanctuary.</p>
          </div>

          <div className="stage-card">
            <span className="stage-num">02</span>
            <h3 className="stage-name">Unwind</h3>
            <p className="stage-desc">Leave the outside world behind.</p>
          </div>

          <div className="stage-card">
            <span className="stage-num">03</span>
            <h3 className="stage-name">Rejuvenate</h3>
            <p className="stage-desc">Enjoy your personalized treatment.</p>
          </div>

          <div className="stage-card">
            <span className="stage-num">04</span>
            <h3 className="stage-name">Radiate</h3>
            <p className="stage-desc">Leave refreshed and renewed.</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. GRAND OPENING FEATURE BANNER
          ======================================================== */}
      <section className="gallery-banner-section" aria-labelledby="banner-title">
        <div className="gallery-banner-card">
          <img loading="lazy" decoding="async" className="banner-bg-img"
            src="/hero_relaxation.webp"
            alt="Aura Vital Star Grand Opening wellness celebration"
          />
          <div className="banner-overlay" aria-hidden="true" />
          <div className="banner-content">
            <p className="banner-eyebrow">Exclusive Milestone</p>
            <h2 className="banner-title" id="banner-title">
              Grand Opening Celebrations
            </h2>
            <p className="banner-date">16th of September 2026</p>
            <p className="banner-desc">
              A new beginning of wellness, beauty &amp; you.
            </p>
            <button
              className="banner-btn"
              onClick={(e) => {
                if (onBookClick) onBookClick(e, 'Gallery Grand Opening');
              }}
            >
              Book Your Appointment
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. INSTAGRAM-STYLE INTERACTION
          “Follow the AVS Journey”
          ======================================================== */}
      <section className="gallery-social-section" aria-labelledby="social-heading">
        <div className="social-header">
          <p className="social-eyebrow">Connect With Us</p>
          <h2 className="social-heading" id="social-heading">
            Follow the AVS Journey
          </h2>
          <p className="social-desc">
            Beauty, wellness and moments of rejuvenation.
          </p>
        </div>

        <div className="social-grid">
          {SOCIAL_PHOTOS.map((item, idx) => (
            <a
              key={idx}
              href="https://instagram.com/AuraVitalStar"
              target="_blank"
              rel="noopener noreferrer"
              className="social-item"
              aria-label={`View AVS Instagram moment: ${item.alt}`}
            >
              <img loading="lazy" decoding="async" className="social-img"
                src={item.img}
                alt={item.alt}
              />
              <div className="social-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://instagram.com/AuraVitalStar"
          target="_blank"
          rel="noopener noreferrer"
          className="social-cta-btn"
        >
          <span>Discover More</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </section>

      {/* ========================================================
          9. FINAL BOOKING CTA
          “Ready to Experience AVS?”
          ======================================================== */}
      <section className="gallery-booking-cta" aria-labelledby="booking-cta-heading">
        <div className="booking-cta-content">
          <div className="booking-cta-lotus" aria-hidden="true">
            <svg width="44" height="26" viewBox="0 0 32 20" fill="none">
              <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" fill="#C59A3F" opacity="0.9" />
              <path d="M11 7 C8 6 5 8 4 11 C5 14 7 15 11 15" stroke="#C59A3F" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M21 7 C24 6 27 8 28 11 C27 14 25 15 21 15" stroke="#C59A3F" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="booking-cta-heading" id="booking-cta-heading">
            Ready to Experience AVS?
          </h2>
          <p className="booking-cta-desc">
            Your time for relaxation, beauty and rejuvenation starts here.
          </p>

          <div className="booking-cta-buttons">
            <button
              className="btn-luxury-gold"
              onClick={(e) => {
                if (onBookClick) onBookClick(e, 'Gallery Final CTA');
              }}
            >
              Book Your Appointment
            </button>
            <a
              href="#contact"
              onClick={(e) => {
                if (onNavClick) onNavClick(e, '#contact');
              }}
              className="btn-luxury-outline"
            >
              Contact AVS
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
