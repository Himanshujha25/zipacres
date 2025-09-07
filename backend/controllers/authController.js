const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");


const JWT_SECRET = process.env.JWT_SECRET || "ZIPCARE";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const ADMIN_CODE = process.env.ADMIN_CODE || "12345";

if (!JWT_SECRET || !GOOGLE_CLIENT_ID || !ADMIN_CODE) {
  throw new Error("Missing required environment variables");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ========== Manual Register ==========
exports.register = async (req, res) => {

  try {
    const { name, email, password, role, adminCode } = req.body;
    console.log("Register request body:", req.body);
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    if (role === "admin" && adminCode !== ADMIN_CODE) {
      return res.status(403).json({ success: false, message: "Invalid admin code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ========== Manual Login ==========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ========== Google Signup/Login ==========


exports.googleAuth = async (req, res) => {
  try {
    const { tokenId, email, name } = req.body;

    let profileEmail = email;
    let profileName = name;

    // If using tokenId, verify with Google
    if (tokenId) {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      profileEmail = payload.email;
      profileName = payload.name;
    }

    // Check if user exists
    let user = await User.findOne({ email: profileEmail });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        name: profileName,
        email: profileEmail,
        password: null,
        role: "user",
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      success: true,
      message: isNewUser ? "Signup successful" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      success: false,
      message: "Google authentication failed",
      error: error.message,
    });
  }
};
