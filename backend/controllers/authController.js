const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "ZIPCARE";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const ADMIN_CODE = process.env.ADMIN_CODE || "12345";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ================= Manual Register =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adminCode, phone } = req.body;

    // ✅ Early validation
    if (!name || !email || !password || !role || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (role === "admin" && adminCode !== ADMIN_CODE) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid admin code" });
    }

    // ✅ Uniqueness check
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(409)
          .json({ success: false, message: "Email already exists" });
      }
      if (existingUser.phone === phone) {
        return res
          .status(409)
          .json({ success: false, message: "Phone already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phone, // keep as string
    });

    await newUser.validate(); // ✅ ensure validation passes before saving
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(409)
        .json({ success: false, message: `${field} already exists` });
    }
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// ================= Manual Login =================
// ================= Manual Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // ================= Send data to CRM =================
    try {
      const crmRes = await fetch("https://restapizip.iatpl.net/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Key": process.env.CRM_API_KEY, // move your key to .env
        },
        body: JSON.stringify({
          Name: user.name,
          MobileNumber: user.phone,
          Email: user.email,
          Message: "User login from Zipacres app",
        }),
      });

      const crmData = await crmRes.json();
      if (crmData.Success) {
        console.log("CRM saved:", crmData.Message);
      } else {
        console.error("CRM API failed:", crmData.Message);
      }
    } catch (crmErr) {
      console.error("Error sending to CRM API:", crmErr);
    }

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};


// ================= Google Auth =================
exports.googleAuth = async (req, res) => {
  try {
    const { tokenId, phone } = req.body; // Accept phone for new users

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: "Phone is required for new accounts",
          requiresPhone: true,
        });
      }

      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res
          .status(409)
          .json({ success: false, message: "Phone already exists" });
      }

      user = new User({
        name: payload.name,
        email: payload.email,
        password: null,
        role: "user",
        phone, // string
      });

      await user.validate();
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      success: true,
      message: isNewUser ? "Signup successful" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ success: false, message: error.message });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res
        .status(409)
        .json({
          success: false,
          message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Google auth failed",
        error: error.message,
      });
  }
};
