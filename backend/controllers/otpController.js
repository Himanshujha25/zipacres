const accountSid = process.env.TWILIO_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const verifySid  = process.env.TWILIO_VERIFY_SID;

const client = require('twilio')(accountSid, authToken);

// send OTP only via WhatsApp
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  console.log('📩 sendOtp (WhatsApp) called');
  console.log('phone received:', phone);
  console.log('verifySid being used:', verifySid);

  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: `whatsapp:${phone}`,
        channel: 'whatsapp'
      });

    console.log('✅ Twilio WhatsApp verification response:', verification);
    res.json({ success: true, sid: verification.sid, status: verification.status });
  } catch (err) {
    console.error('❌ Twilio sendOtp error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// check OTP (WhatsApp)
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  console.log('📩 verifyOtp (WhatsApp) called');
  console.log('phone received:', phone, 'otp received:', otp);
  console.log('verifySid being used:', verifySid);

  try {
    const check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: `whatsapp:${phone}`,
        code: otp
      });

    console.log('✅ Twilio WhatsApp verification check response:', check);

    if (check.status === 'approved') {
      return res.json({ success: true, message: 'Phone verified via WhatsApp', status: check.status });
    }

    res.status(400).json({ success: false, message: 'Invalid or expired OTP', status: check.status });
  } catch (err) {
    console.error('❌ Twilio verifyOtp error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
