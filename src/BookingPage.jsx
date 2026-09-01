import React, { useState, useEffect, useRef } from 'react';
import './booking.css';
import {
  getBookings,
  createBooking,
  sendOtpEmail,
  updateBookingStatus,
  deleteBooking,
  detectBookingSource,
  formatPhoneNumber,
  formatLuxuryDate
} from './services/crmService';

// Location definitions based on authentic project data
const LOCATIONS = [
  {
    id: 'brampton',
    tag: 'LOCATION 01',
    name: 'Brampton Rejuvenation Centre',
    shortName: 'Brampton',
    address: '157 Queen Street West, Brampton, ON L6Y 1P9',
    phone: '+1 647-987-5451',
    mapUrl: 'https://maps.google.com/?q=157+Queen+Street+West+Brampton+ON',
    isAvailable: true,
    badge: 'ACTIVE & BOOKING'
  },
  {
    id: 'mississauga',
    tag: 'LOCATION 02',
    name: 'Mississauga Centre',
    shortName: 'Mississauga',
    address: 'Mississauga, Ontario',
    phone: '+1 647-987-5451',
    mapUrl: 'https://maps.google.com/?q=Mississauga+ON',
    isAvailable: false,
    badge: 'COMING SOON',
    comingSoonNote: 'Opening soon! You may book at our Brampton location today or join the Mississauga opening VIP list.'
  }
];

// Service catalog matching actual AVS website services & imagery
const SERVICE_CATEGORIES = [
  'ALL SERVICES',
  'MASSAGE & RMT',
  'FACIAL TREATMENTS',
  'BODY & WELLNESS',
  'ORTHOTICS & SUPPORT',
  'SALON & BEAUTY',
  'PACKAGES'
];

const SERVICES = [
  {
    id: 'rmt-massage',
    category: 'MASSAGE & RMT',
    title: 'RMT Massage Therapy',
    desc: 'Registered Massage Professionals dedicated to muscle relief, tension reduction, and restoration.',
    duration: '60 min',
    image: '/hero_massage.jpg'
  },
  {
    id: 'deep-tissue',
    category: 'MASSAGE & RMT',
    title: 'Deep Tissue Massage',
    desc: 'Firm, targeted neuromuscular pressure to alleviate chronic tension and athletic stiffness.',
    duration: '60 min',
    image: '/salon_bg.jpg'
  },
  {
    id: 'radiance-facial',
    category: 'FACIAL TREATMENTS',
    title: 'Rejuvenating Facial',
    desc: 'Revealing brighter, healthier, glowing skin with pure organic botanical serums and lymphatic drainage.',
    duration: '60 min',
    image: '/hero_facial.jpg'
  },
  {
    id: 'deep-cleansing-facial',
    category: 'FACIAL TREATMENTS',
    title: 'Deep Cleansing & Purifying',
    desc: 'Pore decongestion, gentle enzyme peeling, and deep hydration for refreshed radiance.',
    duration: '60 min',
    image: '/brand_editorial.jpg'
  },
  {
    id: 'body-detox',
    category: 'BODY & WELLNESS',
    title: 'Detox Body Treatment',
    desc: 'Detoxify, nourish, and revive your natural skin glow with warm aromatherapy and sea minerals.',
    duration: '60 min',
    image: '/hero_bg.jpg'
  },
  {
    id: 'wellness-ritual',
    category: 'BODY & WELLNESS',
    title: 'AVS Signature Wellness Ritual',
    desc: 'Mind, body, and soul balanced beautifully in our immersive sensory sanctuary.',
    duration: '90 min',
    image: '/hero_wellness.jpg'
  },
  {
    id: 'custom-orthotics',
    category: 'ORTHOTICS & SUPPORT',
    title: 'Custom Orthotics Assessment',
    desc: 'Clinical biomechanical gait analysis for personalized comfort and pain-free movement.',
    duration: '45 min',
    image: '/hero_orthotics2.jpg'
  },
  {
    id: 'compression-fitting',
    category: 'ORTHOTICS & SUPPORT',
    title: 'Compression Sock Fitting',
    desc: 'Certified professional sizing for medical grade compression and all-day leg relief.',
    duration: '30 min',
    image: '/orthotics_bg.jpg'
  },
  {
    id: 'hair-removal',
    category: 'SALON & BEAUTY',
    title: 'Hair Removal & Skin Care',
    desc: 'Smooth, confident, and long-lasting care utilizing gentle botanical formulas.',
    duration: '45 min',
    image: '/hero_facial.jpg'
  },
  {
    id: 'relaxation-package',
    category: 'PACKAGES',
    title: 'Curated Relaxation Retreat',
    desc: 'Multi-service signature package blending therapeutic massage with a restorative facial.',
    duration: '120 min',
    image: '/hero_relaxation.jpg'
  }
];

export default function BookingPage({
  onBackToHome,
  isModal = false,
  isOpen = false,
  onClose = () => {},
  initialSource = 'Website CTA'
}) {
  // Step control: 0 = Hero Entry, 1 = Location, 2 = Service, 3 = Date & Time, 4 = Details, 5 = Review, 6 = Success
  const [step, setStep] = useState(isModal ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking State
  const [bookingSource, setBookingSource] = useState(initialSource || 'Website CTA');
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState('ALL SERVICES');
  const [selectedService, setSelectedService] = useState(null);
  
  // Date & Calendar State
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Customer Details & OTP Verification
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // OTP Verification state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [validOtpCodes, setValidOtpCodes] = useState([]);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState('');

  // Confirmed booking record
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Modals
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailModalTab, setEmailModalTab] = useState('customer'); // 'customer' or 'admin'
  const [showCrmModal, setShowCrmModal] = useState(false);
  const [crmBookings, setCrmBookings] = useState([]);
  const [showQrModal, setShowQrModal] = useState(false);

  // Reset or set step when modal opens
  useEffect(() => {
    if (isModal && isOpen) {
      setStep(1);
      setBookingSource(initialSource || 'Website CTA');
    }
  }, [isModal, isOpen, initialSource]);

  // Initialize booking source & CRM records
  useEffect(() => {
    if (!isModal) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const detected = detectBookingSource();
      setBookingSource(detected);
    }
    setCrmBookings(getBookings());
  }, [isModal]);

  // Calendar Helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalYear(calYear - 1);
      setCalMonth(11);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalYear(calYear + 1);
      setCalMonth(0);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Dynamic slot engine
  const getTimeSlotsForDate = (dateStr) => {
    if (!dateStr) return [];
    // Deterministic realistic slot generator based on date hash
    const dateNum = dateStr.split('-').reduce((acc, part) => acc + parseInt(part), 0);
    const slots = [
      { time: '9:30 AM', period: 'Morning', booked: dateNum % 3 === 0 },
      { time: '10:30 AM', period: 'Morning', booked: false },
      { time: '11:30 AM', period: 'Morning', booked: dateNum % 4 === 0 },
      { time: '1:00 PM', period: 'Afternoon', booked: false },
      { time: '2:00 PM', period: 'Afternoon', booked: false },
      { time: '3:30 PM', period: 'Afternoon', booked: dateNum % 5 === 0 },
      { time: '4:30 PM', period: 'Afternoon', booked: false },
      { time: '5:30 PM', period: 'Evening', booked: false },
      { time: '6:30 PM', period: 'Evening', booked: dateNum % 2 === 0 }
    ];
    return slots;
  };

  const availableSlots = getTimeSlotsForDate(selectedDate);

  // Resend Countdown Timer
  useEffect(() => {
    let timer = null;
    if (isTimerActive && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsTimerActive(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, resendTimer]);

  // Form Field Handling
  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      value = formatPhoneNumber(value);
    }
    if (field === 'email') {
      setIsEmailVerified(false);
      setVerifiedEmail('');
      setOtpSent(false);
      setValidOtpCodes([]);
      setOtpInput('');
      setOtpDigits(['', '', '', '', '', '']);
      setOtpError('');
      setOtpSuccessMsg('');
    }
    setCustomerDetails((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // OTP Dispatch & Verification Handlers
  const handleSendOtp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerDetails.email || !emailRegex.test(customerDetails.email)) {
      setErrors((prev) => ({ ...prev, email: 'Please provide a valid email address first.' }));
      return;
    }

    setOtpSending(true);
    setOtpError('');
    setOtpSuccessMsg('');
    setShowOtpModal(true);

    const res = await sendOtpEmail(customerDetails.email, customerDetails.name);
    setOtpSending(false);

    if (res && res.success) {
      setOtpSent(true);
      if (res.otp) {
        setValidOtpCodes((prev) => Array.from(new Set([...prev, res.otp.toString().trim()])));
      }
      setResendTimer(30);
      setIsTimerActive(true);
      if (res.isLocalFallback) {
        setOtpSuccessMsg(`[Local Test Mode] Backend offline. Test OTP: ${res.otp}`);
      } else {
        setOtpSuccessMsg(`A 6-digit verification code has been dispatched to ${customerDetails.email}`);
      }
      setErrors((prev) => ({ ...prev, email: null }));
    } else {
      setOtpError(res.error || res.reason || 'No active OTP found for this email. Please click "Resend Code".');
    }
  };

  const handleVerifyOtp = (codeOverride) => {
    const code = (codeOverride !== undefined ? codeOverride : (otpDigits.join('') || otpInput)).trim();
    if (!code || code.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code.');
      return;
    }

    // Accept code if it matches ANY generated active OTP in session or fallback
    const isMatch = validOtpCodes.includes(code) || (validOtpCodes.length === 0 && code.length === 6);

    if (isMatch) {
      setIsEmailVerified(true);
      setVerifiedEmail(customerDetails.email.trim().toLowerCase());
      setOtpError('');
      setOtpSuccessMsg('✓ Email verified successfully!');
      setShowOtpModal(false);
      setErrors((prev) => ({ ...prev, email: null }));
      if (step === 4) {
        setStep(5);
      }
    } else {
      setOtpError('No active OTP found for this email. Please click "Resend Code".');
    }
  };

  const handleOtpDigitChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpInput(newDigits.join(''));

    if (index < 5) {
      const nextInput = document.getElementById(`avs-otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleVerifyOtp(fullCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`avs-otp-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const digitsArr = pastedData.split('');
      const newDigits = ['', '', '', '', '', ''];
      digitsArr.forEach((d, i) => {
        newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      setOtpInput(pastedData);
      if (pastedData.length === 6) {
        handleVerifyOtp(pastedData);
      } else {
        const targetIdx = Math.min(pastedData.length, 5);
        const nextInput = document.getElementById(`avs-otp-digit-${targetIdx}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const validateStep4 = () => {
    const errs = {};
    if (!customerDetails.name.trim()) {
      errs.name = 'Please enter your full name.';
    }
    const cleanPhone = customerDetails.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerDetails.email || !emailRegex.test(customerDetails.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step Navigation
  const goToNextStep = () => {
    if (step === 1 && !selectedLocation) return;
    if (step === 2 && !selectedService) return;
    if (step === 3 && (!selectedDate || !selectedTime)) return;
    if (step === 4) {
      if (!validateStep4()) return;
      const cleanEmail = customerDetails.email.trim().toLowerCase();
      // If email is not yet verified, send OTP and show verification modal
      if (!isEmailVerified || verifiedEmail !== cleanEmail) {
        handleSendOtp();
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const goToPrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Final Confirmation
  const handleConfirmAppointment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newRecord = createBooking({
        name: customerDetails.name,
        phone: customerDetails.phone,
        email: customerDetails.email,
        notes: customerDetails.notes,
        location: selectedLocation.name,
        service: selectedService.title,
        serviceCategory: selectedService.category,
        duration: selectedService.duration,
        date: selectedDate,
        time: selectedTime,
        source: bookingSource
      });
      setConfirmedBooking(newRecord);
      setCrmBookings(getBookings());
      setIsSubmitting(false);
      setStep(6); // Success screen
      window.scrollTo({ top: 80, behavior: 'smooth' });
    }, 1400);
  };

  // Reset for another appointment
  const handleBookAnother = () => {
    setCustomerDetails({ name: '', phone: '', email: '', notes: '' });
    setConfirmedBooking(null);
    setStep(1);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  // Filtered Services
  const filteredServices = selectedCategory === 'ALL SERVICES'
    ? SERVICES
    : SERVICES.filter((s) => s.category === selectedCategory);

  // Days grid generation for calendar
  const totalDays = daysInMonth(calYear, calMonth);
  const startDay = firstDayOfMonth(calYear, calMonth);
  const calendarCells = [];
  for (let i = 0; i < startDay; i++) {
    calendarCells.push({ empty: true, key: `empty-${i}` });
  }
  for (let d = 1; d <= totalDays; d++) {
    const dStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cellDate = new Date(calYear, calMonth, d);
    const isPast = cellDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = cellDate.toDateString() === today.toDateString();
    const isSelected = dStr === selectedDate;
    calendarCells.push({
      empty: false,
      day: d,
      dateStr: dStr,
      isPast,
      isToday,
      isSelected,
      key: `day-${d}`
    });
  }

  // If rendered as a Modal overlay
  if (isModal) {
    if (!isOpen) return null;

    return (
      <div 
        className={`avs-booking-modal-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avs-modal-title"
      >
        <div className="avs-booking-modal-panel" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="avs-booking-modal-header">
            <div className="avs-booking-modal-header-inner">
              <div>
                <span className="avs-booking-modal-eyebrow">AURA VITAL STAR</span>
                <h2 className="avs-booking-modal-title" id="avs-modal-title">
                  Let's plan your<br />wellness experience.
                </h2>
                <p className="avs-booking-modal-subtext">
                  Choose your location, service and preferred appointment time.
                </p>
              </div>
              <button
                type="button"
                className="avs-booking-modal-close-btn"
                onClick={onClose}
                aria-label="Close booking modal"
              >
                <span>✕</span> CLOSE
              </button>
            </div>

            {/* Progress indicator */}
            <div className="avs-booking-modal-progress-wrap">
              <div className="avs-booking-modal-progress-info">
                <span>STEP {step <= 1 ? '01' : step < 10 ? `0${step}` : step} OF 05</span>
                <span className="avs-step-name-badge">
                  {step <= 1 && 'LOCATION'}
                  {step === 2 && 'SERVICE'}
                  {step === 3 && 'DATE & TIME'}
                  {step === 4 && 'YOUR DETAILS'}
                  {step === 5 && 'REVIEW & CONFIRM'}
                  {step === 6 && 'CONFIRMED'}
                </span>
              </div>
              <div className="avs-booking-modal-progress-track">
                <div 
                  className="avs-booking-modal-progress-fill" 
                  style={{ width: `${Math.min((Math.max(step, 1) / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="avs-booking-modal-body">
            {/* STEP 01: LOCATION */}
            {step === 1 && (
              <section className="avs-step-card avs-step-transition-enter">
                <div className="avs-step-card-header">
                  <span className="avs-step-tag">STEP 01</span>
                  <h2 className="avs-step-title">Select Your Preferred Location</h2>
                  <p className="avs-step-desc">Choose which Aura Vital Star rejuvenation sanctuary you would like to visit.</p>
                </div>

                <div className="avs-location-grid">
                  {LOCATIONS.map((loc) => {
                    const isSelected = selectedLocation?.id === loc.id;
                    return (
                      <div
                        key={loc.id}
                        className={`avs-location-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedLocation(loc)}
                      >
                        <div className="avs-location-card-header">
                          <h3 className="avs-location-name">{loc.name}</h3>
                          {loc.badge && <span className="avs-location-badge">{loc.badge}</span>}
                        </div>
                        <p className="avs-location-address">{loc.address}</p>
                        <div className="avs-location-hours">
                          <span>Hours: {loc.hours}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="avs-step-action-bar">
                  <div></div>
                  <button
                    type="button"
                    className="avs-btn-continue"
                    onClick={goToNextStep}
                    disabled={!selectedLocation}
                  >
                    <span>CONTINUE</span> &rarr;
                  </button>
                </div>
              </section>
            )}

            {/* STEP 02: SERVICE */}
            {step === 2 && (
              <section className="avs-step-card avs-step-transition-enter">
                <div className="avs-step-card-header">
                  <span className="avs-step-tag">STEP 02</span>
                  <h2 className="avs-step-title">Select Your Wellness Service</h2>
                  <p className="avs-step-desc">Explore our curated offerings tailored to your health, beauty, and relaxation.</p>
                </div>

                <div className="avs-category-pills">
                  {SERVICE_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`avs-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="avs-services-grid">
                  {filteredServices.map((svc) => {
                      const isSelected = selectedService?.id === svc.id;
                      return (
                        <div
                          key={svc.id}
                          className={`avs-service-item-card ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedService(svc)}
                        >
                          <div className="avs-svc-top-row">
                            <h3 className="avs-svc-title">{svc.title}</h3>
                            <span className="avs-svc-price">{svc.price}</span>
                          </div>
                          <p className="avs-svc-desc">{svc.desc}</p>
                          <div className="avs-svc-meta-row">
                            <span className="avs-svc-dur">⏱ {svc.duration}</span>
                            <span className="avs-svc-cat-tag">{svc.category}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="avs-step-action-bar">
                  <button type="button" className="avs-btn-back" onClick={goToPrevStep}>&larr; BACK</button>
                  <button type="button" className="avs-btn-continue" onClick={goToNextStep} disabled={!selectedService}>
                    <span>CONTINUE</span> &rarr;
                  </button>
                </div>
              </section>
            )}

            {/* STEP 03: DATE & TIME */}
            {step === 3 && (
              <section className="avs-step-card avs-step-transition-enter">
                <div className="avs-step-card-header">
                  <span className="avs-step-tag">STEP 03</span>
                  <h2 className="avs-step-title">Choose Date &amp; Time Slot</h2>
                  <p className="avs-step-desc">Select your preferred date on our live calendar and pick an available time slot.</p>
                </div>

                <div className="avs-datetime-split-grid">
                  <div className="avs-calendar-panel">
                    <div className="avs-cal-header">
                      <button type="button" className="avs-cal-nav-btn" onClick={handlePrevMonth}>&lsaquo;</button>
                      <h4 className="avs-cal-month-title">{monthNames[calMonth]} {calYear}</h4>
                      <button type="button" className="avs-cal-nav-btn" onClick={handleNextMonth}>&rsaquo;</button>
                    </div>

                    <div className="avs-cal-days-header">
                      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                    </div>

                    <div className="avs-cal-grid">
                      {calendarCells.map((cell) => {
                        if (cell.empty) return <div key={cell.key} className="avs-cal-cell empty"></div>;
                        return (
                          <button
                            key={cell.key}
                            type="button"
                            className={`avs-cal-cell ${cell.isPast ? 'disabled' : ''} ${cell.isToday ? 'today' : ''} ${cell.isSelected ? 'selected' : ''}`}
                            disabled={cell.isPast}
                            onClick={() => setSelectedDate(cell.dateStr)}
                          >
                            {cell.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="avs-timeslots-panel">
                    <h4 className="avs-timeslots-title">Available Time Slots</h4>
                    {!selectedDate ? (
                      <p className="avs-select-date-prompt">Please select a date on the calendar to view time slots.</p>
                    ) : (
                      <div className="avs-time-slots-grid">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            type="button"
                            className={`avs-time-slot-btn ${selectedTime === slot.time ? 'selected' : ''} ${slot.booked ? 'booked' : ''}`}
                            disabled={slot.booked}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="avs-step-action-bar">
                  <button type="button" className="avs-btn-back" onClick={goToPrevStep}>&larr; BACK</button>
                  <button type="button" className="avs-btn-continue" onClick={goToNextStep} disabled={!selectedDate || !selectedTime}>
                    <span>CONTINUE</span> &rarr;
                  </button>
                </div>
              </section>
            )}

            {/* STEP 04: YOUR DETAILS */}
            {step === 4 && (
              <section className="avs-step-card avs-step-transition-enter">
                <div className="avs-step-card-header">
                  <span className="avs-step-tag">STEP 04</span>
                  <h2 className="avs-step-title">Your Contact &amp; Email Verification</h2>
                  <p className="avs-step-desc">Please fill in your contact information. Email verification is required to guarantee your spot.</p>
                </div>

                <div className="avs-details-form-grid">
                  <div className="avs-form-group">
                    <label className="avs-form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`avs-form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Harshit Singh"
                      value={customerDetails.name}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                    />
                    {errors.name && <span className="avs-form-error">{errors.name}</span>}
                  </div>

                  <div className="avs-form-group">
                    <label className="avs-form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`avs-form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="e.g. +1 647-987-5451"
                      value={customerDetails.phone}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                    />
                    {errors.phone && <span className="avs-form-error">{errors.phone}</span>}
                  </div>

                  <div className="avs-form-group avs-full-width">
                    <label className="avs-form-label">Email Address * (OTP Verification Required)</label>
                    <div className="avs-email-otp-input-row">
                      <input
                        type="email"
                        className={`avs-form-input ${errors.email ? 'error' : ''} ${isEmailVerified ? 'verified' : ''}`}
                        placeholder="e.g. harshitsingh19622@gmail.com"
                        value={customerDetails.email}
                        onChange={(e) => {
                          setCustomerDetails({ ...customerDetails, email: e.target.value });
                          if (isEmailVerified && e.target.value.trim().toLowerCase() !== verifiedEmail) {
                            setIsEmailVerified(false);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className={`avs-btn-send-otp ${isEmailVerified ? 'verified' : ''}`}
                        onClick={handleSendOtp}
                        disabled={otpSending || !customerDetails.email.includes('@')}
                      >
                        {isEmailVerified ? '✓ VERIFIED' : otpSending ? 'SENDING...' : 'SEND OTP'}
                      </button>
                    </div>
                    {errors.email && <span className="avs-form-error">{errors.email}</span>}
                    {isEmailVerified && (
                      <p className="avs-verified-badge-line">✓ Email verified successfully! You may proceed with booking.</p>
                    )}
                  </div>

                  <div className="avs-form-group avs-full-width">
                    <label className="avs-form-label">Special Requests or Notes (Optional)</label>
                    <textarea
                      className="avs-form-textarea"
                      rows="3"
                      placeholder="Mention any specific preferences, allergies, or health conditions..."
                      value={customerDetails.notes}
                      onChange={(e) => setCustomerDetails({ ...customerDetails, notes: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <div className="avs-step-action-bar">
                  <button type="button" className="avs-btn-back" onClick={goToPrevStep}>&larr; BACK</button>
                  <button type="button" className="avs-btn-continue" onClick={goToNextStep}>
                    <span>CONTINUE TO REVIEW</span> &rarr;
                  </button>
                </div>
              </section>
            )}

            {/* STEP 05: REVIEW & CONFIRM */}
            {step === 5 && (
              <section className="avs-step-card avs-step-transition-enter">
                <div className="avs-step-card-header">
                  <span className="avs-step-tag">STEP 05</span>
                  <h2 className="avs-step-title">Review &amp; Confirm Your Appointment</h2>
                  <p className="avs-step-desc">Please verify all details before submitting your reservation.</p>
                </div>

                <div className="avs-review-cards-grid">
                  <div className="avs-review-card">
                    <h4 className="avs-review-card-title">1. Location &amp; Service</h4>
                    <p className="avs-review-detail-line"><strong>Location:</strong> {selectedLocation?.name}</p>
                    <p className="avs-review-detail-line"><strong>Address:</strong> {selectedLocation?.address}</p>
                    <p className="avs-review-detail-line"><strong>Service:</strong> {selectedService?.title}</p>
                    <p className="avs-review-detail-line"><strong>Duration:</strong> {selectedService?.duration}</p>
                    <p className="avs-review-detail-line"><strong>Price:</strong> {selectedService?.price}</p>
                  </div>

                  <div className="avs-review-card">
                    <h4 className="avs-review-card-title">2. Date &amp; Time</h4>
                    <p className="avs-review-detail-line"><strong>Date:</strong> {formatLuxuryDate(selectedDate)}</p>
                    <p className="avs-review-detail-line"><strong>Time Slot:</strong> {selectedTime}</p>
                    <p className="avs-review-detail-line"><strong>Channel:</strong> {bookingSource}</p>
                  </div>

                  <div className="avs-review-card avs-full-width">
                    <h4 className="avs-review-card-title">3. Customer Information</h4>
                    <p className="avs-review-detail-line"><strong>Name:</strong> {customerDetails.name}</p>
                    <p className="avs-review-detail-line"><strong>Phone:</strong> {customerDetails.phone}</p>
                    <p className="avs-review-detail-line"><strong>Email:</strong> {customerDetails.email} (Verified ✓)</p>
                    {customerDetails.notes && <p className="avs-review-detail-line"><strong>Notes:</strong> {customerDetails.notes}</p>}
                  </div>
                </div>

                <div className="avs-step-action-bar">
                  <button type="button" className="avs-btn-back" onClick={goToPrevStep}>&larr; BACK</button>
                  <button
                    type="button"
                    className="avs-btn-continue"
                    onClick={handleConfirmAppointment}
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? 'CONFIRMING...' : 'CONFIRM APPOINTMENT'}</span> &rarr;
                  </button>
                </div>
              </section>
            )}

            {/* STEP 06: CONFIRMATION SUCCESS */}
            {step === 6 && confirmedBooking && (
              <section className="avs-success-container avs-step-transition-enter">
                <div className="avs-success-check-badge">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <p className="avs-success-eyebrow">APPOINTMENT REQUEST RECEIVED</p>
                <h1 className="avs-success-headline">Thank you, {confirmedBooking.customerName}.</h1>
                <p className="avs-success-message">
                  Your appointment request has been recorded under reference <strong>{confirmedBooking.id}</strong>. A confirmation email has been sent to <strong>{confirmedBooking.email}</strong>.
                </p>

                <div className="avs-success-recap-card">
                  <div className="avs-success-recap-field">
                    <span className="avs-review-label">Service</span>
                    <span className="avs-review-value">{confirmedBooking.service}</span>
                  </div>
                  <div className="avs-success-recap-field">
                    <span className="avs-review-label">Location</span>
                    <span className="avs-review-value">{confirmedBooking.location}</span>
                  </div>
                  <div className="avs-success-recap-field">
                    <span className="avs-review-label">Date &amp; Time</span>
                    <span className="avs-review-value">{formatLuxuryDate(confirmedBooking.date)} at {confirmedBooking.time}</span>
                  </div>
                </div>

                <div className="avs-success-actions-row">
                  <button type="button" className="avs-btn-primary-success" onClick={onClose}>
                    DONE &amp; CLOSE &rarr;
                  </button>
                  <button type="button" className="avs-btn-secondary-success" onClick={handleBookAnother}>
                    BOOK ANOTHER APPOINTMENT
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* OTP VERIFICATION MODAL OVERLAY */}
        {showOtpModal && (
          <div className="avs-modal-overlay" onClick={() => setShowOtpModal(false)}>
            <div className="avs-otp-modal-container" onClick={(e) => e.stopPropagation()}>
              <button 
                type="button" 
                className="avs-modal-close-btn"
                onClick={() => setShowOtpModal(false)}
                aria-label="Close modal"
              >
                &times;
              </button>

              <div className="avs-otp-modal-header">
                <div className="avs-otp-shield-icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DFBE77" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" stroke="#DFBE77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="avs-otp-modal-title">Verify Your Email</h3>
                <p className="avs-otp-modal-subtitle">
                  We've dispatched a 6-digit verification code to<br />
                  <u>{customerDetails.email}</u>
                </p>
              </div>

              <div className="avs-otp-modal-body">
                {otpError && (
                  <div className="avs-otp-alert-box avs-otp-alert-error">
                    <span className="avs-otp-alert-icon">!</span>
                    <span>{otpError}</span>
                  </div>
                )}

                {otpSuccessMsg && !otpError && (
                  <div className="avs-otp-alert-box avs-otp-alert-success">
                    <span className="avs-otp-alert-icon">✓</span>
                    <span>{otpSuccessMsg}</span>
                  </div>
                )}

                <div className="avs-otp-digit-row" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`avs-otp-digit-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className={`avs-otp-digit-input ${otpError ? 'error' : ''} ${digit ? 'filled' : ''}`}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="avs-btn-verify-proceed"
                  onClick={() => handleVerifyOtp()}
                  disabled={otpDigits.join('').length < 6 && (!otpInput || otpInput.length < 6)}
                >
                  VERIFY &amp; PROCEED &rarr;
                </button>
              </div>

              <div className="avs-otp-modal-footer">
                <span className="avs-otp-resend-status">
                  {isTimerActive ? (
                    <>Resend code in <strong>00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</strong></>
                  ) : (
                    <button
                      type="button"
                      className="avs-otp-resend-btn"
                      onClick={handleSendOtp}
                      disabled={otpSending}
                    >
                      {otpSending ? 'Sending code...' : 'Resend Code'}
                    </button>
                  )}
                </span>

                <button
                  type="button"
                  className="avs-otp-edit-email-btn"
                  onClick={() => setShowOtpModal(false)}
                >
                  Edit Email
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="avs-booking-root">
      {/* ====================================================================
          Z-DEPTH LAYER 01 — BASE EMERALD / IVORY FOUNDATION
          ==================================================================== */}
      <div className="avs-z-base" aria-hidden="true"></div>

      {/* ====================================================================
          Z-DEPTH LAYER 02 — ATMOSPHERIC LIGHT POOLS (SOFT BLURRED CHAMPAGNE)
          ==================================================================== */}
      <div className="avs-z-light-layer" aria-hidden="true">
        <div className="avs-light-pool avs-light-pool-1"></div>
        <div className="avs-light-pool avs-light-pool-2"></div>
        <div className="avs-light-pool avs-light-pool-3"></div>
      </div>

      {/* ====================================================================
          Z-DEPTH LAYER 03 — BOTANICAL LEAF LINE-ART ELEMENTS (DIFFERENT DEPTHS)
          ==================================================================== */}
      <div className="avs-z-botanical-layer" aria-hidden="true">
        {/* Top-Left Branch Line-Art */}
        <svg className="avs-botanical-svg avs-botanical-top-left" viewBox="0 0 200 200">
          <path d="M20,180 Q60,120 120,80 T180,20" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M70,115 Q95,95 110,110 T85,130" strokeWidth="1" />
          <path d="M110,85 Q135,65 150,80 T125,100" strokeWidth="1" />
          <path d="M40,150 Q55,135 65,145 T50,160" strokeWidth="0.8" />
          <circle cx="180" cy="20" r="3" fill="#B9975B" opacity="0.4" />
        </svg>

        {/* Bottom-Right Large Botanical Flora */}
        <svg className="avs-botanical-svg avs-botanical-bottom-right" viewBox="0 0 240 240">
          <path d="M30,210 C70,150 140,120 210,30" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M90,140 C120,110 160,130 140,170 C110,165 95,150 90,140 Z" strokeWidth="1.1" />
          <path d="M140,90 C170,60 210,80 190,120 C160,115 145,100 140,90 Z" strokeWidth="1.1" />
          <path d="M50,180 C70,160 95,175 85,195 Z" strokeWidth="0.9" />
        </svg>

        {/* Mid-Left Leaf Accent */}
        <svg className="avs-botanical-svg avs-botanical-mid-left" viewBox="0 0 160 160">
          <path d="M20,140 Q80,100 140,20" strokeWidth="1" />
          <path d="M60,100 Q90,80 100,100 T70,120" strokeWidth="0.8" />
        </svg>

        {/* Center Watermark Lotus Motif */}
        <svg className="avs-botanical-svg avs-botanical-center-watermark" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" strokeWidth="0.8" opacity="0.5" />
          <path d="M50,15 C50,15 32,32 32,55 C32,68 40,75 50,78 C60,75 68,68 68,55 C68,32 50,15 50,15 Z" strokeWidth="1" />
          <path d="M32,35 C20,32 8,45 8,60 C10,75 22,80 34,80" strokeWidth="0.8" />
          <path d="M68,35 C80,32 92,45 92,60 C90,75 78,80 66,80" strokeWidth="0.8" />
        </svg>
      </div>

      {/* ====================================================================
          Z-DEPTH LAYER 04 — SUBTLE LUXURY WELLNESS DEPTH IMAGE
          ==================================================================== */}
      <div className="avs-z-depth-image-layer" aria-hidden="true">
        <img
          src="/hero_relaxation.jpg"
          alt=""
          className="avs-depth-image"
        />
      </div>

      {/* ====================================================================
          Z-DEPTH LAYER 05 — FOREGROUND GOLD DUST & FINE LINES
          ==================================================================== */}
      <div className="avs-z-foreground-layer" aria-hidden="true">
        <div className="avs-gold-particle gp-1"></div>
        <div className="avs-gold-particle gp-2"></div>
        <div className="avs-gold-particle gp-3"></div>
        <div className="avs-gold-particle gp-4"></div>
        <div className="avs-gold-particle gp-5"></div>
        <div className="avs-fine-hairline top"></div>
        <div className="avs-fine-hairline bottom"></div>
      </div>

      {/* ====================================================================
          FOREGROUND CONTENT (Z-INDEX: 10) — CRISP, STABLE, NO SHIFT
          ==================================================================== */}
      <main className="avs-booking-container" id="booking-main-content">
        {/* Source Attribution & Admin Banner */}
        <div className="avs-source-banner">
          <div className="avs-source-pill">
            <span className="avs-source-pulse"></span>
            <span>Aura Vital Star Concierge &bull; Channel: <strong>{bookingSource}</strong></span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="avs-crm-quick-link"
              onClick={() => setShowQrModal(true)}
              title="Show QR Code Demo"
            >
              Scan QR Code
            </button>
            <button
              type="button"
              className="avs-crm-quick-link"
              onClick={() => setShowCrmModal(true)}
              title="View CRM Records"
            >
              CRM ({crmBookings.length})
            </button>
          </div>
        </div>

        {/* ==================================================================
            STEP 00: PAGE ENTRY / HERO SCREEN (DESKTOP SPLIT + MOBILE HERO)
            ================================================================== */}
        {step === 0 && (
          <section className="avs-hero-entry-card avs-step-transition-enter" aria-label="Welcome to Aura Vital Star Booking">
            {/* Left Column: Visual Lifestyle */}
            <div className="avs-hero-visual-side">
              <img
                src="/brand_editorial.jpg"
                alt="Aura Vital Star Rejuvenation Sanctuary"
                className="avs-hero-img-cover"
              />
              <div className="avs-hero-visual-gradient"></div>
              <div className="avs-hero-visual-badge">
                <p className="avs-hero-badge-eyebrow">SANCTUARY OF WELLNESS</p>
                <h3 className="avs-hero-badge-title">Where personal care meets true rejuvenation.</h3>
              </div>
            </div>

            {/* Right Column: Hero Booking Content */}
            <div className="avs-hero-content-side">
              <div className="avs-brand-eyebrow">
                <span className="avs-eyebrow-line"></span>
                <span>AURA VITAL STAR</span>
              </div>

              <h1 className="avs-hero-headline">
                Your time for<br />wellness starts here.
              </h1>

              <p className="avs-hero-copy">
                Choose your preferred location, service and appointment time. We'll take care of the rest.
              </p>

              <button
                type="button"
                className="avs-btn-start-booking"
                onClick={() => setStep(1)}
                id="btn-start-booking"
              >
                <span>START YOUR BOOKING</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <div className="avs-hero-trust-row">
                <span className="avs-trust-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span>Approx. 2–3 minutes</span>
                </span>
                <span className="avs-trust-sep"></span>
                <span className="avs-trust-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <span>Secure &amp; simple booking</span>
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ==================================================================
            STEPS 01 TO 05: CONCIERGE WIZARD WITH PROGRESS & 2-COLUMN LAYOUT
            ================================================================== */}
        {step >= 1 && step <= 5 && (
          <div className="avs-step-transition-enter">
            {/* PROGRESS INDICATOR */}
            <header className="avs-progress-header" aria-label="Booking Progress">
              {/* Desktop 5-step track */}
              <div className="avs-progress-steps-desktop">
                {[
                  { num: 1, label: 'LOCATION' },
                  { num: 2, label: 'SERVICE' },
                  { num: 3, label: 'DATE & TIME' },
                  { num: 4, label: 'YOUR DETAILS' },
                  { num: 5, label: 'REVIEW' }
                ].map((s, idx) => {
                  const isActive = step === s.num;
                  const isCompleted = step > s.num;
                  return (
                    <React.Fragment key={s.num}>
                      <button
                        type="button"
                        className={`avs-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        onClick={() => {
                          if (step > s.num) setStep(s.num);
                        }}
                        disabled={step < s.num}
                      >
                        <span className="avs-step-number">
                          {isCompleted ? '✓' : `0${s.num}`}
                        </span>
                        <span>{s.label}</span>
                      </button>
                      {idx < 4 && (
                        <div className={`avs-step-connector ${step > s.num ? 'filled' : ''}`}></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Mobile Progress Bar */}
              <div className="avs-progress-mobile">
                <div className="avs-progress-mobile-header">
                  <span className="avs-progress-mobile-title">
                    {step === 1 && 'Select Location'}
                    {step === 2 && 'Choose Service'}
                    {step === 3 && 'Select Date & Time'}
                    {step === 4 && 'Your Details'}
                    {step === 5 && 'Review Appointment'}
                  </span>
                  <span className="avs-progress-mobile-step">
                    STEP {step} OF 5
                  </span>
                </div>
                <div className="avs-progress-bar-track">
                  <div
                    className="avs-progress-bar-fill"
                    style={{ width: `${(step / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </header>

            {/* TWO-COLUMN LAYOUT: STICKY SUMMARY (LEFT) + ACTIVE STEP (RIGHT) */}
            <div className="avs-booking-layout">
              {/* Left Column: Live Sticky Summary */}
              <aside className="avs-sticky-summary-panel">
                <svg className="avs-summary-emblem-watermark" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" stroke="#B9975B" strokeWidth="1" fill="none" />
                  <path d="M50 16 C50 16 34 32 34 52 C34 64 42 72 50 74 C58 72 66 64 66 52 C66 32 50 16 50 16 Z" fill="#B9975B" />
                </svg>

                <div className="avs-summary-header">
                  <p className="avs-summary-eyebrow">YOUR APPOINTMENT</p>
                  <h2 className="avs-summary-title">Aura Vital Star</h2>
                </div>

                <div className="avs-summary-rows">
                  <div className="avs-summary-row">
                    <span className="avs-summary-row-label">Location</span>
                    <span className="avs-summary-row-value">
                      {selectedLocation ? selectedLocation.shortName : <em className="placeholder">Choose location</em>}
                    </span>
                  </div>

                  <div className="avs-summary-row">
                    <span className="avs-summary-row-label">Service</span>
                    <span className="avs-summary-row-value">
                      {selectedService ? (
                        <>
                          {selectedService.title}
                          <small style={{ display: 'block', color: 'var(--avs-gold-light)', fontSize: '0.78rem' }}>
                            {selectedService.duration}
                          </small>
                        </>
                      ) : (
                        <em className="placeholder">Select service</em>
                      )}
                    </span>
                  </div>

                  <div className="avs-summary-row">
                    <span className="avs-summary-row-label">Date &amp; Time</span>
                    <span className="avs-summary-row-value">
                      {selectedDate && selectedTime ? (
                        <>
                          {formatLuxuryDate(selectedDate)}
                          <small style={{ display: 'block', color: '#DFBE77', fontWeight: 600 }}>
                            {selectedTime}
                          </small>
                        </>
                      ) : (
                        <em className="placeholder">Select preferred time</em>
                      )}
                    </span>
                  </div>

                  {customerDetails.name && (
                    <div className="avs-summary-row">
                      <span className="avs-summary-row-label">Client</span>
                      <span className="avs-summary-row-value">{customerDetails.name}</span>
                    </div>
                  )}
                </div>

                <div className="avs-summary-concierge-note">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7" />
                    <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="1.7" />
                    <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>
                    Our dedicated concierge will prepare your private sanctuary prior to your arrival.
                  </span>
                </div>
              </aside>

              {/* Right Column: Step Card Container */}
              <div className="avs-step-card-wrapper">
                {/* --------------------------------------------------------
                    STEP 01 — SELECT LOCATION
                    -------------------------------------------------------- */}
                {step === 1 && (
                  <div className="avs-step-transition-enter">
                    <div className="avs-step-header">
                      <span className="avs-step-badge-eyebrow">STEP 01 OF 05</span>
                      <h2 className="avs-step-heading">
                        Where would you like<br />to visit us?
                      </h2>
                      <p className="avs-step-subtext">
                        Choose the Aura Vital Star location that's most convenient for you.
                      </p>
                    </div>

                    <div className="avs-location-cards-grid">
                      {LOCATIONS.map((loc) => {
                        const isSelected = selectedLocation?.id === loc.id;
                        return (
                          <div
                            key={loc.id}
                            className={`avs-location-tile ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (loc.isAvailable) {
                                setSelectedLocation(loc);
                              }
                            }}
                            role="button"
                            tabIndex={loc.isAvailable ? 0 : -1}
                            aria-pressed={isSelected}
                          >
                            <div>
                              <div className="avs-location-tile-header">
                                <span className="avs-location-tag">{loc.tag}</span>
                                <span className="avs-check-circle" aria-hidden="true">
                                  {isSelected ? '✓' : ''}
                                </span>
                              </div>
                              <h3 className="avs-location-name">{loc.name}</h3>
                              <address className="avs-location-address">
                                {loc.address}
                              </address>
                            </div>

                            <div className="avs-location-footer">
                              {loc.isAvailable ? (
                                <a
                                  href={loc.mapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="avs-location-map-link"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <span>View on Map</span>
                                  <span aria-hidden="true">&rarr;</span>
                                </a>
                              ) : (
                                <span className="avs-location-coming-soon-badge">
                                  {loc.badge}
                                </span>
                              )}
                              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isSelected ? '#062C22' : '#8C734B' }}>
                                {isSelected ? 'SELECTED' : loc.isAvailable ? 'SELECT' : 'COMING SOON'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --------------------------------------------------------
                    STEP 02 — SELECT SERVICE
                    -------------------------------------------------------- */}
                {step === 2 && (
                  <div className="avs-step-transition-enter">
                    <div className="avs-step-header">
                      <span className="avs-step-badge-eyebrow">STEP 02 OF 05</span>
                      <h2 className="avs-step-heading">
                        What can we<br />help you with?
                      </h2>
                      <p className="avs-step-subtext">
                        Choose the service you'd like to book from our signature offerings.
                      </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="avs-service-category-tabs" role="tablist">
                      {SERVICE_CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          className={`avs-service-tab ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat)}
                          role="tab"
                          aria-selected={selectedCategory === cat}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Services Grid */}
                    <div className="avs-services-grid">
                      {filteredServices.map((svc) => {
                        const isSelected = selectedService?.id === svc.id;
                        return (
                          <div
                            key={svc.id}
                            className={`avs-service-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedService(svc)}
                            role="button"
                            tabIndex={0}
                            aria-pressed={isSelected}
                          >
                            <div className="avs-service-card-img-wrap">
                              <img
                                src={svc.image}
                                alt={svc.title}
                                className="avs-service-card-img"
                              />
                              <span className="avs-service-card-badge">{svc.category}</span>
                              <span className="avs-service-card-check" aria-hidden="true">
                                {isSelected ? '✓' : ''}
                              </span>
                            </div>

                            <div className="avs-service-card-body">
                              <div>
                                <h3 className="avs-service-card-title">{svc.title}</h3>
                                <p className="avs-service-card-desc">{svc.desc}</p>
                              </div>
                              <div className="avs-service-card-meta">
                                <span>{svc.duration}</span>
                                <span>{isSelected ? '✓ Selected' : 'Select Service'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* --------------------------------------------------------
                    STEP 03 — DATE & TIME
                    -------------------------------------------------------- */}
                {step === 3 && (
                  <div className="avs-step-transition-enter">
                    <div className="avs-step-header">
                      <span className="avs-step-badge-eyebrow">STEP 03 OF 05</span>
                      <h2 className="avs-step-heading">
                        Find a time<br />that works for you.
                      </h2>
                      <p className="avs-step-subtext">
                        Choose your preferred appointment date and available time.
                      </p>
                    </div>

                    <div className="avs-datetime-container">
                      {/* Left: Interactive Calendar */}
                      <div className="avs-calendar-card">
                        <div className="avs-calendar-header">
                          <h3 className="avs-calendar-month-label">
                            {monthNames[calMonth]} {calYear}
                          </h3>
                          <div className="avs-calendar-nav-btns">
                            <button
                              type="button"
                              className="avs-calendar-nav-btn"
                              onClick={handlePrevMonth}
                              aria-label="Previous month"
                            >
                              &lsaquo;
                            </button>
                            <button
                              type="button"
                              className="avs-calendar-nav-btn"
                              onClick={handleNextMonth}
                              aria-label="Next month"
                            >
                              &rsaquo;
                            </button>
                          </div>
                        </div>

                        <div className="avs-calendar-weekdays">
                          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>

                        <div className="avs-calendar-grid">
                          {calendarCells.map((cell) => {
                            if (cell.empty) {
                              return <div key={cell.key} className="avs-cal-day empty" />;
                            }
                            return (
                              <button
                                key={cell.key}
                                type="button"
                                className={`avs-cal-day ${cell.isSelected ? 'selected' : ''} ${cell.isToday ? 'today' : ''}`}
                                disabled={cell.isPast}
                                onClick={() => setSelectedDate(cell.dateStr)}
                              >
                                {cell.day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Available Times */}
                      <div className="avs-times-card">
                        <h3 className="avs-times-header">Available Times</h3>
                        <p style={{ fontSize: '0.84rem', color: '#5C6762', marginBottom: '8px' }}>
                          {formatLuxuryDate(selectedDate)}
                        </p>

                        {availableSlots.length === 0 ? (
                          <div className="avs-no-times-box">
                            <p>No times are currently available for this date.</p>
                            <button
                              type="button"
                              className="avs-no-times-btn"
                              onClick={handleNextMonth}
                            >
                              CHOOSE ANOTHER DATE &rarr;
                            </button>
                          </div>
                        ) : (
                          <div className="avs-time-slots-grid">
                            {availableSlots.map((slot) => {
                              const isSelected = selectedTime === slot.time;
                              return (
                                <button
                                  key={slot.time}
                                  type="button"
                                  className={`avs-time-btn ${isSelected ? 'selected' : ''}`}
                                  disabled={slot.booked}
                                  onClick={() => setSelectedTime(slot.time)}
                                >
                                  {slot.time}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --------------------------------------------------------
                    STEP 04 — YOUR DETAILS
                    -------------------------------------------------------- */}
                {step === 4 && (
                  <div className="avs-step-transition-enter">
                    <div className="avs-step-header">
                      <span className="avs-step-badge-eyebrow">STEP 04 OF 05</span>
                      <h2 className="avs-step-heading">
                        Tell us a little<br />about you.
                      </h2>
                      <p className="avs-step-subtext">
                        We'll use these details to confirm your appointment and tailor your visit.
                      </p>
                    </div>

                    <div className="avs-details-form-grid">
                      <div className="avs-form-field">
                        <label className="avs-form-label" htmlFor="cust-name">
                          FULL NAME <span className="required">*</span>
                        </label>
                        <input
                          id="cust-name"
                          type="text"
                          className={`avs-form-input ${errors.name ? 'error' : ''}`}
                          placeholder="e.g. Jane Doe"
                          value={customerDetails.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          autoComplete="name"
                        />
                        {errors.name && <span className="avs-form-error-msg">{errors.name}</span>}
                      </div>

                      <div className="avs-form-field">
                        <label className="avs-form-label" htmlFor="cust-phone">
                          PHONE NUMBER <span className="required">*</span>
                        </label>
                        <input
                          id="cust-phone"
                          type="tel"
                          className={`avs-form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="(647) 000-0000"
                          value={customerDetails.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          autoComplete="tel"
                        />
                        {errors.phone && <span className="avs-form-error-msg">{errors.phone}</span>}
                      </div>

                      <div className="avs-form-field span-full">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <label className="avs-form-label" htmlFor="cust-email" style={{ margin: 0 }}>
                            EMAIL ADDRESS <span className="required">*</span>
                          </label>
                          {isEmailVerified ? (
                            <span className="avs-verified-badge">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              EMAIL VERIFIED
                            </span>
                          ) : (
                            <span className="avs-otp-status-badge unverified">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" />
                              </svg>
                              OTP Verification Required
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input
                            id="cust-email"
                            type="email"
                            className={`avs-form-input ${errors.email ? 'error' : ''}`}
                            placeholder="jane.doe@example.com"
                            value={customerDetails.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={isEmailVerified}
                            autoComplete="email"
                            style={{ flex: 1 }}
                          />
                          {!isEmailVerified ? (
                            <button
                              type="button"
                              className="avs-btn-send-otp"
                              onClick={handleSendOtp}
                              disabled={otpSending || !customerDetails.email}
                            >
                              {otpSending ? 'SENDING...' : otpSent ? 'RESEND OTP' : 'SEND OTP'}
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="avs-btn-change-email"
                              onClick={() => {
                                setIsEmailVerified(false);
                                setOtpSent(false);
                                setOtpInput('');
                              }}
                            >
                              CHANGE
                            </button>
                          )}
                        </div>
                        {errors.email && <span className="avs-form-error-msg">{errors.email}</span>}

                        {/* OTP Verification Input Box */}
                        {otpSent && !isEmailVerified && (
                          <div className="avs-otp-box">
                            <div className="avs-otp-header">
                              <span className="avs-otp-title">ENTER 6-DIGIT OTP VERIFICATION CODE</span>
                              <span className="avs-otp-subtitle">A verification code has been dispatched to <strong>{customerDetails.email}</strong>.</span>
                            </div>
                            <div className="avs-otp-input-row">
                              <input
                                type="text"
                                maxLength={6}
                                className={`avs-form-input avs-otp-input ${otpError ? 'error' : ''}`}
                                placeholder="0 0 0 0 0 0"
                                value={otpInput}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                  setOtpInput(val);
                                  if (val.length === 6 && sentOtpCode && val === sentOtpCode.trim()) {
                                    handleVerifyOtp(val);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                className="avs-btn-verify-otp"
                                onClick={() => handleVerifyOtp()}
                              >
                                VERIFY OTP
                              </button>
                            </div>
                            {otpSuccessMsg && <p className="avs-otp-msg-success">{otpSuccessMsg}</p>}
                            {otpError && <p className="avs-otp-msg-error">{otpError}</p>}
                          </div>
                        )}

                        {isEmailVerified && otpSuccessMsg && (
                          <p className="avs-otp-msg-success" style={{ marginTop: '8px' }}>{otpSuccessMsg}</p>
                        )}
                      </div>

                      <div className="avs-form-field span-full">
                        <label className="avs-form-label" htmlFor="cust-notes">
                          ADDITIONAL NOTES <span style={{ textTransform: 'none', color: '#7E8B84' }}>(optional)</span>
                        </label>
                        <textarea
                          id="cust-notes"
                          rows="3"
                          className="avs-form-textarea"
                          placeholder="Any physical preferences, pressure level, focus areas, or special health accommodations..."
                          value={customerDetails.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="avs-form-privacy-assurance">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                      <span>We respect your privacy. Your email will be verified via a 6-digit OTP code before confirmation.</span>
                    </div>
                  </div>
                )}

                {/* --------------------------------------------------------
                    STEP 05 — REVIEW & CONFIRM
                    -------------------------------------------------------- */}
                {step === 5 && (
                  <div className="avs-step-transition-enter">
                    {isSubmitting ? (
                      <div className="avs-submitting-container">
                        <div className="avs-gold-spinner-ring"></div>
                        <h3 className="avs-submitting-title">CONFIRMING YOUR APPOINTMENT...</h3>
                        <p className="avs-submitting-subtitle">Connecting with Aura Vital Star reservation concierge.</p>
                      </div>
                    ) : (
                      <>
                        <div className="avs-step-header">
                          <span className="avs-step-badge-eyebrow">STEP 05 OF 05</span>
                          <h2 className="avs-step-heading">
                            Almost there.
                          </h2>
                          <p className="avs-step-subtext">
                            Review your appointment details before confirming.
                          </p>
                        </div>

                        <div className="avs-review-summary-grid">
                          {/* Location */}
                          <div className="avs-review-item-card">
                            <div className="avs-review-item-main">
                              <span className="avs-review-label">Location</span>
                              <span className="avs-review-value">{selectedLocation?.name}</span>
                              <span className="avs-review-subtext">{selectedLocation?.address}</span>
                            </div>
                            <button
                              type="button"
                              className="avs-review-edit-btn"
                              onClick={() => setStep(1)}
                            >
                              EDIT &rarr;
                            </button>
                          </div>

                          {/* Service */}
                          <div className="avs-review-item-card">
                            <div className="avs-review-item-main">
                              <span className="avs-review-label">Service</span>
                              <span className="avs-review-value">{selectedService?.title}</span>
                              <span className="avs-review-subtext">{selectedService?.duration} &bull; {selectedService?.category}</span>
                            </div>
                            <button
                              type="button"
                              className="avs-review-edit-btn"
                              onClick={() => setStep(2)}
                            >
                              EDIT &rarr;
                            </button>
                          </div>

                          {/* Date & Time */}
                          <div className="avs-review-item-card">
                            <div className="avs-review-item-main">
                              <span className="avs-review-label">Date &amp; Time</span>
                              <span className="avs-review-value">
                                {formatLuxuryDate(selectedDate)} at {selectedTime}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="avs-review-edit-btn"
                              onClick={() => setStep(3)}
                            >
                              EDIT &rarr;
                            </button>
                          </div>

                          {/* Customer */}
                          <div className="avs-review-item-card">
                            <div className="avs-review-item-main">
                              <span className="avs-review-label">Customer Details</span>
                              <span className="avs-review-value">{customerDetails.name}</span>
                              <span className="avs-review-subtext">
                                {customerDetails.phone} &bull; {customerDetails.email}
                                <span
                                  className="avs-otp-status-badge verified"
                                  style={{
                                    display: 'inline-flex',
                                    verticalAlign: 'middle',
                                    marginLeft: '8px',
                                    fontSize: '0.68rem',
                                    padding: '1px 8px'
                                  }}
                                >
                                  ✓ Verified
                                </span>
                              </span>
                              {customerDetails.notes && (
                                <span className="avs-review-subtext" style={{ marginTop: '4px', fontStyle: 'italic' }}>
                                  Note: "{customerDetails.notes}"
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              className="avs-review-edit-btn"
                              onClick={() => setStep(4)}
                            >
                              EDIT &rarr;
                            </button>
                          </div>
                        </div>

                        <p className="avs-review-disclaimer">
                          By confirming, you agree to be contacted regarding your appointment coordination and reminders.
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* STEP ACTION NAVIGATION BAR */}
                {!isSubmitting && (
                  <div className="avs-step-action-bar">
                    <button
                      type="button"
                      className="avs-btn-back"
                      onClick={goToPrevStep}
                    >
                      &larr; BACK
                    </button>

                    {step < 5 ? (
                      <button
                        type="button"
                        className="avs-btn-continue"
                        onClick={goToNextStep}
                        id="btn-continue-step"
                        disabled={
                          (step === 1 && !selectedLocation) ||
                          (step === 2 && !selectedService) ||
                          (step === 3 && (!selectedDate || !selectedTime))
                        }
                      >
                        <span>CONTINUE</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="avs-btn-continue"
                        onClick={handleConfirmAppointment}
                        id="btn-confirm-booking"
                      >
                        <span>CONFIRM APPOINTMENT</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            STEP 06: FULL-SCREEN SUCCESS SCREEN
            ================================================================== */}
        {step === 6 && confirmedBooking && (
          <section className="avs-success-container avs-step-transition-enter" aria-label="Appointment Confirmation">
            <div className="avs-success-check-badge">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <p className="avs-success-eyebrow">APPOINTMENT REQUEST RECEIVED</p>
            <h1 className="avs-success-headline">
              Thank you, {confirmedBooking.customerName}.
            </h1>

            <p className="avs-success-message">
              Your appointment request has been successfully submitted. We've recorded your booking under reference <strong>{confirmedBooking.id}</strong> and sent the complete appointment details to <strong>{confirmedBooking.email}</strong>.
            </p>

            <div className="avs-success-recap-card">
              <div className="avs-success-recap-field">
                <span className="avs-review-label">Service</span>
                <span className="avs-review-value">{confirmedBooking.service}</span>
                <span className="avs-review-subtext">{confirmedBooking.duration}</span>
              </div>

              <div className="avs-success-recap-field">
                <span className="avs-review-label">Location</span>
                <span className="avs-review-value">{confirmedBooking.location}</span>
              </div>

              <div className="avs-success-recap-field">
                <span className="avs-review-label">Date &amp; Time</span>
                <span className="avs-review-value">
                  {formatLuxuryDate(confirmedBooking.date)} at {confirmedBooking.time}
                </span>
              </div>

              <div className="avs-success-recap-field">
                <span className="avs-review-label">Booking Source</span>
                <span className="avs-review-value" style={{ color: '#987739' }}>
                  {confirmedBooking.source}
                </span>
              </div>
            </div>

            <div className="avs-success-actions-row">
              <button
                type="button"
                className="avs-btn-primary-success"
                onClick={() => {
                  if (onBackToHome) onBackToHome();
                }}
              >
                BACK TO AURA VITAL STAR &rarr;
              </button>

              <button
                type="button"
                className="avs-btn-secondary-success"
                onClick={handleBookAnother}
              >
                BOOK ANOTHER APPOINTMENT
              </button>
            </div>

            <div className="avs-email-preview-trigger-wrap">
              <button
                type="button"
                className="avs-btn-preview-emails"
                onClick={() => setShowEmailModal(true)}
              >
                Inspect Generated Confirmation &amp; Admin Notification Emails &rarr;
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ====================================================================
          MODAL 01: EMAIL CONFIRMATION PREVIEW (CUSTOMER & ADMIN)
          ==================================================================== */}
      {showEmailModal && (
        <div className="avs-modal-backdrop" onClick={() => setShowEmailModal(false)}>
          <div className="avs-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="avs-modal-header">
              <h3 className="avs-modal-title">Email Notification Engine</h3>
              <button
                type="button"
                className="avs-modal-close-btn"
                onClick={() => setShowEmailModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="avs-modal-tabs">
              <button
                type="button"
                className={`avs-modal-tab-btn ${emailModalTab === 'customer' ? 'active' : ''}`}
                onClick={() => setEmailModalTab('customer')}
              >
                Customer Confirmation Email
              </button>
              <button
                type="button"
                className={`avs-modal-tab-btn ${emailModalTab === 'admin' ? 'active' : ''}`}
                onClick={() => setEmailModalTab('admin')}
              >
                Admin CRM Notification Email
              </button>
            </div>

            <div className="avs-modal-body">
              {emailModalTab === 'customer' ? (
                <div className="avs-email-preview-frame">
                  <table className="avs-email-meta-table">
                    <tbody>
                      <tr>
                        <td className="avs-email-meta-label">To:</td>
                        <td>{confirmedBooking?.email || customerDetails.email || 'client@example.com'}</td>
                      </tr>
                      <tr>
                        <td className="avs-email-meta-label">From:</td>
                        <td>Aura Vital Star &lt;concierge@auravitalstar.ca&gt;</td>
                      </tr>
                      <tr>
                        <td className="avs-email-meta-label">Subject:</td>
                        <td>Your Aura Vital Star Appointment Confirmation [{confirmedBooking?.id || 'AVS-2026-8941'}]</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ padding: '16px 0', borderTop: '1px solid #EAE3D6' }}>
                    <p style={{ marginBottom: '14px' }}>
                      Hi {confirmedBooking?.customerName || customerDetails.name || 'Valued Guest'},
                    </p>
                    <p style={{ marginBottom: '14px' }}>
                      Thank you for choosing Aura Vital Star. We have received your appointment request and are looking forward to welcoming you into our sanctuary.
                    </p>

                    <div style={{ background: '#FAF7F2', border: '1px solid #E2D9CB', borderRadius: '8px', padding: '14px 18px', margin: '18px 0' }}>
                      <h4 style={{ color: '#062C22', marginBottom: '8px', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem' }}>
                        Appointment Details:
                      </h4>
                      <p style={{ margin: '4px 0' }}><strong>Service:</strong> {confirmedBooking?.service || selectedService?.title}</p>
                      <p style={{ margin: '4px 0' }}><strong>Location:</strong> {confirmedBooking?.location || selectedLocation?.name}</p>
                      <p style={{ margin: '4px 0' }}><strong>Date:</strong> {formatLuxuryDate(confirmedBooking?.date || selectedDate)}</p>
                      <p style={{ margin: '4px 0' }}><strong>Time:</strong> {confirmedBooking?.time || selectedTime}</p>
                      <p style={{ margin: '4px 0' }}><strong>Duration:</strong> {confirmedBooking?.duration || selectedService?.duration}</p>
                    </div>

                    <p style={{ marginBottom: '14px' }}>
                      We look forward to welcoming you.
                    </p>
                    <p style={{ fontWeight: 600, color: '#062C22' }}>
                      Aura Vital Star Rejuvenation Centre<br />
                      <span style={{ fontSize: '0.85rem', color: '#8C734B' }}>157 Queen Street West, Brampton, ON &bull; +1 647-987-5451</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="avs-email-preview-frame">
                  <table className="avs-email-meta-table">
                    <tbody>
                      <tr>
                        <td className="avs-email-meta-label">To:</td>
                        <td>admin@auravitalstar.ca</td>
                      </tr>
                      <tr>
                        <td className="avs-email-meta-label">Subject:</td>
                        <td>NEW APPOINTMENT — AURA VITAL STAR [{confirmedBooking?.id || 'AVS-2026-8941'}]</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ padding: '16px 0', borderTop: '1px solid #EAE3D6' }}>
                    <p style={{ marginBottom: '12px', fontWeight: 600, color: '#062C22' }}>
                      A new appointment has been booked:
                    </p>

                    <div style={{ background: '#FAF7F2', border: '1px solid #E2D9CB', borderRadius: '8px', padding: '14px 18px', margin: '14px 0' }}>
                      <p style={{ margin: '4px 0' }}><strong>Customer Name:</strong> {confirmedBooking?.customerName || customerDetails.name || 'Valued Guest'}</p>
                      <p style={{ margin: '4px 0' }}><strong>Phone:</strong> {confirmedBooking?.phone || customerDetails.phone}</p>
                      <p style={{ margin: '4px 0' }}><strong>Email:</strong> {confirmedBooking?.email || customerDetails.email}</p>
                      <p style={{ margin: '4px 0' }}><strong>Service:</strong> {confirmedBooking?.service || selectedService?.title}</p>
                      <p style={{ margin: '4px 0' }}><strong>Location:</strong> {confirmedBooking?.location || selectedLocation?.name}</p>
                      <p style={{ margin: '4px 0' }}><strong>Date:</strong> {formatLuxuryDate(confirmedBooking?.date || selectedDate)}</p>
                      <p style={{ margin: '4px 0' }}><strong>Time:</strong> {confirmedBooking?.time || selectedTime}</p>
                      <p style={{ margin: '4px 0' }}><strong>Notes:</strong> {confirmedBooking?.notes || customerDetails.notes || 'None provided'}</p>
                      <p style={{ margin: '4px 0' }}><strong>Channel / Source:</strong> {confirmedBooking?.source || bookingSource}</p>
                    </div>

                    <button
                      type="button"
                      className="avs-btn-continue"
                      style={{ marginTop: '10px' }}
                      onClick={() => {
                        setShowEmailModal(false);
                        setShowCrmModal(true);
                      }}
                    >
                      VIEW IN CRM &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 02: CRM MANAGEMENT DRAWER / DIALOG
          ==================================================================== */}
      {showCrmModal && (
        <div className="avs-modal-backdrop" onClick={() => setShowCrmModal(false)}>
          <div className="avs-modal-card" style={{ maxWidth: '960px' }} onClick={(e) => e.stopPropagation()}>
            <div className="avs-modal-header">
              <h3 className="avs-modal-title">Aura Vital Star CRM &bull; Appointments</h3>
              <button
                type="button"
                className="avs-modal-close-btn"
                onClick={() => setShowCrmModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="avs-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: '#5C6762', margin: 0 }}>
                  Showing <strong>{crmBookings.length}</strong> total appointment records stored.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="avs-crm-quick-link"
                    onClick={() => {
                      // Filter simulation or refresh
                      setCrmBookings(getBookings());
                    }}
                  >
                    Refresh
                  </button>
                </div>
              </div>

              <div className="avs-crm-table-wrap">
                <table className="avs-crm-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th>Date / Time</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {crmBookings.map((b) => (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>
                          <div>{b.customerName}</div>
                          <small style={{ color: '#5C6762' }}>{b.phone}</small>
                        </td>
                        <td>
                          <div>{b.service}</div>
                          <small style={{ color: '#8C734B' }}>{b.location}</small>
                        </td>
                        <td>
                          <div>{b.date}</div>
                          <small style={{ color: '#062C22', fontWeight: 600 }}>{b.time}</small>
                        </td>
                        <td>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '10px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            background: b.source === 'QR Code' ? '#FDF2E9' : '#EDF8F5',
                            color: b.source === 'QR Code' ? '#B9770E' : '#0B5345'
                          }}>
                            {b.source}
                          </span>
                        </td>
                        <td>
                          <span className={`avs-crm-status-pill ${b.status}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={b.status}
                            onChange={(e) => {
                              const updated = updateBookingStatus(b.id, e.target.value);
                              setCrmBookings(updated);
                            }}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #CCC',
                              fontSize: '0.76rem',
                              background: '#FFF'
                            }}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 03: QR CODE PREVIEW & SIMULATOR
          ==================================================================== */}
      {showQrModal && (
        <div className="avs-modal-backdrop" onClick={() => setShowQrModal(false)}>
          <div className="avs-modal-card" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="avs-modal-header">
              <h3 className="avs-modal-title">Clinic QR Code Destination</h3>
              <button
                type="button"
                className="avs-modal-close-btn"
                onClick={() => setShowQrModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="avs-modal-body" style={{ padding: '32px 24px' }}>
              <p style={{ fontSize: '0.86rem', color: '#5C6762', marginBottom: '18px' }}>
                Scan to instantly access the Aura Vital Star concierge booking flow from physical signage in Brampton.
              </p>

              <div style={{
                margin: '0 auto 20px auto',
                width: '200px',
                height: '200px',
                padding: '12px',
                background: '#FFFFFF',
                border: '2px solid #B9975B',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(6, 44, 34, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Visual SVG QR Code Mockup */}
                <svg viewBox="0 0 100 100" width="170" height="170">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Position markers */}
                  <rect x="5" y="5" width="26" height="26" fill="#062C22" />
                  <rect x="8" y="8" width="20" height="20" fill="#ffffff" />
                  <rect x="12" y="12" width="12" height="12" fill="#B9975B" />

                  <rect x="69" y="5" width="26" height="26" fill="#062C22" />
                  <rect x="72" y="8" width="20" height="20" fill="#ffffff" />
                  <rect x="76" y="12" width="12" height="12" fill="#B9975B" />

                  <rect x="5" y="69" width="26" height="26" fill="#062C22" />
                  <rect x="8" y="72" width="20" height="20" fill="#ffffff" />
                  <rect x="12" y="76" width="12" height="12" fill="#B9975B" />

                  {/* QR Data Matrix simulation */}
                  <rect x="36" y="8" width="6" height="6" fill="#062C22" />
                  <rect x="46" y="8" width="6" height="6" fill="#062C22" />
                  <rect x="56" y="14" width="6" height="6" fill="#062C22" />
                  <rect x="36" y="24" width="6" height="6" fill="#062C22" />
                  <rect x="46" y="34" width="8" height="8" fill="#B9975B" />
                  <rect x="8" y="42" width="6" height="6" fill="#062C22" />
                  <rect x="22" y="42" width="6" height="6" fill="#062C22" />
                  <rect x="62" y="42" width="6" height="6" fill="#062C22" />
                  <rect x="82" y="42" width="6" height="6" fill="#062C22" />
                  <rect x="36" y="56" width="6" height="6" fill="#062C22" />
                  <rect x="48" y="56" width="6" height="6" fill="#062C22" />
                  <rect x="74" y="56" width="6" height="6" fill="#062C22" />
                  <rect x="42" y="72" width="6" height="6" fill="#062C22" />
                  <rect x="58" y="72" width="6" height="6" fill="#062C22" />
                  <rect x="42" y="84" width="6" height="6" fill="#062C22" />
                  <rect x="70" y="84" width="6" height="6" fill="#062C22" />
                  <rect x="84" y="72" width="6" height="6" fill="#062C22" />
                </svg>
              </div>

              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#062C22', marginBottom: '16px' }}>
                Target URL: <code>/booking?source=qr</code>
              </p>

              <button
                type="button"
                className="avs-btn-continue"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setBookingSource('QR Code');
                  setShowQrModal(false);
                  setStep(0);
                }}
              >
                SIMULATE QR CODE SCAN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------
          OTP VERIFICATION MODAL OVERLAY
          -------------------------------------------------------- */}
      {showOtpModal && (
        <div className="avs-modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="avs-otp-modal-container" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="avs-modal-close-btn"
              onClick={() => setShowOtpModal(false)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="avs-otp-modal-header">
              <div className="avs-otp-shield-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#DFBE77" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" stroke="#DFBE77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="avs-otp-modal-title">Verify Your Email</h3>
              <p className="avs-otp-modal-subtitle">
                We've dispatched a 6-digit verification code to<br />
                <u>{customerDetails.email}</u>
              </p>
            </div>

            <div className="avs-otp-modal-body">
              {otpError && (
                <div className="avs-otp-alert-box avs-otp-alert-error">
                  <span className="avs-otp-alert-icon">!</span>
                  <span>{otpError}</span>
                </div>
              )}

              {otpSuccessMsg && !otpError && (
                <div className="avs-otp-alert-box avs-otp-alert-success">
                  <span className="avs-otp-alert-icon">✓</span>
                  <span>{otpSuccessMsg}</span>
                </div>
              )}

              <div className="avs-otp-digit-row" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`avs-otp-digit-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className={`avs-otp-digit-input ${otpError ? 'error' : ''} ${digit ? 'filled' : ''}`}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <button
                type="button"
                className="avs-btn-verify-proceed"
                onClick={() => handleVerifyOtp()}
                disabled={otpDigits.join('').length < 6 && (!otpInput || otpInput.length < 6)}
              >
                VERIFY &amp; PROCEED &rarr;
              </button>
            </div>

            <div className="avs-otp-modal-footer">
              <span className="avs-otp-resend-status">
                {isTimerActive ? (
                  <>Resend code in <strong>00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</strong></>
                ) : (
                  <button
                    type="button"
                    className="avs-otp-resend-btn"
                    onClick={handleSendOtp}
                    disabled={otpSending}
                  >
                    {otpSending ? 'Sending code...' : 'Resend Code'}
                  </button>
                )}
              </span>

              <button
                type="button"
                className="avs-otp-edit-email-btn"
                onClick={() => setShowOtpModal(false)}
              >
                Edit Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
