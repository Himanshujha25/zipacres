const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, // this already creates index
      lowercase: true, 
      trim: true,
      validate: {
        validator: function(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
      }
    },
    phone: {
      type: String,
      required: true,
      default: "",
      unique: true // also creates index
    },
    password: { type: String, minlength: [6, "Password must be at least 6 characters long"] },
    role: { 
      type: String, 
      enum: ["user", "admin", "agent"], 
      default: "user" 
    },
    contacted: { type: Boolean, default: false },
    note: { type: String, default: "", trim: true },
    tags: { type: [String], default: [] },
    lastContactedAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// keep only extra indexes
UserSchema.index({ role: 1 }); // ok, this one stays

module.exports = mongoose.model("User", UserSchema);
