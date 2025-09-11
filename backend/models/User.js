const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true }, 
    password: { type: String }, 
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    contacted: { type: Boolean, default: false },
    note: { type: String, default: "" },
    tags: { type: [String], default: [] },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
