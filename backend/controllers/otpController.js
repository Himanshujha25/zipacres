const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require('twilio')(accountSid, authToken);

// send OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });
    res.json({ success: true, sid: verification.sid });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// check OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });
    if (check.status === 'approved') {
      return res.json({ success: true, message: 'Phone verified' });
    }
    res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
