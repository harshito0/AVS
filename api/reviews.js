import { getReviews, addReview, deleteReview } from './crmStore.js';

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const method = req.method;
  const bodyPromise = (method === 'POST' || method === 'DELETE') ? readBody(req) : Promise.resolve({});

  if (method === 'GET') {
    try {
      const reviews = await getReviews();
      return res.status(200).json({ success: true, reviews, data: reviews });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      return res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
  }

  if (method === 'POST') {
    try {
      const body = await bodyPromise;
      const { name, author, quote, message, rating, service } = body || {};
      const authorName = (name || author || '').trim();
      const quoteText = (quote || message || '').trim();

      if (!authorName || !quoteText) {
        return res.status(400).json({ success: false, error: 'Name and review message are required.' });
      }

      const newReview = await addReview({
        author: authorName,
        quote: quoteText,
        rating: Number(rating) || 5,
        service: service || 'Registered Massage Therapy (RMT)'
      });

      const reviews = await getReviews();
      return res.status(201).json({ success: true, review: newReview, data: newReview, reviews });
    } catch (err) {
      console.error('Error submitting review:', err);
      return res.status(500).json({ success: false, error: 'Failed to process review' });
    }
  }

  if (method === 'DELETE') {
    try {
      const body = await bodyPromise;
      const id = req.query?.id || body?.id || (req.url && req.url.split('?')[0].split('/').filter(Boolean).pop());
      if (!id || id === 'reviews') {
        return res.status(400).json({ success: false, error: 'Review ID is required to delete' });
      }

      const result = await deleteReview(id);
      const reviews = await getReviews();
      return res.status(200).json({ success: true, deleted: result.success, id, reviews });
    } catch (err) {
      console.error('Error deleting review:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete review' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
