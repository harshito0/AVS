import fs from 'fs';
import path from 'path';

const INITIAL_REVIEWS = [
  {
    id: "t-1",
    quote: "The massage was incredible! I felt relaxed and recharged.",
    author: "Priya M.",
    service: "Registered Massage Therapy",
    rating: 5,
    avatar: "PM",
    date: "Recent",
    createdAt: "2026-08-15T10:00:00.000Z"
  },
  {
    id: "t-2",
    quote: "Amazing facial treatment. My skin has never felt this good.",
    author: "Neha R.",
    service: "Aesthetic & Skin Therapy",
    rating: 5,
    avatar: "NR",
    date: "Recent",
    createdAt: "2026-08-20T14:30:00.000Z"
  },
  {
    id: "t-3",
    quote: "The orthotics have made a huge difference in my daily comfort.",
    author: "Arjun S.",
    service: "Custom Orthotics Care",
    rating: 5,
    avatar: "AS",
    date: "Recent",
    createdAt: "2026-08-28T09:15:00.000Z"
  }
];

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const reviewsFile = path.join(process.cwd(), 'server', 'data', 'reviews.json');

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(reviewsFile)) {
        const fileData = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        return res.status(200).json({ success: true, reviews: fileData });
      }
      return res.status(200).json({ success: true, reviews: INITIAL_REVIEWS });
    } catch (err) {
      console.error('Error reading reviews:', err);
      return res.status(200).json({ success: true, reviews: INITIAL_REVIEWS });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, quote, rating, service } = req.body || {};
      if (!name || !name.trim() || !quote || !quote.trim()) {
        return res.status(400).json({ success: false, error: 'Name and review message are required.' });
      }

      let reviews = [...INITIAL_REVIEWS];
      try {
        if (fs.existsSync(reviewsFile)) {
          reviews = JSON.parse(fs.readFileSync(reviewsFile, 'utf8'));
        }
      } catch (e) {
        // use fallback
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
      try {
        fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2), 'utf8');
      } catch (writeErr) {
        console.warn('Could not persist to file in serverless mode:', writeErr);
      }

      return res.status(201).json({ success: true, review: newReview, reviews });
    } catch (err) {
      console.error('Error submitting review:', err);
      return res.status(500).json({ success: false, error: 'Failed to process review' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
