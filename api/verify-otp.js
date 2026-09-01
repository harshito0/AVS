// In-memory cache for serverless environment (note: best effort per instance)
let otpCache = global.__avs_otp_cache || new Map();
global.__avs_otp_cache = otpCache;

export default async function handler(req, res) {
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

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { email, otp } = req.body || {};
  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and 6-digit OTP code are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanOtp = otp.toString().trim();
  const record = otpCache.get(cleanEmail);

  if (!record) {
    return res.status(400).json({ 
      success: false, 
      error: 'No active OTP found for this email. Please click "Resend Code".' 
    });
  }

  if (Date.now() > record.expiresAt) {
    otpCache.delete(cleanEmail);
    return res.status(400).json({ 
      success: false, 
      error: 'The OTP code has expired. Please click "Resend Code".' 
    });
  }

  if (record.otp !== cleanOtp) {
    return res.status(400).json({ 
      success: false, 
      error: 'Incorrect verification code. Please check your email and try again.' 
    });
  }

  otpCache.delete(cleanEmail);
  return res.status(200).json({ success: true, message: 'Email verified successfully!' });
}
