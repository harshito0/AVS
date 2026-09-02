import React, { useEffect } from 'react';

export default function PackagesPage({ onBookClick }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="packages-page-wrapper">
      <main className="packages-page-hero" id="packages-main" aria-label="Aura Vital Star Signature Packages">
        {/* Subtle Ambient Background Texture & Waves */}
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
                <span className="packages-eyebrow">PACKAGES</span>
              </div>

              <h1 className="packages-headline">
                Curated experiences,<br />
                <span className="packages-headline-italic">coming soon.</span>
              </h1>

              <div className="packages-gold-divider" aria-hidden="true"></div>

              <p className="packages-copy-primary">
                We’re thoughtfully preparing a collection of signature packages designed around your beauty, wellness and care journey.
              </p>

              <p className="packages-copy-secondary">
                Something exceptional is on its way.
              </p>

              <div className="packages-action-row">
                <a
                  href="#contact"
                  onClick={onBookClick}
                  className="packages-btn-book"
                  id="packages-cta-btn"
                >
                  <span>Book an Appointment</span>
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              <div className="packages-refined-footer-badge">
                <span className="packages-badge-status">COMING SOON</span>
                <span className="packages-badge-detail">
                  Signature experiences <span className="packages-badge-bullet">&bull;</span> Thoughtfully curated
                </span>
              </div>
            </div>

            {/* Visual Lifestyle Image Column */}
            <div className="packages-visual-col">
              <div className="packages-visual-frame">
                <img loading="lazy" decoding="async" src="/hero_relaxation.webp"
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
    </div>
  );
}
