import React, { useState, useEffect, useRef } from 'react';
import './services.css';

// All 15 authentic services from the official Aura Vital Star reference flyer
export const AVS_SERVICES = [
  {
    id: 'hair-spa-head-massage',
    num: '01',
    title: 'Hair Spa & Head Massage',
    category: 'HAIR & HEAD',
    categories: ['HAIR & HEAD'],
    desc: 'Relax, refresh, and nourish your hair with our premium treatments.',
    detailedDesc: 'Indulge in a sensory sanctuary designed to soothe everyday stress while deeply replenishing your hair from root to tip. Our specialist therapists combine warm botanical oils, custom pressure-point scalp therapy, and intense nutrient infusions to revive moisture, restore balance, and calm your mind.',
    benefits: [
      'Deep scalp tension and stress release',
      'Nourishing botanical hair hydration',
      'Improves scalp circulation & follicle vitality',
      'Silky, healthy gloss and manageable texture'
    ],
    experience: 'Approx. 50 – 60 min • Includes warm botanical oil blend, acupressure scalp massage, and nourishing hair rinse',
    image: '/svc_hair_head.webp'
  },
  {
    id: 'body-massage-pain-relief',
    num: '02',
    title: 'Body Massage & Pain Relief Therapy',
    category: 'HAIR & HEAD',
    categories: ['HAIR & HEAD', 'BODY WELLNESS'],
    desc: 'Experience complete relaxation with essential oil massages and pain relief therapy.',
    detailedDesc: 'Experience restorative healing through our tailored full-body massage therapy. Combining therapeutic pressure techniques with handcrafted pure essential oil blends, this treatment targets tight muscle groups, eases chronic stiffness, relieves tension headaches, and promotes profound total-body relaxation.',
    benefits: [
      'Alleviates chronic muscle aches and tension',
      'Enhances circulation and lymphatic flow',
      'Calms the nervous system & promotes deep sleep',
      'Personalized pressure for targeted pain relief'
    ],
    experience: 'Approx. 60 – 90 min • Certified therapist consultation, targeted trigger point relief, warm towels',
    image: '/hero_massage.webp'
  },
  {
    id: 'facials-all-types',
    num: '03',
    title: 'Facials – All Types of Facials',
    category: 'FACIALS & SKIN',
    categories: ['FACIALS & SKIN'],
    desc: 'Rejuvenate your skin with personalized facial treatments for a natural glow.',
    detailedDesc: 'Unlock your most radiant complexion with our customized luxury facial protocols. Whether you seek deep pore purification, intensive hydration, brightening, or firming rejuvenation, our licensed aestheticians customize medical-grade botanical actives precisely to your skin profile.',
    benefits: [
      'Personalized skin diagnosis and targeted serum infusion',
      'Deep pore cleansing and gentle cellular exfoliation',
      'Restores skin moisture barrier and elasticity',
      'Noticeable natural luminosity and refined texture'
    ],
    experience: 'Approx. 60 min • Ultrasonic pore cleanse, gentle botanical peel, relaxing face & neck massage, specialized mask',
    image: '/salon_facial_glow.webp'
  },
  {
    id: 'organic-spa-facials',
    num: '04',
    title: 'Organic Spa & Facials',
    category: 'FACIALS & SKIN',
    categories: ['FACIALS & SKIN', 'SPECIAL EXPERIENCES'],
    desc: 'Experience the goodness of natural and organic ingredients for glowing skin.',
    detailedDesc: 'Immerse your skin in pure, organic botanical wellness. Formulated with certified organic floral waters, plant-derived vitamins, and calming herbal extracts, this gentle yet potent facial feeds and comforts even the most sensitive skin without synthetic fragrances or irritants.',
    benefits: [
      '100% clean, certified organic botanical elixirs',
      'Free from harsh sulfates, parabens, and synthetic additives',
      'Soothes redness, inflammation, and sensitive skin',
      'Infuses antioxidants for enduring organic radiance'
    ],
    experience: 'Approx. 60 min • Rosewater compress, organic honey & oat exfoliant, cold-pressed botanical oil facial massage',
    image: '/brand_editorial.webp'
  },
  {
    id: 'body-polishing',
    num: '05',
    title: 'Body Polishing',
    category: 'FACIALS & SKIN',
    categories: ['FACIALS & SKIN', 'BODY WELLNESS'],
    desc: 'Exfoliate, brighten and rejuvenate your skin.',
    detailedDesc: 'Reveal ultra-soft, luminous skin with our signature full-body polishing ritual. Using an invigorating blend of mineral sea salts, golden jojoba oil, and soothing lavender botanicals, this therapeutic polish buffs away dull surface cells, stimulates circulation, and leaves your skin feeling velvety smooth.',
    benefits: [
      'Removes dead epidermal cells for instant skin softness',
      'Stimulates micro-circulation for a healthy body glow',
      'Enhances the absorption of moisturizing lotions',
      'Leaves full-body skin satin-smooth and delicately scented'
    ],
    experience: 'Approx. 60 min • Full-body botanical exfoliation, warm rinse, and rich golden hydration balm application',
    image: '/svc_body_polishing.webp'
  },
  {
    id: 'foot-spa-pamper-feet',
    num: '06',
    title: 'Foot Spa – Pamper Your Feet',
    category: 'BODY WELLNESS',
    categories: ['BODY WELLNESS', 'HANDS & FEET'],
    desc: 'Give your feet the care they deserve with relaxing and refreshing foot therapies.',
    detailedDesc: 'Step away from the rush of daily life into our soothing foot sanctuary. Featuring an artisan hammered copper basin filled with warm herbal waters, floral rose petals, and smooth volcanic river stones, this therapy releases lower-limb fatigue and leaves feet refreshed and renewed.',
    benefits: [
      'Relieves tired arches and swollen feet',
      'Softens rough heels with warm mineral soak',
      'Acupressure foot massage relieves tension throughout body',
      'Leaves your step light, rejuvenated, and invigorated'
    ],
    experience: 'Approx. 45 min • Rose petal mineral soak, revitalizing foot scrub, pressure-point massage, warm towel wrap',
    image: '/svc_foot_spa.webp'
  },
  {
    id: 'couple-retreats',
    num: '07',
    title: 'Couple Retreats',
    category: 'BODY WELLNESS',
    categories: ['BODY WELLNESS', 'SPECIAL EXPERIENCES'],
    desc: 'Relax, rejuvenate and bond together with our special couple spa experiences.',
    detailedDesc: 'Escape together into a serene private spa sanctuary designed for shared relaxation. Side-by-side plush massage beds, soft candlelight, white orchids, and calming aromatherapy create the ideal setting to unwind, reconnect, and restore mind, body, and soul in total harmony.',
    benefits: [
      'Private luxury couple suite with romantic ambient lighting',
      'Side-by-side simultaneous full-body therapeutic massages',
      'Customized aromatherapy essential oil selection',
      'Complimentary soothing herbal tea & wellness refreshments'
    ],
    experience: 'Approx. 75 – 90 min • Shared sanctuary time, customized tandem treatments, botanical relaxation ritual',
    image: '/svc_couple_retreat.webp'
  },
  {
    id: 'waxing-laser',
    num: '08',
    title: 'Waxing & Laser',
    category: 'WAXING & LASER',
    categories: ['WAXING & LASER'],
    desc: 'Smooth, gentle, and long-lasting hair removal with advanced waxing and laser services.',
    detailedDesc: 'Achieve smooth, hair-free skin with our gentle clinical hair removal services. Combining premium hypoallergenic soft waxes with state-of-the-art gentle laser technology, we provide fast, virtually painless, and long-lasting results tailored to your comfort.',
    benefits: [
      'Precision hair removal for silky, enduring smoothness',
      'Hypoallergenic wax formulas minimize redness and irritation',
      'Advanced cooling technology for gentle laser sessions',
      'Significantly reduces ingrown hairs and slows regrowth'
    ],
    experience: 'Approx. 30 – 60 min • Sanitizing skin prep, skilled rapid technique, soothing aloe & chamomile post-care',
    image: '/svc_waxing_laser.webp'
  },
  {
    id: 'full-arm-waxing',
    num: '09',
    title: 'Full Arm Waxing',
    category: 'WAXING & LASER',
    categories: ['WAXING & LASER'],
    desc: 'Smooth and long-lasting results for silky arms.',
    detailedDesc: 'Experience complete smoothness from shoulder to fingertips. Our specialists utilize temperature-controlled luxury honey-resin wax to efficiently remove unwanted hair, leaving your arms radiantly smooth and touchably soft for weeks.',
    benefits: [
      'Even, comprehensive hair removal from shoulder to wrist',
      'Ultra-gentle formulation suitable for delicate arm skin',
      'Noticeably slower and finer hair regrowth over time',
      'Finished with cooling antioxidant mist and silky lotion'
    ],
    experience: 'Approx. 30 min • Thorough skin prep, full arm wax, and anti-inflammatory calming application',
    image: '/rmt_customized.webp'
  },
  {
    id: 'under-arm-waxing',
    num: '10',
    title: 'Under Arm Waxing',
    category: 'WAXING & LASER',
    categories: ['WAXING & LASER'],
    desc: 'Gentle and effective care for soft underarms.',
    detailedDesc: 'Say goodbye to daily razor burn and shadow with our precision underarm treatment. Using a gentle strip-free hard wax specifically designed for sensitive contours, we remove hair directly at the root with minimal discomfort.',
    benefits: [
      'Quick, clean, and hygienic hair removal',
      'Eliminates dark stubble shadow for a clean look',
      'Prevents ingrown hairs and razor irritation',
      'Lasts up to 3 to 4 weeks of carefree smoothness'
    ],
    experience: 'Approx. 15 min • Gentle cleansing, rapid low-temperature wax removal, tea-tree soothing balm',
    image: '/rmt_why_avs.webp'
  },
  {
    id: 'bikini-waxing',
    num: '11',
    title: 'Bikini Waxing',
    category: 'WAXING & LASER',
    categories: ['WAXING & LASER'],
    desc: 'Comfortable and discreet bikini line waxing.',
    detailedDesc: 'Conducted in our completely private, sanitized suites with certified aestheticians, our bikini waxing is designed for utmost comfort, discretion, and perfection. We use ultra-soothing elastic waxes formulated for sensitive intimate contours.',
    benefits: [
      '100% private, respectful, and hygienic treatment room',
      'Specialized elastic wax minimizes sensation on delicate skin',
      'Precise, clean lines that boost confidence in any outfit',
      'Soothing botanical post-treatment to eliminate redness'
    ],
    experience: 'Approx. 20 – 30 min • Professional consultation, gentle precision waxing, cooling cucumber barrier',
    image: '/promise_bg.webp'
  },
  {
    id: 'full-body-waxing',
    num: '12',
    title: 'Full Body Waxing',
    category: 'WAXING & LASER',
    categories: ['WAXING & LASER', 'SPECIAL EXPERIENCES'],
    desc: 'Complete body waxing for silky, smooth skin.',
    detailedDesc: 'Our comprehensive head-to-toe hair removal session leaves your entire body uniformly silky, radiant, and smooth. Conducted methodically by our senior aestheticians, this service ensures continuous comfort and flawless results.',
    benefits: [
      'Complete all-over smoothness in a single dedicated visit',
      'Custom waxes selected for different body zones',
      'Long-lasting hair-free confidence for up to a month',
      'Full-body hydrating and soothing oil application'
    ],
    experience: 'Approx. 75 – 90 min • Comprehensive full-body treatment with continuous soothing skin comfort',
    image: '/hero_bg.webp'
  },
  {
    id: 'pedicure-pamper-feet',
    num: '13',
    title: 'Pedicure – Pamper Your Feet',
    category: 'HANDS & FEET',
    categories: ['HANDS & FEET'],
    desc: 'Relaxing nail care and massage for soft, healthy and beautiful feet.',
    detailedDesc: 'Elevate your routine nail care into a tranquil spa ritual. Enjoy warm floral foot baths, gentle exfoliating scrubs, precision cuticle and nail shaping, followed by an invigorating foot and calf massage and your choice of luxury long-wear polish.',
    benefits: [
      'Expert nail shaping, buffing, and cuticle nourishment',
      'Smooths rough heels and stubborn calluses gently',
      'Relaxing calf & foot massage eases accumulated tension',
      'Wide collection of premium, toxin-free luxury polishes'
    ],
    experience: 'Approx. 50 min • Mineral soak, organic scrub, nail shaping, massage, professional polish application',
    image: '/salon_nails_beauty.webp'
  },
  {
    id: 'manicure-pamper-hands',
    num: '14',
    title: 'Manicure – Pamper Your Hands',
    category: 'HANDS & FEET',
    categories: ['HANDS & FEET'],
    desc: 'Nourish, shape, and polish your nails for a flawless look.',
    detailedDesc: 'Treat your hands to restorative care. We begin with warm botanical towels and gentle cuticle grooming, followed by an exfoliating scrub, deeply hydrating hand and wrist massage, and finished with impeccable nail shaping and high-gloss polish.',
    benefits: [
      'Revitalizes dry hands and nourishes delicate cuticles',
      'Precision shaping for clean, elegant fingernails',
      'Therapeutic hand & forearm massage releases wrist strain',
      'Flawless, chip-resistant finish for everyday elegance'
    ],
    experience: 'Approx. 40 min • Warm hand soak, cuticle care, hand scrub, acupressure massage, luxury polish',
    image: '/hero_relaxation.webp'
  },
  {
    id: 'party-bridal-makeup',
    num: '15',
    title: 'Party & Bridal Makeup',
    category: 'MAKEUP',
    categories: ['MAKEUP', 'SPECIAL EXPERIENCES'],
    desc: 'Look your best with our stunning party and bridal makeup.',
    detailedDesc: 'Celebrate your most unforgettable moments with bespoke artistry tailored to highlight your natural beauty. Using elite prestige cosmetics, long-lasting primers, and bespoke lighting techniques, our artists ensure a timeless, radiant look that glows in person and on camera.',
    benefits: [
      'Personalized consultation matching skin tone, dress, & style',
      'High-definition, photography-ready makeup that lasts all day',
      'Pre-makeup skincare preparation for luminous dewy skin',
      'Includes premium false lash application and touch-up guidance'
    ],
    experience: 'Approx. 60 – 90 min • Skin preparation, custom color blending, radiant contouring, setting finish',
    image: '/svc_bridal_makeup.webp'
  }
];

// 5 Luxury Hero Slides for full-width cinematic background slideshow
export const HERO_SLIDES = [
  {
    id: 'slide-01',
    num: '01',
    title: 'Luxury Spa Sanctuary',
    image: '/svc_couple_retreat.webp',
    alt: 'Luxury Spa Sanctuary at Aura Vital Star'
  },
  {
    id: 'slide-02',
    num: '02',
    title: 'Hair Spa & Head Massage',
    image: '/svc_hair_head.webp',
    alt: 'Hair Spa and Scalp Massage Experience'
  },
  {
    id: 'slide-03',
    num: '03',
    title: 'Facial & Skincare Treatment',
    image: '/salon_facial_glow.webp',
    alt: 'Radiant Facial and Skincare Therapy'
  },
  {
    id: 'slide-04',
    num: '04',
    title: 'Relaxing Body Massage',
    image: '/hero_massage.webp',
    alt: 'Therapeutic Body Massage Therapy'
  },
  {
    id: 'slide-05',
    num: '05',
    title: 'Premium Wellness Experience',
    image: '/hero_wellness.webp',
    alt: 'Holistic Wellness Rituals'
  }
];

// 8 Service Categories matching flyer structure & prompt specifications
export const SERVICE_FILTER_TABS = [
  { id: 'ALL SERVICES', label: 'ALL SERVICES' },
  { id: 'HAIR & HEAD', label: 'HAIR & HEAD' },
  { id: 'FACIALS & SKIN', label: 'FACIALS & SKIN' },
  { id: 'BODY WELLNESS', label: 'BODY WELLNESS' },
  { id: 'WAXING & LASER', label: 'WAXING & LASER' },
  { id: 'HANDS & FEET', label: 'HANDS & FEET' },
  { id: 'MAKEUP', label: 'MAKEUP' },
  { id: 'SPECIAL EXPERIENCES', label: 'SPECIAL EXPERIENCES' }
];

export default function ServicesPage({ onBookClick, onNavClick }) {
  const [activeCategory, setActiveCategory] = useState('ALL SERVICES');
  const [selectedService, setSelectedService] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const servicesGridRef = useRef(null);

  // Automatic background slideshow: ~2 seconds display time before transitioning
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Set document title & SEO meta tags
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Spa & Wellness Services in Brampton | Aura Vital Star';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content =
      'Explore premium spa, wellness, facial, massage, waxing, manicure, pedicure and beauty services at Aura Vital Star Rejuvenation Centre in Brampton, Ontario.';
  }, []);

  // Keyboard accessibility for modal (ESC key to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedService) {
        setSelectedService(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedService]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  // Filter services dynamically
  const filteredServices =
    activeCategory === 'ALL SERVICES'
      ? AVS_SERVICES
      : AVS_SERVICES.filter(
          (s) =>
            s.category === activeCategory ||
            (s.categories && s.categories.includes(activeCategory))
        );

  const handleBookNow = (serviceTitle) => {
    if (onBookClick) {
      onBookClick(null, `Services Page - ${serviceTitle}`);
    }
  };

  const scrollToServices = (e) => {
    if (e) e.preventDefault();
    if (servicesGridRef.current) {
      const topOffset = servicesGridRef.current.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="avs-services-page" id="services-page-root">
      {/* ====================================================================
          1. FULL-WIDTH CINEMATIC SPA SLIDESHOW HERO SECTION (PREMIUM MINIMAL)
          ==================================================================== */}
      <section className="svc-hero" aria-labelledby="services-hero-title">
        {/* Full-width Automatic Background Slideshow */}
        <div className="svc-hero-slides-wrapper" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className={`svc-hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
              role="img"
              aria-label={slide.alt}
            />
          ))}
        </div>

        {/* Subtle Dark Forest Green & Vignette Gradient Overlay */}
        <div className="svc-hero-overlay" aria-hidden="true"></div>

        {/* Ambient Subtle Glow */}
        <div className="svc-hero-ambient" aria-hidden="true">
          <div className="svc-hero-ambient-glow"></div>
        </div>

        {/* Editorial Left-Aligned Hero Content */}
        <div className="svc-hero-container">
          <div className="svc-hero-content-left">
            <div className="svc-hero-brand-label">
              <span className="svc-hero-label-bar" aria-hidden="true"></span>
              <span className="svc-hero-label-text">
                AURA VITAL STAR <em>•</em> REJUVENATION CENTRE
              </span>
            </div>

            <h1 className="svc-hero-title" id="services-hero-title">
              Beauty, Wellness &amp;<br />
              Rejuvenation
            </h1>

            <div className="svc-hero-script-accent">Explore Our Services</div>

            {/* Subtle Gold Lotus Divider */}
            <div className="svc-hero-gold-line-wrap" aria-hidden="true">
              <span className="svc-hero-gold-line"></span>
              <svg className="svc-lotus-icon" viewBox="0 0 32 20">
                <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" />
                <path d="M11 7 C8 6 5 8 4 11 C5 14 7 15 11 15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M21 7 C24 6 27 8 28 11 C27 14 25 15 21 15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="svc-hero-gold-line"></span>
            </div>

            <p className="svc-hero-desc">
              Indulge in thoughtfully designed beauty and wellness experiences created to rejuvenate
              your body, refresh your mind and restore your natural glow.
            </p>

            <div className="svc-hero-ctas">
              <button
                type="button"
                onClick={() => handleBookNow('Hero CTA - Book Your Appointment')}
                className="svc-btn-primary"
                id="svc-hero-book-btn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span>BOOK YOUR APPOINTMENT</span>
              </button>

              <button
                type="button"
                onClick={scrollToServices}
                className="svc-btn-secondary"
                id="svc-hero-explore-btn"
              >
                <span>EXPLORE SERVICES</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Slideshow Indicator & Scroll To Explore Bottom Bar */}
        <div className="svc-hero-bottom-bar" aria-label="Slideshow Controls">
          <div className="svc-hero-indicators" role="tablist">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Slide ${idx + 1}: ${slide.title}`}
                  className={`svc-hero-indicator-item ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                >
                  <span className="svc-hero-ind-num">{slide.num}</span>
                  <span className="svc-hero-ind-bar" aria-hidden="true"></span>
                  <span className="svc-hero-ind-label">{slide.title}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={scrollToServices}
            className="svc-hero-scroll-cue"
            aria-label="Scroll to explore services"
          >
            <span className="svc-hero-scroll-text">SCROLL TO EXPLORE</span>
            <svg className="svc-hero-scroll-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4v16M5 13l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {/* ====================================================================
          2. SERVICE CATEGORY NAVIGATION (STICKY & SCROLLABLE)
          ==================================================================== */}
      <nav className="svc-filter-bar" id="svc-category-bar" aria-label="Service Category Filter">
        <div className="svc-filter-container">
          <div className="svc-filter-scroll" role="tablist">
            {SERVICE_FILTER_TABS.map((tab) => {
              const count =
                tab.id === 'ALL SERVICES'
                  ? AVS_SERVICES.length
                  : AVS_SERVICES.filter(
                      (s) =>
                        s.category === tab.id ||
                        (s.categories && s.categories.includes(tab.id))
                    ).length;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  className={`svc-filter-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(tab.id);
                  }}
                >
                  <span>{tab.label}</span>
                  <span className="svc-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ====================================================================
          3. SERVICES GRID
          ==================================================================== */}
      <section
        className="svc-grid-section"
        id="services-grid"
        ref={servicesGridRef}
        aria-labelledby="services-grid-title"
      >
        <div className="svc-section-header">
          <span className="svc-section-eyebrow">Curated Wellness Menu</span>
          <h2 className="svc-section-title" id="services-grid-title">
            {activeCategory === 'ALL SERVICES'
              ? 'All Beauty & Spa Services'
              : `${activeCategory} Services`}
          </h2>
          <p className="svc-section-desc">
            Recreated directly from our Brampton Rejuvenation Centre service menu, offering the
            highest standards of hygiene, skilled touch, and relaxing wellness rituals.
          </p>
        </div>

        <div className="svc-grid">
          {filteredServices.map((service) => (
            <article key={service.id} className="svc-card">
              <div className="svc-card-img-wrap">
                <img loading="lazy" decoding="async" src={service.image}
                  alt={`${service.title} at Aura Vital Star Brampton`}
                  className="svc-card-img"
                />
                <span className="svc-card-category-badge">{service.category}</span>
                <span className="svc-card-num-badge" aria-hidden="true">{service.num}</span>
              </div>

              <div className="svc-card-body">
                <h3 className="svc-card-title">{service.title}</h3>
                <p className="svc-card-desc">{service.desc}</p>
                <div className="svc-card-divider" aria-hidden="true"></div>

                <div className="svc-card-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className="svc-card-btn-details"
                    aria-label={`View full details for ${service.title}`}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBookNow(service.title)}
                    className="svc-card-btn-book"
                    aria-label={`Book appointment for ${service.title}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                      <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filteredServices.length === 0 && (
            <div className="svc-empty-state">
              <p>No services found for this category. Please select another category.</p>
              <button
                type="button"
                onClick={() => setActiveCategory('ALL SERVICES')}
                className="svc-btn-primary"
                style={{ marginTop: '16px' }}
              >
                View All Services
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          4. SERVICE DETAIL MODAL
          ==================================================================== */}
      {selectedService && (
        <div
          className="svc-modal-backdrop"
          onClick={() => setSelectedService(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-service-title"
        >
          <div
            className="svc-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="svc-modal-close-btn"
              onClick={() => setSelectedService(null)}
              aria-label="Close service details"
            >
              &times;
            </button>

            <div className="svc-modal-img-wrap">
              <img loading="lazy" decoding="async" src={selectedService.image}
                alt={selectedService.title}
                className="svc-modal-img"
              />
              <div className="svc-modal-img-overlay"></div>
              <div className="svc-modal-header-meta">
                <span className="svc-modal-category-tag">{selectedService.category}</span>
                <h3 className="svc-modal-title" id="modal-service-title">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            <div className="svc-modal-content">
              <p className="svc-modal-description">{selectedService.detailedDesc}</p>

              <h4 className="svc-modal-benefits-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" fill="#C89B3C" stroke="#C89B3C" strokeWidth="1.2" />
                </svg>
                <span>Key Experience Benefits</span>
              </h4>

              <div className="svc-modal-benefits-grid">
                {selectedService.benefits.map((benefit, idx) => (
                  <div key={idx} className="svc-modal-benefit-item">
                    <svg className="svc-modal-benefit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="svc-modal-benefit-text">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="svc-modal-experience-box">
                <svg className="svc-modal-exp-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="svc-modal-exp-text">
                  <strong>Treatment Experience:</strong> {selectedService.experience}
                </div>
              </div>

              <div className="svc-modal-footer">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="svc-btn-secondary"
                  style={{ color: '#0B2F24', borderColor: 'var(--avs-border-gold)' }}
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const title = selectedService.title;
                    setSelectedService(null);
                    handleBookNow(title);
                  }}
                  className="svc-btn-primary"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Book This Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          5. FEATURED EXPERIENCE SECTION ("Your Time. Your Wellness. Your Ritual.")
          ==================================================================== */}
      <section className="svc-rituals-section" aria-labelledby="svc-rituals-title">
        <div className="svc-rituals-container">
          <div className="svc-rituals-header">
            <div className="svc-rituals-eyebrow">The AVS Philosophy</div>
            <h2 className="svc-rituals-title" id="svc-rituals-title">
              Your Time. Your Wellness. Your Ritual.
            </h2>
            <div className="svc-gold-divider" style={{ margin: '0 auto 20px' }} aria-hidden="true">
              <span className="svc-gold-line"></span>
              <svg className="svc-lotus-icon" viewBox="0 0 32 20">
                <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" />
              </svg>
              <span className="svc-gold-line"></span>
            </div>
            <p className="svc-rituals-desc">
              From relaxing spa therapies to beauty rituals and personalized treatments, every AVS
              experience is designed around your comfort and wellbeing.
            </p>
          </div>

          <div className="svc-rituals-grid">
            {/* Block 1: RELAX */}
            <div className="svc-ritual-card">
              <div className="svc-ritual-icon-wrap" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21a9 9 0 1 0-9-9c0 1.48.36 2.88 1 4.11L3 21l4.89-1c1.23.64 2.63 1 4.11 1z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 10h.01M15 10h.01M9.5 15c.8 1 1.7 1 2.5 1s1.7 0 2.5-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="svc-ritual-name">RELAX</h3>
              <p className="svc-ritual-desc">
                Unwind with calming spa and massage experiences.
              </p>
            </div>

            {/* Block 2: REJUVENATE */}
            <div className="svc-ritual-card">
              <div className="svc-ritual-icon-wrap" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L14.4 7.2L20 7.8L16 12L17.2 17.6L12 14.8L6.8 17.6L8 12L4 7.8L9.6 7.2L12 2Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M12 22v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="svc-ritual-name">REJUVENATE</h3>
              <p className="svc-ritual-desc">
                Refresh your skin, hair and body with personalized treatments.
              </p>
            </div>

            {/* Block 3: RADIATE */}
            <div className="svc-ritual-card">
              <div className="svc-ritual-icon-wrap" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
                  <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="svc-ritual-name">RADIATE</h3>
              <p className="svc-ritual-desc">
                Step out feeling confident, refreshed and beautifully renewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          6. LIMITED-TIME OFFERS SECTION (INSPIRED DIRECTLY BY AVS FLYER)
          ==================================================================== */}
      <section className="svc-offers-section" aria-labelledby="svc-offers-title">
        <div className="svc-offers-container">
          <div className="svc-offers-box">
            <div className="svc-offers-box-ambient" aria-hidden="true"></div>

            <div className="svc-offers-header">
              <span className="svc-offers-eyebrow">Exclusive Celebrations</span>
              <h2 className="svc-offers-title" id="svc-offers-title">
                Limited Time Offers
              </h2>
              <div className="svc-gold-divider" style={{ margin: '0 auto' }} aria-hidden="true">
                <span className="svc-gold-line"></span>
                <svg className="svc-lotus-icon" viewBox="0 0 32 20">
                  <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" />
                </svg>
                <span className="svc-gold-line"></span>
              </div>
            </div>

            <div className="svc-offers-grid">
              {/* Offer 1: 30% OFF */}
              <div className="svc-offer-card">
                <div className="svc-offer-number-wrap">1</div>
                <div className="svc-offer-highlight">30% OFF</div>
                <div className="svc-offer-sub">ON ALL SERVICES</div>
                <p className="svc-offer-desc">
                  Valid for first-time clients during the Grand Opening Period.
                </p>
              </div>

              {/* Offer 2: Buy 3 get 1 free */}
              <div className="svc-offer-card">
                <div className="svc-offer-number-wrap">2</div>
                <div className="svc-offer-highlight">3 + 1 FREE</div>
                <div className="svc-offer-sub">SPECIAL BUNDLE</div>
                <p className="svc-offer-desc">
                  Buy any three services and get one of your choice free.
                </p>
              </div>

              {/* Offer 3: Refer a Friend */}
              <div className="svc-offer-card">
                <div className="svc-offer-number-wrap">3</div>
                <div className="svc-offer-highlight">20% OFF</div>
                <div className="svc-offer-sub">REFER A FRIEND</div>
                <p className="svc-offer-desc">
                  Refer a Friend and both receive 20% off on your next service.
                </p>
              </div>

              {/* Offer 4: First 100 Customers */}
              <div className="svc-offer-card">
                <div className="svc-offer-number-wrap">4</div>
                <div className="svc-offer-highlight">VIP GIFTS</div>
                <div className="svc-offer-sub">FIRST 100 CLIENTS</div>
                <p className="svc-offer-desc">
                  Complimentary luxury welcome gift package for our first 100 guests.
                </p>
              </div>
            </div>

            {/* Flyer Ribbon Banner */}
            <div className="svc-offers-gift-banner">
              <div className="svc-gift-left">
                <div className="svc-gift-icon-wrap" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="8" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v13" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 12h18" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8c-2-3-5-2-5 0s5 3 5 0zM12 8c2-3 5-2 5 0s-5 3-5 0z" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <div>
                  <h3 className="svc-gift-title">Complimentary Gifts to First 100 Customers</h3>
                  <p className="svc-gift-desc">
                    Book your Grand Opening appointment early to receive a curated botanical spa gift bag.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleBookNow('Limited Time Offers - Claim Promotion')}
                className="svc-btn-primary"
              >
                <span>Claim Your Offer</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          7. GRAND OPENING / FINAL BOOKING CTA SECTION
          ==================================================================== */}
      <section className="svc-booking-cta-section" aria-labelledby="svc-cta-title">
        <div className="svc-cta-watermark" aria-hidden="true">AVS</div>

        <div className="svc-cta-container">
          <div className="svc-cta-date-badge">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Grand Opening — 16th of September 2026</span>
          </div>

          <h2 className="svc-cta-title" id="svc-cta-title">
            Begin Your Wellness Journey
          </h2>

          <div className="svc-gold-divider" style={{ margin: '0 auto 20px' }} aria-hidden="true">
            <span className="svc-gold-line"></span>
            <svg className="svc-lotus-icon" viewBox="0 0 32 20">
              <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" />
            </svg>
            <span className="svc-gold-line"></span>
          </div>

          <p className="svc-cta-subtitle">
            Step into a world of luxury, relaxation and transformation. Experience the finest beauty
            and wellness services designed to rejuvenate your body, mind and soul.
          </p>

          <div className="svc-cta-buttons">
            <button
              type="button"
              onClick={() => handleBookNow('Final CTA - Begin Your Wellness Journey')}
              className="svc-btn-primary"
              id="svc-final-book-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Book Your Appointment</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                if (onNavClick) {
                  onNavClick(e, '#contact');
                } else {
                  const target = document.getElementById('contact');
                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="svc-btn-secondary"
              id="svc-final-contact-btn"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Contact AVS</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
