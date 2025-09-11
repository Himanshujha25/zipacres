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
    const { name, email, password, role, adminCode, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role || !phoneNumber) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields including phone number are required",
        missingFields: {
          name: !name,
          email: !email, 
          password: !password,
          role: !role,
          phoneNumber: !phoneNumber
        }
      });
    }

    // Validate phone number format (basic validation)
    if (phoneNumber.length < 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Phone number must be at least 10 digits" 
      });
    }

    // Check for duplicate email or phoneNumber
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({ 
          success: false, 
          message: "Phone number already exists" 
        });
      }
    }

    // Admin code validation
    if (role === "admin" && adminCode !== ADMIN_CODE) {
      return res.status(403).json({ 
        success: false, 
        message: "Invalid admin code" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });

    // Save user
    const savedUser = await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        phoneNumber: savedUser.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        errors 
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        success: false, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ================= Manual Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password required" 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password" 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phoneNumber: user.phoneNumber 
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// ================= Google Auth =================
exports.googleAuth = async (req, res) => {
  try {
    const { tokenId, phoneNumber } = req.body; // Accept phoneNumber in request
    
    const ticket = await client.verifyIdToken({ 
      idToken: tokenId, 
      audience: GOOGLE_CLIENT_ID 
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      
      // For new Google users, phoneNumber is required
      if (!phoneNumber) {
        return res.status(400).json({
          success: false,
          message: "Phone number is required for new accounts",
          requiresPhoneNumber: true
        });
      }
      
      // Check if phone number already exists
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number already exists"
        });
      }
      
      user = new User({
        name: payload.name,
        email: payload.email,
        password: null,
        role: "user",
        phoneNumber: phoneNumber,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: "1d" }
    );

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
    console.error("Google auth error:", error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        success: false, 
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Google auth failed", 
      error: error.message 
    });
  }
};