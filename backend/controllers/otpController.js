
const accountSid = process.env.TWILIO_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const verifySid  = process.env.TWILIO_VERIFY_SID;

const client = require('twilio')(accountSid, authToken);

// send OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  console.log('📩 sendOtp called');
  console.log('phone received:', phone);
  console.log('verifySid being used:', verifySid);

  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phone, channel: 'sms' });

    console.log('✅ Twilio verification response:', verification);

    res.json({ success: true, sid: verification.sid, status: verification.status });
  } catch (err) {
    console.error('❌ Twilio sendOtp error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// check OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  console.log('📩 verifyOtp called');
  console.log('phone received:', phone, 'otp received:', otp);
  console.log('verifySid being used:', verifySid);

  try {
    const check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: phone, code: otp });

    console.log('✅ Twilio verification check response:', check);

    if (check.status === 'approved') {
      return res.json({ success: true, message: 'Phone verified', status: check.status });
    }

    res.status(400).json({ success: false, message: 'Invalid or expired OTP', status: check.status });
  } catch (err) {
    console.error('❌ Twilio verifyOtp error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
