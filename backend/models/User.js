const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, default: "" }, // store single phone number as string
    password: { type: String }, // can be null for Google-auth users
    role: { type: String, enum: ["user", "admin", "agent"], default: "user" },
    contacted: { type: Boolean, default: false },
    note: { type: String, default: "" },
    tags: { type: [String], default: [] },
    lastContactedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
