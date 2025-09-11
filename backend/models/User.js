const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: [String], default: [] }, // now an array of strings
  role: { type: String, default: "user" },
  contacted: { type: Boolean, default: false },
  note: { type: String, default: "" },
  tags: [String],
  lastContactedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
