// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true, 
      trim: true,
      validate: {
        validator: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v),
        message: "Please enter a valid email"
      }
    },
    phone: {
      type: Number,         // 👈 now it’s a Number
      required: true,
      unique: true
    },
    password: { type: String, minlength: [6, "Password must be at least 6 characters long"] },
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    contacted: { type: Boolean, default: false },
    note: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

module.exports = mongoose.model("User", UserSchema);
