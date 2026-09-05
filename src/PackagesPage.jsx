import React, { useState, useEffect } from 'react';
import './packages.css';

const DEFAULT_FALLBACK_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Rejuvenation Express',
    category: 'Complete Wellness',
    sessions: 2,
    price: 180,
    originalPrice: 225,
    discount: 20,
    status: 'Active',
    description: 'A deeply restorative journey combining 60-min therapeutic massage with our signature glowing facial ritual.',
    servicesIncluded: ['Therapeutic Body Massage', 'Radiance Hydra Facial'],
    imageUrl: '/hero_relaxation.webp'
  },
  {
    id: 'pkg-2',
    name: 'The Ultimate Glow Retreat',
    category: 'Beauty & Rejuvenation',
    sessions: 3,
    price: 290,
    originalPrice: 380,
    discount: 24,
    status: 'Active',
    description: 'Comprehensive luxury beauty makeover featuring organic deep facial, scalp detox, and full-body botanical polish.',
    servicesIncluded: ['Organic Spa Facial', 'Scalp Detox & Hair Spa', 'Body Polishing Ritual'],
    imageUrl: '/brand_editorial.webp'
  },
  {
    id: 'pkg-3',
    name: 'AVS Sanctuary Couples Immersion',
    category: 'Special Experiences',
    sessions: 1,
    price: 340,
    originalPrice: 420,
    discount: 19,
    status: 'Active',
    description: 'Side-by-side couples massage in our candlelit private suite with hot stones, champagne tea, and aromatherapy.',
    servicesIncluded: ['Couples Full-Body Massage', 'Volcanic Basalt Hot Stones', 'Herbal Foot Soak'],
    imageUrl: '/svc_couple_retreat.webp'
  }
];

export default function PackagesPage({ onBookClick }) {
  const [packages, setPackages] = useState(DEFAULT_FALLBACK_PACKAGES);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Fetch dynamic packages configured in CRM CMS
    fetch('/api/packages')
      .then((res) => res.json())
      .then((result) => {
        const data = Array.isArray(result) ? result : (result?.data || []);
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        }
      })
      .catch((err) => console.warn('Failed to load dynamic packages:', err));
  }, []);

  const handleBook = (e, pkgTitle) => {
    if (onBookClick) {
      onBookClick(e, `Package - ${pkgTitle}`);
    }
  };

  return (
    <div className="packages-page-wrapper">
      {/* ========================================================
          1. EDITORIAL HERO SECTION
          ======================================================== */}
      <main className="packages-page-hero" id="packages-main" aria-label="Aura Vital Star Signature Packages">
        <div className="packages-bg-ambient" aria-hidden="true">
          <div className="packages-ambient-glow"></div>
          <svg className="packages-bg-wave" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
            <path
              d="M0,450 C320,380 600,520 960,420 C1240,340 1380,440 1440,390"
              stroke="rgba(196, 154, 60, 0.12)"
              strokeWidth="1.2"
            />
            <path
              d="M0,490 C360,420 640,560 1000,460 C1260,380 1390,470 1440,430"
              stroke="rgba(196, 154, 60, 0.08)"
              strokeWidth="0.8"
            />
          </svg>
          <div className="packages-watermark-lotus">
            <svg viewBox="0 0 64 64" width="400" height="400" fill="none">
              <path d="M32 6 C32 6 20 20 20 36 C20 46 25 52 32 54 C39 52 44 46 44 36 C44 20 32 6 32 6Z" fill="#C49A3C" opacity="0.03" />
              <path d="M20 22 C12 19 4 27 4 37 C6 47 13 50 21 50" stroke="#C49A3C" strokeWidth="1" opacity="0.035" />
              <path d="M44 22 C52 19 60 27 60 37 C58 47 51 50 43 50" stroke="#C49A3C" strokeWidth="1" opacity="0.035" />
            </svg>
          </div>
        </div>

        <div className="packages-container">
          <div className="packages-split-grid">
            {/* Content Column */}
            <div className="packages-content-col">
              <div className="packages-eyebrow-line">
                <span className="packages-eyebrow-dash" aria-hidden="true"></span>
                <span className="packages-eyebrow">SIGNATURE PACKAGES</span>
              </div>

              <h1 className="packages-headline">
                Curated wellness journeys,<br />
                <span className="packages-headline-italic">crafted for you.</span>
              </h1>

              <div className="packages-gold-divider" aria-hidden="true"></div>

              <p className="packages-copy-primary">
                Explore our thoughtfully assembled collection of multi-treatment bundles. Each package harmoniously blends restorative therapy, aesthetic care, and clinical rejuvenation for complete harmony and exceptional value.
              </p>

              <p className="packages-copy-secondary">
                Tailored care &bull; Unhurried peace &bull; Lasting renewal
              </p>

              <div className="packages-action-row">
                <a
                  href="#packages-catalog"
                  className="packages-btn-book"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('packages-catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Packages</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="packages-refined-footer-badge">
                <span className="packages-badge-status">AVS CURATED</span>
                <span className="packages-badge-detail">
                  Brampton &bull; Mississauga <span className="packages-badge-bullet">&bull;</span> RMT Insurance Covered Options
                </span>
              </div>
            </div>

            {/* Visual Column */}
            <div className="packages-visual-col">
              <div className="packages-visual-frame">
                <img
                  loading="lazy"
                  decoding="async"
                  src="/hero_relaxation.webp"
                  alt="Aura Vital Star signature wellness packages ambiance"
                  className="packages-editorial-img"
                />
                <div className="packages-visual-overlay" aria-hidden="true"></div>
                <div className="packages-visual-border" aria-hidden="true"></div>
                <div className="packages-monogram-tag" aria-hidden="true">
                  <span className="monogram-initials">AVS</span>
                  <span className="monogram-divider"></span>
                  <span className="monogram-label">RELAXATION &bull; RENEWAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================
          2. DYNAMIC PACKAGES CATALOG SECTION (REAL-TIME CRM LINKED)
          ======================================================== */}
      <section className="packages-catalog-section" id="packages-catalog" aria-label="Available signature packages">
        <div className="packages-catalog-container">
          <div className="packages-catalog-header">
            <span className="packages-catalog-eyebrow">Curated Wellness Journeys</span>
            <h2 className="packages-catalog-title">Signature Treatment Packages</h2>
            <p className="packages-catalog-subtitle">
              Combine our most complementary treatments for maximum restorative effect and preferred package pricing.
            </p>
          </div>

          <div className="packages-cards-grid">
            {packages.map((pkg) => (
              <article key={pkg.id} className="package-card">
                <div>
                  <div className="package-card-img-wrap">
                    <img
                      src={pkg.imageUrl || '/hero_relaxation.webp'}
                      alt={pkg.name}
                      className="package-card-img"
                      loading="lazy"
                    />
                    <div className="package-card-img-overlay" aria-hidden="true"></div>
                    <span className="package-card-category">{pkg.category || 'Wellness'}</span>
                    {pkg.discount > 0 && (
                      <span className="package-card-discount">SAVE {pkg.discount}%</span>
                    )}
                  </div>

                  <div className="package-card-content">
                    <span className="package-card-sessions">
                      {pkg.sessions} {pkg.sessions > 1 ? 'Sessions Included' : 'Session Included'}
                    </span>
                    <h3 className="package-card-title">{pkg.name}</h3>
                    <p className="package-card-desc">{pkg.description}</p>

                    {Array.isArray(pkg.servicesIncluded) && pkg.servicesIncluded.length > 0 && (
                      <div className="package-inclusions-block">
                        <div className="package-inclusions-label">Treatments Included:</div>
                        <ul className="package-inclusions-list">
                          {pkg.servicesIncluded.map((serviceName, idx) => (
                            <li key={idx} className="package-inclusion-item">
                              <span className="package-inclusion-icon">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                              <span>{typeof serviceName === 'string' ? serviceName : serviceName.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="package-card-content" style={{ paddingTop: 0 }}>
                  <div className="package-card-footer">
                    <div className="package-pricing">
                      <div className="package-price-row">
                        <span className="package-price-main">${pkg.price.toFixed(2)}</span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="package-price-original">${pkg.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                      <span className="package-price-note">+ applicable tax</span>
                    </div>

                    <button
                      className="package-book-btn"
                      onClick={(e) => handleBook(e, pkg.name)}
                    >
                      <span>Book Package</span>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
