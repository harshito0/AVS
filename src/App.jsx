import { useEffect, useState, useRef, lazy, Suspense } from 'react';

const PackagesPage = lazy(() => import('./PackagesPage'));
const AboutPage = lazy(() => import('./AboutPage'));
const BookingPage = lazy(() => import('./BookingPage'));
const SalonPage = lazy(() => import('./SalonPage'));
const RMTPage = lazy(() => import('./RMTPage'));
const ServicesPage = lazy(() => import('./ServicesPage'));
const GalleryPage = lazy(() => import('./GalleryPage'));
const ContactPage = lazy(() => import('./ContactPage'));

const announceItems = [
  '⭐ New Client Offer: Get 15% Off on Your First Visit',
  '◆ Free Consultation for Orthotics',
  '◆ Wellness Packages Starting at $99',
  '◆ Gift Cards Available'
];

const navLinks = [
  { href: '/', path: '/', page: 'home', label: 'HOME' },
  { href: '/salon', path: '/salon', page: 'salon', label: 'SALON' },
  { href: '/rmt', path: '/rmt', page: 'rmt', label: 'RMT' },
  { href: '/services', path: '/services', page: 'services', label: 'SERVICES' },
  { href: '/packages', path: '/packages', page: 'packages', label: 'PACKAGES' },
  { href: '/about', path: '/about', page: 'about', label: 'ABOUT AVS' },
  { href: '/gallery', path: '/gallery', page: 'gallery', label: 'GALLERY' },
  { href: '/contact', path: '/contact', page: 'contact', label: 'CONTACT' }
];

const heroSlides = [
  {
    label: 'AURA VITAL STAR',
    image: '/hero_brand_bg.webp',
    alt: 'Aura Vital Star Rejuvenation Centre',
    brand: true,
    className: 'slide-brand'
  },
  {
    label: 'FACIAL TREATMENTS',
    image: '/hero_facial.webp',
    alt: 'Facial Treatments at Aura Vital Star',
    title: 'FACIAL\nTREATMENTS',
    subtitle: 'Revealing brighter,\nhealthier, glowing skin.'
  },
  {
    label: 'MASSAGE THERAPY',
    image: '/hero_massage.webp',
    alt: 'Massage Therapy at Aura Vital Star',
    title: 'MASSAGE\nTHERAPY',
    subtitle: 'Relax. Rejuvenate.\nRestore your natural balance and inner peace.'
  },
  {
    label: 'ORTHOTICS & COMPRESSION',
    image: '/hero_orthotics2.webp',
    alt: 'Orthotics and Compression at Aura Vital Star',
    title: 'ORTHOTICS &\nCOMPRESSION',
    subtitle: 'Support. Comfort.\nMove with confidence.\n<small>Custom orthotics solutions for pain relief and better movement.</small>'
  },
  {
    label: 'WELLNESS RITUALS',
    image: '/hero_wellness.webp',
    alt: 'Wellness Rituals at Aura Vital Star',
    title: 'WELLNESS\nRITUALS',
    subtitle: 'Mind. Body. Soul.\nBalanced beautifully.\n<small>Experience rituals designed to restore your inner harmony.</small>'
  },
  {
    label: 'RELAXATION PACKAGES',
    image: '/hero_relaxation.webp',
    alt: 'Relaxation Packages at Aura Vital Star',
    title: 'RELAXATION\nPACKAGES',
    subtitle: 'Curated packages for\ncomplete relaxation.'
  }
];

const whyPillars = [
  { title: 'RMT Certified', desc: 'Registered Massage Professionals you can trust.', icon: 'check' },
  { title: 'Expert Team', desc: 'Skilled professionals dedicated to your care.', icon: 'person' },
  { title: 'Personalized Care', desc: 'Solutions designed around your needs.', icon: 'heart' },
  { title: 'Safe & Hygienic', desc: 'Top standards of cleanliness and safety always.', icon: 'shield' },
  { title: 'Premium Experience', desc: 'Luxury, comfort and results you deserve.', icon: 'star' }
];

const services = [
  { title: 'Massage Therapy', desc: 'Relax. Rejuvenate. Professionals you can trust.', image: '/salon_bg.webp', icon: 'massage' },
  { title: 'Facial Treatments', desc: 'Revealing brighter, healthier, glowing skin.', image: '/brand_editorial.webp', icon: 'facial' },
  { title: 'Body Treatments', desc: 'Detox. Nourish. Revive your natural glow.', image: '/hero_bg.webp', icon: 'body' },
  { title: 'Hair Removal', desc: 'Smooth. Confident. Long-lasting results.', image: '/hero_facial.webp', icon: 'hair' },
  { title: 'Relaxation Packages', desc: 'Curated packages for complete relaxation.', image: '/hero_relaxation.webp', icon: 'relax' },
  { title: 'Wellness Rituals', desc: 'Mind. Body. Soul. Balanced beautifully.', image: '/hero_wellness.webp', icon: 'wellness' },
  { title: 'Orthotics & Compression Socks', desc: 'Custom support. Better movement.', image: '/hero_orthotics2.webp', icon: 'orthotics' }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 't-1',
    quote: 'The massage was incredible! I felt relaxed and recharged.',
    author: 'Priya M.',
    service: 'Registered Massage Therapy',
    rating: 5,
    avatar: 'PM'
  },
  {
    id: 't-2',
    quote: 'Amazing facial treatment. My skin has never felt this good.',
    author: 'Neha R.',
    service: 'Aesthetic & Skin Therapy',
    rating: 5,
    avatar: 'NR'
  },
  {
    id: 't-3',
    quote: 'The orthotics have made a huge difference in my daily comfort.',
    author: 'Arjun S.',
    service: 'Custom Orthotics Care',
    rating: 5,
    avatar: 'AS'
  }
];

function Icon({ name, width = 28, height = 28 }) {
  const pillarProps = { width, height, viewBox: '0 0 56 56', fill: 'none' };
  const serviceProps = { width, height, viewBox: '0 0 32 32', fill: 'none' };

  switch (name) {
    case 'check':
      return (
        <svg {...pillarProps}>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#c49a3c" strokeWidth="1.4" />
          <path d="M18 28l7 7 13-14" stroke="#c49a3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'person':
      return (
        <svg {...pillarProps}>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#c49a3c" strokeWidth="1.4" />
          <circle cx="28" cy="22" r="6" stroke="#c49a3c" strokeWidth="1.6" />
          <path d="M16 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#c49a3c" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...pillarProps}>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#c49a3c" strokeWidth="1.4" />
          <path d="M28 16 C28 16 20 20 20 27 C20 31 23 34 28 35 C33 34 36 31 36 27 C36 20 28 16 28 16Z" stroke="#c49a3c" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M24 27l3 3 6-6" stroke="#c49a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...pillarProps}>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#c49a3c" strokeWidth="1.4" />
          <path d="M28 14 C28 14 34 20 34 30 C34 36 31 39 28 40 C25 39 22 36 22 30 C22 20 28 14 28 14Z" stroke="#c49a3c" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M28 26v8" stroke="#c49a3c" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'star':
      return (
        <svg {...pillarProps}>
          <rect x="4" y="4" width="48" height="48" rx="24" stroke="#c49a3c" strokeWidth="1.4" />
          <polygon points="28,16 31,23 39,23 33,28 35,36 28,31 21,36 23,28 17,23 25,23" stroke="#c49a3c" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        </svg>
      );
    case 'massage':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28"> 
          <path d="M16 4C10 4 6 9 6 14c0 4 2 7 5 9l1 5h8l1-5c3-2 5-5 5-9 0-5-4-10-10-10z" stroke="#c49a3c" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
        </svg>
      );
    case 'facial':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <circle cx="16" cy="16" r="10" stroke="#c49a3c" strokeWidth="1.4"/>
          <path d="M12 14c1-3 7-3 8 0" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
          <circle cx="12" cy="18" r="1" fill="#c49a3c"/>
          <circle cx="20" cy="18" r="1" fill="#c49a3c"/>
        </svg>
      );
    case 'body':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <path d="M16 6c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" stroke="#c49a3c" strokeWidth="1.4"/>
          <path d="M10 16c2 3 10 3 12 0" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    case 'hair':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <path d="M10 6l3 20M16 6l3 20M22 6l3 20" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
          <path d="M8 14h16" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    case 'relax':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <circle cx="16" cy="12" r="5" stroke="#c49a3c" strokeWidth="1.4"/>
          <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    case 'wellness':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <path d="M16 4c0 0-8 6-8 13a8 8 0 0016 0C24 10 16 4 16 4z" stroke="#c49a3c" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
          <path d="M12 20c1.5 2 6.5 2 8 0" stroke="#c49a3c" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      );
    case 'orthotics':
      return (
        <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
          <path d="M6 22 C6 18 10 12 16 10 C22 8 26 12 26 16 C26 20 22 24 18 25 L8 25 Z" stroke="#c49a3c" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
        </svg>
      );
    default:
      return null;
  }
}

function App() {
  const parseLocation = () => {
    if (typeof window === 'undefined') return 'home';

    const hash = window.location.hash;
    const pathname = window.location.pathname;
    const search = window.location.search;

    // Detect and sanitize any dirty combined URLs like /services#about -> /about
    if (hash === '#about' || hash === '#/about') {
      if (pathname !== '/about' || hash) window.history.replaceState(null, '', '/about');
      return 'about';
    }
    if (hash === '#services' || hash === '#/services') {
      if (pathname !== '/services' || hash) window.history.replaceState(null, '', '/services');
      return 'services';
    }
    if (hash === '#salon' || hash === '#/salon') {
      if (pathname !== '/salon' || hash) window.history.replaceState(null, '', '/salon');
      return 'salon';
    }
    if (hash === '#rmt' || hash === '#/rmt') {
      if (pathname !== '/rmt' || hash) window.history.replaceState(null, '', '/rmt');
      return 'rmt';
    }
    if (hash === '#packages' || hash === '#/packages') {
      if (pathname !== '/packages' || hash) window.history.replaceState(null, '', '/packages');
      return 'packages';
    }
    if (hash === '#gallery' || hash === '#/gallery') {
      if (pathname !== '/gallery' || hash) window.history.replaceState(null, '', '/gallery');
      return 'gallery';
    }
    if (hash === '#booking' || hash === '#/booking' || search.includes('source=qr') || search.includes('page=booking')) {
      return 'booking';
    }
    if (hash === '#contact' || hash === '#/contact') {
      if (pathname !== '/contact' || hash) window.history.replaceState(null, '', '/contact');
      return 'contact';
    }
    if (hash === '#home' || hash === '#/home') {
      if (pathname !== '/' || hash) window.history.replaceState(null, '', '/');
      return 'home';
    }

    // Clean path-based routing
    if (pathname === '/about' || pathname.startsWith('/about')) return 'about';
    if (pathname === '/services' || pathname.startsWith('/services')) return 'services';
    if (pathname === '/salon' || pathname.startsWith('/salon')) return 'salon';
    if (pathname === '/rmt' || pathname.startsWith('/rmt')) return 'rmt';
    if (pathname === '/packages' || pathname.startsWith('/packages')) return 'packages';
    if (pathname === '/gallery' || pathname.startsWith('/gallery')) return 'gallery';
    if (pathname === '/contact' || pathname.startsWith('/contact')) return 'contact';
    if (pathname === '/booking' || pathname.startsWith('/booking')) return 'booking';

    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(() => parseLocation());
  const currentPageRef = useRef(currentPage);
  const [loadedSlideCount, setLoadedSlideCount] = useState(1);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Progressive slide loader: only load slide 1 initially, defer slides 2-6 until idle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const id = window.requestIdleCallback(() => {
          setLoadedSlideCount(heroSlides.length);
        }, { timeout: 3000 });
        return () => window.cancelIdleCallback(id);
      } else {
        const t = setTimeout(() => {
          setLoadedSlideCount(heroSlides.length);
        }, 2000);
        return () => clearTimeout(t);
      }
    }
  }, []);

  const handleNavClick = (e, target) => {
    if (e && e.preventDefault) e.preventDefault();
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    const page = typeof target === 'string' ? target.replace(/^[/#]+/, '') : target?.page;

    const navigateTo = (targetPage, targetPath) => {
      window.history.pushState(null, '', targetPath);
      setCurrentPage(targetPage);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    if (page === 'services') {
      navigateTo('services', '/services');
    } else if (page === 'salon') {
      navigateTo('salon', '/salon');
    } else if (page === 'rmt') {
      navigateTo('rmt', '/rmt');
    } else if (page === 'packages') {
      navigateTo('packages', '/packages');
    } else if (page === 'about') {
      navigateTo('about', '/about');
    } else if (page === 'gallery') {
      navigateTo('gallery', '/gallery');
    } else if (page === 'booking') {
      handleBookRedirect(e, 'Navigation Menu');
    } else if (page === 'contact') {
      navigateTo('contact', '/contact');
    } else {
      // Home
      window.history.pushState(null, '', '/');
      if (currentPageRef.current !== 'home') {
        setCurrentPage('home');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalSource, setBookingModalSource] = useState('Website CTA');

  const handleBookRedirect = (e, source = 'Website CTA') => {
    if (e) e.preventDefault();
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
    setBookingModalSource(source);
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      const page = parseLocation();
      setCurrentPage(page);
      if (window.location.hash === '#contact') {
        setTimeout(() => {
          const target = document.querySelector('#contact');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const [announceIndex, setAnnounceIndex] = useState(0);
  const [prevAnnounceIndex, setPrevAnnounceIndex] = useState(null);
  const overlapMs = 700; // crossfade overlap duration

  const handleBrandWave = (event) => {
    if (window.innerWidth < 992) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const shiftX = ((x - 50) / 50) * 1.5;
    const shiftY = ((y - 50) / 50) * 1.5;

    event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
    event.currentTarget.style.setProperty('--wave-shift-x', `${shiftX.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--wave-shift-y', `${shiftY.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--wave-rotate', '0deg');
  };

  const resetBrandWave = (event) => {
    event.currentTarget.style.setProperty('--pointer-x', '50%');
    event.currentTarget.style.setProperty('--pointer-y', '50%');
    event.currentTarget.style.setProperty('--wave-shift-x', '0px');
    event.currentTarget.style.setProperty('--wave-shift-y', '0px');
    event.currentTarget.style.setProperty('--wave-rotate', '0deg');
  };

  const locationsRef = useRef(null);
  const [locationsVisible, setLocationsVisible] = useState(false);

  const handleCenterMouseMove = (event) => {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
    if (window.innerWidth < 992) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--loc-mouse-x', `${x.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--loc-mouse-y', `${y.toFixed(2)}px`);
  };

  const handleCenterMouseLeave = (event) => {
    event.currentTarget.style.setProperty('--loc-mouse-x', '0px');
    event.currentTarget.style.setProperty('--loc-mouse-y', '0px');
  };

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  const [whyMarqueePaused, setWhyMarqueePaused] = useState(false);
  const [testimonialsMarqueePaused, setTestimonialsMarqueePaused] = useState(false);
  const whyPauseTimerRef = useRef(null);
  const testimonialsPauseTimerRef = useRef(null);

  const handleWhyTouchStart = () => {
    if (whyPauseTimerRef.current) clearTimeout(whyPauseTimerRef.current);
    setWhyMarqueePaused(true);
  };

  const handleWhyTouchEnd = () => {
    if (whyPauseTimerRef.current) clearTimeout(whyPauseTimerRef.current);
    whyPauseTimerRef.current = setTimeout(() => {
      setWhyMarqueePaused(false);
    }, 1500);
  };

  const handleTestimonialsTouchStart = () => {
    if (testimonialsPauseTimerRef.current) clearTimeout(testimonialsPauseTimerRef.current);
    setTestimonialsMarqueePaused(true);
  };

  const handleTestimonialsTouchEnd = () => {
    if (testimonialsPauseTimerRef.current) clearTimeout(testimonialsPauseTimerRef.current);
    testimonialsPauseTimerRef.current = setTimeout(() => {
      setTestimonialsMarqueePaused(false);
    }, 1500);
  };

  const [clientReviews, setClientReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('avs_client_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved reviews:', e);
    }
    return INITIAL_TESTIMONIALS;
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    service: 'Registered Massage Therapy (RMT)',
    rating: 5,
    quote: ''
  });
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState('');
  const [reviewErrorMsg, setReviewErrorMsg] = useState('');

  // Fetch reviews from server on mount if available
  useEffect(() => {
    fetch('/api/reviews')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setClientReviews((prev) => {
            const map = new Map();
            data.reviews.forEach((r) => map.set(r.id || r.author, r));
            prev.forEach((r) => {
              if (!map.has(r.id || r.author)) {
                map.set(r.id || r.author, r);
              }
            });
            const merged = Array.from(map.values());
            try {
              localStorage.setItem('avs_client_reviews', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      })
      .catch(() => {
        // Local state & localStorage are fully active
      });
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewErrorMsg('');

    if (!reviewForm.name.trim()) {
      setReviewErrorMsg('Please enter your name.');
      return;
    }
    if (!reviewForm.quote.trim()) {
      setReviewErrorMsg('Please share a few words about your experience.');
      return;
    }

    setReviewSubmitting(true);

    const nameParts = reviewForm.name.trim().split(/\s+/);
    const avatar = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : reviewForm.name.trim().slice(0, 2).toUpperCase();

    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewForm.name.trim(),
      service: reviewForm.service || 'Holistic Wellness Care',
      rating: Number(reviewForm.rating) || 5,
      quote: reviewForm.quote.trim(),
      avatar,
      date: 'Just now',
      isNew: true
    };

    // 1. Immediately update UI state
    const updated = [newReview, ...clientReviews];
    setClientReviews(updated);

    // 2. Persist to localStorage
    try {
      localStorage.setItem('avs_client_reviews', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save review locally:', err);
    }

    // 3. Post to backend API
    try {
      fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewForm.name.trim(),
          service: reviewForm.service,
          rating: reviewForm.rating,
          quote: reviewForm.quote.trim()
        })
      }).catch(() => {});
    } catch (e) {}

    // Scroll horizontal track to newly added review at start
    setTimeout(() => {
      if (testimonialsSliderRef.current) {
        testimonialsSliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        checkSliderScroll();
      }
    }, 80);

    setReviewSuccessMsg('Thank you! Your review has been published.');
    setReviewForm({
      name: '',
      service: 'Registered Massage Therapy (RMT)',
      rating: 5,
      quote: ''
    });
    setReviewSubmitting(false);

    setTimeout(() => {
      setIsReviewModalOpen(false);
      setReviewSuccessMsg('');
    }, 2200);
  };

  const testimonialsSliderRef = useRef(null);
  const [sliderCanScrollLeft, setSliderCanScrollLeft] = useState(false);
  const [sliderCanScrollRight, setSliderCanScrollRight] = useState(false);
  const [sliderHasOverflow, setSliderHasOverflow] = useState(false);

  const checkSliderScroll = () => {
    if (!testimonialsSliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = testimonialsSliderRef.current;
    const hasOverflow = scrollWidth > clientWidth + 8;
    setSliderHasOverflow(hasOverflow);
    setSliderCanScrollLeft(scrollLeft > 6);
    setSliderCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    const el = testimonialsSliderRef.current;
    if (!el) return;
    checkSliderScroll();
    const handleScroll = () => checkSliderScroll();
    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [clientReviews]);

  const scrollTestimonialsLeft = () => {
    if (!testimonialsSliderRef.current) return;
    const card = testimonialsSliderRef.current.querySelector('.t-card');
    const scrollAmount = card ? card.offsetWidth + 24 : 370;
    testimonialsSliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  };

  const scrollTestimonialsRight = () => {
    if (!testimonialsSliderRef.current) return;
    const card = testimonialsSliderRef.current.querySelector('.t-card');
    const scrollAmount = card ? card.offsetWidth + 24 : 370;
    testimonialsSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus({ ok: false, msg: 'Please enter a valid email address.' });
      return;
    }
    setNewsletterStatus({ ok: true, msg: 'Thank you for subscribing to wellness updates!' });
    setNewsletterEmail('');
    setTimeout(() => setNewsletterStatus(null), 5000);
  };

  useEffect(() => {
    const locSection = locationsRef.current;
    if (!locSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLocationsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(locSection);

    let locTicking = false;
    const handleLocScroll = () => {
      if (!locTicking) {
        window.requestAnimationFrame(() => {
          if (locSection) {
            const rect = locSection.getBoundingClientRect();
            const windowH = window.innerHeight;
            if (rect.top < windowH && rect.bottom > 0) {
              const progress = (rect.top + rect.height / 2 - windowH / 2) / (windowH / 2);
              const shiftY = Math.max(-10, Math.min(10, -progress * 7));
              locSection.style.setProperty('--loc-scroll-y', `${shiftY}px`);
              locSection.style.setProperty('--loc-wave-shift', `${-progress * 14}px`);
            }
          }
          locTicking = false;
        });
        locTicking = true;
      }
    };

    window.addEventListener('scroll', handleLocScroll, { passive: true });
    handleLocScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleLocScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnnounceIndex((prev) => (prev + 1) % announceItems.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  // When announceIndex changes, mark the previous index for overlap then clear it
  useEffect(() => {
    let timeoutId;
    setPrevAnnounceIndex((prev) => {
      // prev here is previous prevAnnounceIndex; we want to set it to the previously active index
      return prev; // keep existing until we set below
    });

    // Determine previous index from announceIndex
    const previous = (announceIndex - 1 + announceItems.length) % announceItems.length;
    setPrevAnnounceIndex(previous);
    timeoutId = setTimeout(() => setPrevAnnounceIndex(null), overlapMs);

    return () => clearTimeout(timeoutId);
  }, [announceIndex]);

  useEffect(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 700);
    }

    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
      if (slides.length === 0) return;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      currentSlide = index;
    }

    function nextSlide() {
      goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlideShow() {
      stopSlideShow();
      slideInterval = setInterval(nextSlide, 4500);
    }

    function stopSlideShow() {
      if (slideInterval) clearInterval(slideInterval);
    }

    if (slides.length > 0) {
      dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const idx = Number(dot.getAttribute('data-idx'));
          goToSlide(idx);
          startSlideShow();
        });
      });

      const heroRight = document.querySelector('.hero-right');
      if (heroRight) {
        heroRight.addEventListener('mouseenter', stopSlideShow);
        heroRight.addEventListener('mouseleave', startSlideShow);
      }

      startSlideShow();
    }

    const carousel = document.getElementById('services-carousel');
    const svcPrev = document.getElementById('svc-prev');
    const svcNext = document.getElementById('svc-next');

    if (carousel && svcPrev && svcNext) {
      const cardWidth = 260;
      svcPrev.addEventListener('click', () => {
        carousel.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
      });
      svcNext.addEventListener('click', () => {
        carousel.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
      });
    }

    const navbar = document.getElementById('navbar');
    const navLinksGroup = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let navTicking = false;
    const handleScroll = () => {
      if (!navTicking) {
        window.requestAnimationFrame(() => {
          if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
          if (currentPageRef.current !== 'home') {
            navLinksGroup.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('data-page') === currentPageRef.current);
            });
            navTicking = false;
            return;
          }
          const scrollPos = window.scrollY + 140;
          sections.forEach((sec) => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
              navLinksGroup.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
          navTicking = false;
        });
        navTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-book');

    if (hamburger && mobileMenu) {
      const closeMobile = () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      };

      hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
      });

      if (mobileClose) mobileClose.addEventListener('click', closeMobile);
      mobileLinks.forEach((link) => link.addEventListener('click', closeMobile));
    }

    const tDots = document.querySelectorAll('.t-dot-sm');
    if (tDots.length > 0) {
      tDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          tDots.forEach((d) => d.classList.remove('active'));
          dot.classList.add('active');
        });
      });
    }

    const ctaForm = document.getElementById('cta-form');
    if (ctaForm) {
      ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('cta-name')?.value;
        const phone = document.getElementById('cta-phone')?.value;

        if (name || phone) {
          alert(`Thank you, ${name || 'valued client'}! We will contact you at ${phone || 'your number'} to confirm your appointment.`);
          ctaForm.reset();
        } else {
          alert('Please enter your name and phone number to book an appointment.');
        }
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const navLinksGroup = document.querySelectorAll('.nav-link');
    navLinksGroup.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
    });
  }, [currentPage]);

  return (
    <>
      <div id="loader" aria-hidden="true">
        <div className="loader-logo">
          <img className="avs-logo-img" src="/logoavs.webp" alt="Aura Vital Star logo" width="120" height="120" decoding="async" />
        </div>
      </div>

      <div className="announce-bar" id="announce-bar">
        <div className="announce-track-wrap">
          <div className="announce-track" id="announce-track" aria-live="polite" role="status">
            {announceItems.map((item, index) => (
              <span
                key={item}
                className={`announce-item ${index === announceIndex ? 'active' : ''} ${index === prevAnnounceIndex ? 'prev' : ''}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <nav id="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="nav-logo"
            aria-label="AVS Home"
          >
            <img className="nav-logo-img" src="/logoavs.webp" alt="Aura Vital Star" width="160" height="48" decoding="async" />
          </a>
          <ul className="nav-links" role="list">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <li key={link.page}>
                  <a
                    href={link.href}
                    data-page={link.page}
                    onClick={(e) => handleNavClick(e, link.page)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              handleBookRedirect(e);
            }}
            className="btn-book"
            id="nav-book-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            BOOK APPOINTMENT
          </a>
          <button className="nav-hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      <div className="mobile-menu" id="mobile-menu" aria-hidden="true">
        <button className="mobile-menu-close" id="mobile-close" aria-label="Close menu">&times;</button>
        <nav aria-label="Mobile navigation">
          <ul role="list">
            {navLinks.map((link) => {
              const isMobileActive = currentPage === link.page;
              return (
                <li key={link.page + '-mobile'}>
                  <a
                    href={link.href}
                    data-page={link.page}
                    onClick={(e) => handleNavClick(e, link.page)}
                    className={`mobile-link ${isMobileActive ? 'active' : ''}`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              handleBookRedirect(e);
            }}
            className="btn-book mobile-book"
          >
            BOOK APPOINTMENT
          </a>
        </nav>
      </div>

      <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="loader-logo"><img className="avs-logo-img" src="/logoavs.webp" alt="Loading..." width="100" height="100" /></div></div>}>
        {currentPage === 'booking' ? (
          <BookingPage
            onBackToHome={() => {
              window.history.pushState(null, '', '/');
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        ) : currentPage === 'salon' ? (
          <SalonPage
            onBookClick={handleBookRedirect}
            onBackToHome={() => {
              window.history.pushState(null, '', '/');
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          />
        ) : currentPage === 'rmt' ? (
          <RMTPage
            onBookClick={handleBookRedirect}
            onBackToHome={() => {
              window.history.pushState(null, '', '/');
              setCurrentPage('home');
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
            onNavClick={(e, href) => handleNavClick(e, href)}
          />
        ) : currentPage === 'packages' ? (
          <PackagesPage onBookClick={handleBookRedirect} />
        ) : currentPage === 'about' ? (
          <AboutPage onBookClick={handleBookRedirect} />
        ) : currentPage === 'services' ? (
          <ServicesPage
            onBookClick={handleBookRedirect}
            onNavClick={(e, href) => handleNavClick(e, href)}
          />
        ) : currentPage === 'gallery' ? (
          <GalleryPage
            onBookClick={handleBookRedirect}
            onNavClick={(e, href) => handleNavClick(e, href)}
          />
        ) : currentPage === 'contact' ? (
          <ContactPage
            onBookClick={handleBookRedirect}
            onNavClick={(e, href) => handleNavClick(e, href)}
          />
        ) : (
          <>
          <section id="home" className="hero" aria-labelledby="hero-heading">
        <div className="hero-left">
          <p className="hero-eyebrow reveal-item">Where Wellness Meets Radiance</p>
          <h1 className="hero-heading reveal-item" id="hero-heading">
            <span className="hero-line">Feel Better.</span>
            <span className="hero-line">Move Better.</span>
          </h1>
          <p className="hero-script reveal-item">Live Better.</p>
          <p className="hero-desc reveal-item">A premium destination for beauty, relaxation,<br />wellness and personalized orthotic care.</p>
          <div className="hero-badges reveal-item">
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.4C17.25 22.15 21 17.25 21 12V6L12 2z" stroke="#c49a3c" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#c49a3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div><strong>RMT</strong><span>Certified</span></div>
            </div>
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><circle cx="12" cy="8" r="4" stroke="#c49a3c" strokeWidth="1.5"/><path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#c49a3c" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <div><strong>Expert</strong><span>Care</span></div>
            </div>
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="#c49a3c" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              <div><strong>Premium</strong><span>Experience</span></div>
            </div>
            <div className="hero-badge">
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20"><path d="M12 22c0 0-8-4.5-8-11V5l8-3 8 3v6c0 6.5-8 11-8 11z" stroke="#c49a3c" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 12c1.5 2 3 3 5 3s3.5-1 5-3" stroke="#c49a3c" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <div><strong>Safe &amp;</strong><span>Hygienic</span></div>
            </div>
          </div>
          <div className="hero-ctas reveal-item">
            <a href="#about" className="btn-primary" id="hero-explore-btn">
              <span>Explore AVS</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a
              href="#booking"
              onClick={handleBookRedirect}
              className="btn-secondary"
              id="hero-book-btn"
            >
              <span>Book an Appointment</span>
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-slider" id="hero-slider">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.label}
                className={`hero-slide ${idx === 0 ? 'active' : ''} ${slide.className || ''}`}
                data-label={slide.label}
                onMouseMove={slide.brand ? handleBrandWave : undefined}
                onMouseLeave={slide.brand ? resetBrandWave : undefined}
              >
                <img
                  src={idx < loadedSlideCount ? slide.image : undefined}
                  alt={slide.alt}
                  width="1600"
                  height="900"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                />
                {slide.brand ? (
                  <div className="hero-brand-emblem-wrap">
                    <div className="hero-brand-glow"></div>
                    <img className="hero-brand-logo-img" src="/logoavs.webp" alt="Aura Vital Star Logo" width="180" height="60" fetchPriority="high" />
                  </div>
                ) : (
                  <div className="slide-info-panel">
                    <h2 className="slide-title" dangerouslySetInnerHTML={{__html: slide.title.replace(/\n/g, '<br>')}} />
                    <div className="slide-divider"></div>
                    <p className="slide-sub" dangerouslySetInnerHTML={{__html: slide.subtitle.replace(/\n/g, '<br>')}}></p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hero-dots" id="hero-dots">
            {heroSlides.map((slide, idx) => (
              <button key={slide.label + '-dot'} className={`hero-dot ${idx === 0 ? 'active' : ''}`} data-idx={idx} aria-label={slide.label}></button>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="why-avs" aria-labelledby="why-heading">
        <span id="rmt" className="section-anchor"></span>
        <div className="container">
          <p className="section-eyebrow reveal-up">Experience the Difference</p>
          <h2 className="why-heading reveal-up" id="why-heading">Why Choose AVS?</h2>
          <div className="why-divider reveal-up">
            <svg viewBox="0 0 80 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="14">
              <line x1="0" y1="7" x2="30" y2="7" stroke="#c49a3c" strokeWidth="1"/>
              <circle cx="40" cy="7" r="4" stroke="#c49a3c" strokeWidth="1.2"/>
              <line x1="50" y1="7" x2="80" y2="7" stroke="#c49a3c" strokeWidth="1"/>
            </svg>
          </div>
          <div className="why-pillars-marquee-wrap">
            <div
              className={`why-marquee-track ${whyMarqueePaused ? 'is-paused' : ''}`}
              onTouchStart={handleWhyTouchStart}
              onTouchEnd={handleWhyTouchEnd}
            >
              <div className="why-pillars">
                {whyPillars.map((pillar) => (
                  <div className="why-pillar reveal-up" key={pillar.title} id={pillar.title === 'RMT Certified' ? 'rmt' : undefined}>
                    <div className="why-icon"><Icon name={pillar.icon} width={48} height={48} /></div>
                    <h3 className="why-title">{pillar.title}</h3>
                    <p className="why-desc">{pillar.desc}</p>
                  </div>
                ))}
              </div>
              <div className="why-pillars why-pillars--clone" aria-hidden="true">
                {whyPillars.map((pillar, idx) => (
                  <div className="why-pillar" key={`why-clone-${pillar.title}-${idx}`}>
                    <div className="why-icon"><Icon name={pillar.icon} width={48} height={48} /></div>
                    <h3 className="why-title">{pillar.title}</h3>
                    <p className="why-desc">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services-section" aria-labelledby="services-heading">
        <span id="salon" className="section-anchor"></span>
        <div className="container">
          <h2 className="services-heading reveal-up" id="services-heading">Our Services</h2>
        </div>
        <div className="services-carousel-wrap">
          <button className="svc-arrow svc-prev" id="svc-prev" aria-label="Previous service">&#8249;</button>
          <div className="services-carousel" id="services-carousel">
            {services.map((service) => (
              <div className="svc-card" key={service.title} id={service.title === 'Orthotics & Compression Socks' ? 'orthotics' : undefined}>
                <div className="svc-card-img">
                  <img src={service.image} alt={service.title} width="400" height="260" loading="lazy" decoding="async" />
                  <div className="svc-card-icon"><Icon name={service.icon} /></div>
                </div>
                <div className="svc-card-body">
                  <h3 className="svc-name">{service.title}</h3>
                  <p className="svc-desc">{service.desc}</p>
                  <a href="#contact" className="svc-learn-btn">Learn More <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg></a>
                </div>
              </div>
            ))}
          </div>
          <button className="svc-arrow svc-next" id="svc-next" aria-label="Next service">&#8250;</button>
        </div>
      </section>

      <section
        ref={locationsRef}
        className={`locations-section ${locationsVisible ? 'in-view' : ''}`}
        id="locations"
        aria-labelledby="locations-heading"
      >
        <div className="locations-bg-waves" aria-hidden="true">
          <svg className="locations-wave-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,96C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="rgba(197, 154, 63, 0.035)"
            />
            <path
              d="M0,192L48,181.3C96,171,192,149,288,154.7C384,160,480,192,576,197.3C672,203,768,181,864,160C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="rgba(16, 44, 34, 0.025)"
            />
          </svg>
        </div>

        <div className="locations-heading-wrap">
          <h2 className="locations-heading" id="locations-heading">Two Locations. One Promise.</h2>
          <div className="locations-heading-line" aria-hidden="true"></div>
        </div>

        <div className="locations-grid">
          <div className="location-card card-left">
            <div className="location-pin">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#c49a3c"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>
              Brampton
            </div>
            <address className="location-addr">157 Queen Street West,<br />Brampton, ON L6Y 1P9</address>
            <a href="https://maps.google.com/?q=157+Queen+Street+West+Brampton+ON" target="_blank" rel="noopener noreferrer" className="location-btn" id="loc-directions-btn">
              <span>Directions</span>
              <span className="loc-btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div
            className="location-center"
            onMouseMove={handleCenterMouseMove}
            onMouseLeave={handleCenterMouseLeave}
          >
            <div className="location-particles" aria-hidden="true">
              {[...Array(8)].map((_, i) => (
                <span key={i} className={`location-particle p-${i + 1}`}></span>
              ))}
            </div>
            <div className="location-center-img">
              <img src="/promise_bg.jpg" alt="Aura Vital Star Rejuvenation Centre" />
              <div className="location-center-overlay"></div>
              <div className="location-lotus-badge" title="Aura Vital Star Lotus Emblem">
                <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
                  <circle cx="30" cy="30" r="28" stroke="#c49a3c" strokeWidth="1.2"/>
                  <path d="M30 16 C30 16 22 22 22 29 C22 33 25 36 30 37 C35 36 38 33 38 29 C38 22 30 16 30 16Z" fill="#c49a3c" opacity="0.8"/>
                  <path d="M22 22 C18 20 15 22 14 26 C15 30 18 32 22 32" stroke="#c49a3c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  <path d="M38 22 C42 20 45 22 46 26 C45 30 42 32 38 32" stroke="#c49a3c" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="location-card card-right">
            <div className="location-pin">
              <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#c49a3c"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg>
              Mississauga
            </div>
            <p className="location-coming">Coming Soon</p>
            <a href="#contact" className="location-btn location-btn-outline" id="loc-learn-btn">
              <span>Learn More</span>
              <span className="loc-btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section id="gallery" className="avs-promise" aria-labelledby="promise-heading">
        <div className="promise-bg" style={{ backgroundImage: "url('/promise_bg.jpg')" }}></div>
        <div className="promise-overlay-dark"></div>
        <div className="promise-content">
          <div className="promise-text">
            <p className="section-eyebrow section-eyebrow--light reveal-up">The AVS Promise</p>
            <h2 className="promise-heading reveal-up" id="promise-heading">Your Wellness Is Our Priority.</h2>
            <p className="promise-body reveal-up">Experience the perfect blend of luxury, care and personalized solutions designed to help you look, feel and move better every day.</p>
            <a
              href="#booking"
              onClick={handleBookRedirect}
              className="btn-primary btn-gold reveal-up"
              id="promise-book-btn"
            >
              <span>Book Your Appointment</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="promise-img-side">
            <img src="/brand_editorial.jpg" alt="Wellness at Aura Vital Star" />
          </div>
        </div>
      </section>

      <section className="testimonials" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="testimonials-header-wrap">
            <span className="testimonials-eyebrow reveal-up">Client Experiences</span>
            <h2 className="testimonials-heading reveal-up" id="testimonials-heading">What Our Clients Say</h2>
            <p className="testimonials-subheading reveal-up">Refined care and lasting rejuvenation, shared by those who experience Aura Vital Star.</p>
            <div className="testimonials-cta-wrap reveal-up">
              <button 
                type="button" 
                className="btn-open-review-modal"
                onClick={() => {
                  setReviewErrorMsg('');
                  setReviewSuccessMsg('');
                  setIsReviewModalOpen(true);
                }}
                id="btn-write-review"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <span>Write a Review</span>
              </button>
            </div>
          </div>
          <div className="testimonials-slider-wrapper reveal-up">
            <button
              type="button"
              className={`t-slider-arrow t-slider-prev ${!sliderCanScrollLeft ? 'is-disabled' : ''}`}
              onClick={scrollTestimonialsLeft}
              disabled={!sliderCanScrollLeft}
              aria-label="Previous reviews"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            <div
              className="testimonials-slider-track"
              ref={testimonialsSliderRef}
              role="region"
              aria-label="Client reviews carousel"
              tabIndex={0}
            >
              {clientReviews.map((testimonial) => (
                <div className={`t-card ${testimonial.isNew ? 't-card--highlight' : ''}`} key={testimonial.id || testimonial.author}>
                  <div className="t-card-top">
                    <div className="t-quote-badge" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    <div className="t-stars" aria-label={`${testimonial.rating || 5} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`t-star-icon ${star <= (testimonial.rating || 5) ? 'is-active' : 'is-inactive'}`} 
                          width="15" 
                          height="15" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path d="M10 1.2l2.47 5.01 5.53.8-4 3.9 0.94 5.51L10 13.82 5.06 16.42 6 10.91 2 7.01l5.53-.8L10 1.2z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="t-quote">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="t-author-row">
                    <div className="t-author-avatar" aria-hidden="true">
                      {testimonial.avatar || 'AV'}
                    </div>
                    <div className="t-author-meta">
                      <div className="t-name-row">
                        <span className="t-name">{testimonial.author}</span>
                        <span className="t-verified-tag">
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.78 4.22a.75.75 0 010 1.06l-6.5 6.5a.75.75 0 01-1.06 0l-3.25-3.25a.75.75 0 111.06-1.06L6.5 10.19l5.97-5.97a.75.75 0 011.06 0z"/>
                          </svg>
                          Verified
                        </span>
                      </div>
                      <span className="t-service">{testimonial.service}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={`t-slider-arrow t-slider-next ${!sliderCanScrollRight ? 'is-disabled' : ''}`}
              onClick={scrollTestimonialsRight}
              disabled={!sliderCanScrollRight}
              aria-label="Next reviews"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
          <div className="t-trust-pill reveal-up">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="#C59A3F" aria-hidden="true">
              <path d="M10 1.2l2.47 5.01 5.53.8-4 3.9 0.94 5.51L10 13.82 5.06 16.42 6 10.91 2 7.01l5.53-.8L10 1.2z"/>
            </svg>
            <span className="t-trust-score">5.0 Star Experience</span>
            <span className="t-trust-sep" aria-hidden="true">&bull;</span>
            <span className="t-trust-label">100% Verified Client Feedback</span>
          </div>
        </div>
      </section>

      {/* Luxury Review Submission Modal */}
      {isReviewModalOpen && (
        <div 
          className="review-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsReviewModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-review-title"
        >
          <div className="review-modal-container">
            <div className="review-modal-header">
              <div>
                <span className="review-modal-eyebrow">Client Feedback</span>
                <h3 className="review-modal-title" id="modal-review-title">Share Your Experience</h3>
                <p className="review-modal-sub">Tell us about your visit to Aura Vital Star.</p>
              </div>
              <button 
                type="button" 
                className="review-modal-close" 
                onClick={() => setIsReviewModalOpen(false)}
                aria-label="Close review dialog"
              >
                &times;
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="review-success-panel">
                <div className="review-success-icon" aria-hidden="true">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C59A3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h4>Thank You!</h4>
                <p>{reviewSuccessMsg}</p>
              </div>
            ) : (
              <form className="review-modal-form" onSubmit={handleReviewSubmit}>
                {reviewErrorMsg && (
                  <div className="review-error-alert" role="alert">
                    {reviewErrorMsg}
                  </div>
                )}

                {/* Interactive Star Rating */}
                <div className="review-form-group">
                  <label className="review-form-label">
                    Rating <span className="req-star">*</span>
                  </label>
                  <div className="star-picker-wrap">
                    <div 
                      className="star-picker" 
                      onMouseLeave={() => setReviewHoverRating(0)}
                      role="radiogroup" 
                      aria-label="Rate from 1 to 5 stars"
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeRating = reviewHoverRating || reviewForm.rating;
                        const isFilled = star <= activeRating;
                        return (
                          <button
                            type="button"
                            key={star}
                            className={`star-picker-btn ${isFilled ? 'is-filled' : ''}`}
                            onMouseEnter={() => setReviewHoverRating(star)}
                            onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                            aria-label={`${star} star${star > 1 ? 's' : ''}`}
                          >
                            <svg width="28" height="28" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 1.2l2.47 5.01 5.53.8-4 3.9 0.94 5.51L10 13.82 5.06 16.42 6 10.91 2 7.01l5.53-.8L10 1.2z"/>
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                    <span className="star-rating-hint">
                      {(reviewHoverRating || reviewForm.rating) === 5 && '★★★★★ (5/5 — Exceptional)'}
                      {(reviewHoverRating || reviewForm.rating) === 4 && '★★★★☆ (4/5 — Very Good)'}
                      {(reviewHoverRating || reviewForm.rating) === 3 && '★★★☆☆ (3/5 — Good)'}
                      {(reviewHoverRating || reviewForm.rating) === 2 && '★★☆☆☆ (2/5 — Fair)'}
                      {(reviewHoverRating || reviewForm.rating) === 1 && '★☆☆☆☆ (1/5 — Needs Improvement)'}
                    </span>
                  </div>
                </div>

                {/* Client Name */}
                <div className="review-form-group">
                  <label htmlFor="review-author-name" className="review-form-label">
                    Your Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="review-author-name"
                    className="review-form-input"
                    placeholder="e.g. Eleanor Vance"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                    maxLength={50}
                    autoComplete="name"
                    required
                  />
                </div>

                {/* Service / Treatment */}
                <div className="review-form-group">
                  <label htmlFor="review-service-select" className="review-form-label">
                    Treatment / Service Received
                  </label>
                  <select
                    id="review-service-select"
                    className="review-form-select"
                    value={reviewForm.service}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, service: e.target.value }))}
                  >
                    <option value="Registered Massage Therapy (RMT)">Registered Massage Therapy (RMT)</option>
                    <option value="Aesthetic Skin Therapy & Facial">Aesthetic Skin Therapy & Facial</option>
                    <option value="Custom Orthotics & Foot Support">Custom Orthotics & Foot Support</option>
                    <option value="Hair & Luxury Salon Rituals">Hair & Luxury Salon Rituals</option>
                    <option value="Body Contouring & Holistic Wellness">Body Contouring & Holistic Wellness</option>
                    <option value="Wellness Consultation">Wellness Consultation</option>
                  </select>
                </div>

                {/* Review Quote / Feedback */}
                <div className="review-form-group">
                  <label htmlFor="review-quote-text" className="review-form-label">
                    Your Experience <span className="req-star">*</span>
                  </label>
                  <textarea
                    id="review-quote-text"
                    className="review-form-textarea"
                    rows="4"
                    placeholder="Describe how you felt, the staff care, the environment, and the results of your treatment..."
                    value={reviewForm.quote}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, quote: e.target.value }))}
                    maxLength={350}
                    required
                  ></textarea>
                  <span className="review-char-count">{reviewForm.quote.length} / 350 characters</span>
                </div>

                {/* Submit Button */}
                <div className="review-form-actions">
                  <button
                    type="button"
                    className="btn-review-cancel"
                    onClick={() => setIsReviewModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-review-submit"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? 'Posting...' : 'Post Your Review'}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <section id="blog" className="footer-cta" aria-labelledby="cta-heading">
        <div className="footer-cta-inner">
          <div className="footer-cta-text">
            <h2 className="footer-cta-heading" id="cta-heading">Your Wellness Journey<br />Starts Here.</h2>
            <p className="footer-cta-sub">Discover a more personalized approach to wellness.</p>
          </div>
          <div className="footer-cta-form-wrap">
            <form
              className="cta-form"
              id="cta-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleBookRedirect(e);
              }}
            >
              <div className="cta-inputs-row">
                <input type="text" className="cta-input" id="cta-name" placeholder="Your Name" autoComplete="name" />
                <input type="tel" className="cta-input" id="cta-phone" placeholder="Phone Number" autoComplete="tel" />
              </div>
              <button type="submit" className="btn-book-cta" id="cta-submit-btn">
                <span>Book an Appointment</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </form>
            <p className="cta-phone-line">or call us at <a href="tel:+16479875451">+1 647-987-5451</a></p>
          </div>
        </div>
      </section>
        </>
      )}
      </Suspense>

      <footer id="contact" className="footer-luxury" aria-label="Aura Vital Star Footer">
        {/* Top gold accent border line */}
        <div className="footer-top-accent-line" aria-hidden="true"></div>

        {/* Ambient background watermark & waves */}
        <div className="footer-bg-decor" aria-hidden="true">
          <div className="footer-watermark">AVS</div>
          <svg className="footer-wave-svg" viewBox="0 0 1440 360" fill="none" preserveAspectRatio="none">
            <path d="M0,280 C320,240 540,320 860,260 C1140,210 1320,290 1440,240" stroke="rgba(197, 154, 63, 0.16)" strokeWidth="1.2"/>
            <path d="M0,310 C340,270 600,340 920,280 C1200,230 1360,300 1440,270" stroke="rgba(197, 154, 63, 0.11)" strokeWidth="1"/>
            <path d="M0,250 C280,220 480,290 780,240 C1060,195 1280,260 1440,210" stroke="rgba(197, 154, 63, 0.08)" strokeWidth="0.8"/>
            <path d="M200,330 C450,290 700,360 1050,300 C1260,260 1380,310 1440,295" stroke="rgba(16, 44, 34, 0.035)" strokeWidth="1"/>
          </svg>
          <div className="footer-particles">
            {[...Array(6)].map((_, i) => (
              <span key={i} className={`footer-particle fp-${i + 1}`}></span>
            ))}
          </div>
        </div>

        <div className="footer-luxury-inner">
          <div className="footer-columns-grid">
            {/* Column 1: Brand */}
            <div className="footer-col footer-col-brand">
              <a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="footer-brand-logo-link"
                aria-label="Aura Vital Star Home"
              >
                <img className="footer-luxury-logo" src="/logoavs.webp" alt="Aura Vital Star logo" width="160" height="48" loading="lazy" decoding="async" />
              </a>
              <h3 className="footer-brand-tagline">
                Where Wellness<br />Meets Radiance
              </h3>
              <div className="footer-lotus-divider" aria-hidden="true">
                <span className="divider-gold-line"></span>
                <svg className="divider-lotus-svg" viewBox="0 0 32 20" width="22" height="14" fill="none">
                  <path d="M16 2 C16 2 11 7 11 12 C11 15 13 17 16 18 C19 17 21 15 21 12 C21 7 16 2 16 2Z" fill="#C49A3C" opacity="0.9"/>
                  <path d="M11 7 C8 6 5 8 4 11 C5 14 7 15 11 15" stroke="#C49A3C" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M21 7 C24 6 27 8 28 11 C27 14 25 15 21 15" stroke="#C49A3C" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className="divider-gold-line"></span>
              </div>
              <p className="footer-brand-desc">
                Rejuvenate your mind, body, and soul with our premium wellness solutions.
              </p>
              <div className="footer-social-wrap">
                <span className="footer-social-title">Follow Us</span>
                <div className="footer-social-icons">
                  <a
                    href="https://instagram.com/AuraVitalStar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label="Follow Aura Vital Star on Instagram"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7"/>
                      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7"/>
                      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com/AuraVitalStar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label="Follow Aura Vital Star on Facebook"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                  <a
                    href="#packages"
                    onClick={(e) => handleNavClick(e, '#packages')}
                    className="footer-social-btn"
                    aria-label="Aura Vital Star Wellness Experiences"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3 C12 3 8 7 8 12 C8 15 10 17 12 18 C14 17 16 15 16 12 C16 7 12 3 12 3Z" fill="currentColor" opacity="0.9"/>
                      <path d="M8 8 C5 7 2 9 2 12 C3 15 6 16 9 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M16 8 C19 7 22 9 22 12 C21 15 18 16 15 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Navigate */}
            <div className="footer-col footer-col-nav">
              <h4 className="footer-heading">Navigate</h4>
              <div className="footer-heading-bar" aria-hidden="true"></div>
              <ul className="footer-nav-list" role="list">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, '#services')}
                    className="footer-nav-item"
                  >
                    <span>Salon &amp; Wellness</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    onClick={(e) => handleNavClick(e, '#services')}
                    className="footer-nav-item"
                  >
                    <span>Orthotics</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, '#about')}
                    className="footer-nav-item"
                  >
                    <span>About AVS</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#packages"
                    onClick={(e) => handleNavClick(e, '#packages')}
                    className="footer-nav-item"
                  >
                    <span>Packages</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    onClick={(e) => handleNavClick(e, '#gallery')}
                    className="footer-nav-item"
                  >
                    <span>Gallery</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    onClick={(e) => handleNavClick(e, 'contact')}
                    className="footer-nav-item"
                  >
                    <span>Contact</span>
                    <span className="footer-nav-arrow" aria-hidden="true">&#8250;</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact */}
            <div className="footer-col footer-col-contact">
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-heading-bar" aria-hidden="true"></div>
              <div className="footer-contact-list">
                <a href="tel:+16479875451" className="footer-contact-row" aria-label="Call +1 647-987-5451">
                  <span className="footer-contact-badge" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="footer-contact-text">+1 647-987-5451</span>
                </a>

                <a
                  href="https://maps.google.com/?q=157+Queen+Street+West+Brampton+ON"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-row"
                  aria-label="Location: 157 Queen Street West, Brampton, ON L6Y 1P9"
                >
                  <span className="footer-contact-badge" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.6"/>
                      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </span>
                  <span className="footer-contact-text">
                    157 Queen Street West,<br />Brampton, ON L6Y 1P9
                  </span>
                </a>

                <a href="mailto:info@auravitalstar.ca" className="footer-contact-row" aria-label="Email info@auravitalstar.ca">
                  <span className="footer-contact-badge" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="footer-contact-text">info@auravitalstar.ca</span>
                </a>

                <a
                  href="https://www.auravitalstar.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-row"
                  aria-label="Visit website www.auravitalstar.ca"
                >
                  <span className="footer-contact-badge" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" strokeWidth="1.6"/>
                    </svg>
                  </span>
                  <span className="footer-contact-text">www.auravitalstar.ca</span>
                </a>
              </div>
            </div>

            {/* Column 4: Stay Connected */}
            <div className="footer-col footer-col-newsletter">
              <h4 className="footer-heading">Stay Connected</h4>
              <div className="footer-heading-bar" aria-hidden="true"></div>
              <p className="footer-newsletter-desc">
                Subscribe to get wellness tips, exclusive offers, and updates delivered to your inbox.
              </p>
              <form className="footer-newsletter-form" onSubmit={handleNewsletterSubmit} noValidate>
                <div className="footer-input-pill">
                  <input
                    type="email"
                    className="footer-email-input"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    aria-label="Your email address for wellness updates"
                    required
                  />
                  <button type="submit" className="footer-submit-btn" aria-label="Subscribe to newsletter">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                {newsletterStatus && (
                  <p className={`footer-newsletter-status ${newsletterStatus.ok ? 'success' : 'error'}`}>
                    {newsletterStatus.msg}
                  </p>
                )}
              </form>
              <div className="footer-privacy-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#C49A3C" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>We respect your privacy.</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="footer-bottom-bar">
            <p className="footer-copy-text">
              &copy; 2025 Aura Vital Star Rejuvenation Centre Inc. All Rights Reserved.
            </p>
            <div className="footer-legal-links">
              <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
              <span className="footer-legal-sep" aria-hidden="true">|</span>
              <a href="#terms" className="footer-legal-link">Terms &amp; Conditions</a>
              <span className="footer-legal-sep" aria-hidden="true">|</span>
              <a href="/crm" className="footer-legal-link" style={{ color: '#D4AF37', fontWeight: 600 }}>Staff &amp; CRM Portal &rarr;</a>
            </div>
          </div>
        </div>
      </footer>

      {/* --------------------------------------------------------
          AURA VITAL STAR — PREMIUM LUXURY CONCIERGE BOOKING MODAL
          -------------------------------------------------------- */}
      <BookingPage
        isModal={true}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialSource={bookingModalSource}
      />
    </>
  );
}

export default App;
