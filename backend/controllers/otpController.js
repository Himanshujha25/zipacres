require('dotenv').config();
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// simple in-memory store for OTPs (use Redis/db in production)
const otpStore = new Map();

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min expiry

  try {
    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE,
      to: phone
    });
    res.json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  const record = otpStore.get(phone);
  if (!record) return res.status(400).json({ success: false, message: 'No OTP for this phone' });
  if (Date.now() > record.expires) return res.status(400).json({ success: false, message: 'OTP expired' });

  if (record.otp.toString() === otp.toString()) {
    otpStore.delete(phone);
    return res.json({ success: true, message: 'Phone verified' });
  }
  res.status(400).json({ success: false, message: 'Invalid OTP' });
};
