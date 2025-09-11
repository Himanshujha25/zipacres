const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");

const JWT_SECRET = process.env.JWT_SECRET || "ZIPCARE";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const ADMIN_CODE = process.env.ADMIN_CODE || "12345";

if (!JWT_SECRET || !GOOGLE_CLIENT_ID || !ADMIN_CODE) {
  throw new Error("Missing environment variables");
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// ================= Manual Register =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, adminCode, phoneNumber } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ success: false, message: "User already exists" });

    if (role === "admin" && adminCode !== ADMIN_CODE) {
      return res.status(403).json({ success: false, message: "Invalid admin code" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber: String(phoneNumber || ""), // ensure string
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================= Manual Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phoneNumber: user.phoneNumber },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ================= Google Auth =================
exports.googleAuth = async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        name: payload.name,
        email: payload.email,
        password: null,
        role: "user",
        phoneNumber: "", // default empty
      });
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: isNewUser ? "Signup successful" : "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Google auth failed", error: error.message });
  }
};
