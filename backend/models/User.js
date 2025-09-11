const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email"
      }
    },
    phoneNumber: { 
      type: String, 
      required: [true, "Phone number is required"], 
      unique: true,
      trim: true,
      validate: {
        validator: function(v) {
          // Remove all non-digit characters and check if it's at least 10 digits
          const digitsOnly = v.replace(/\D/g, '');
          return digitsOnly.length >= 10;
        },
        message: "Phone number must contain at least 10 digits"
      }
    },
    password: { 
      type: String,
      minlength: [6, "Password must be at least 6 characters long"]
    },
    role: { 
      type: String, 
      enum: {
        values: ["user", "admin", "agent"],
        message: "Role must be either user, admin, or agent"
      }, 
      default: "user" 
    },
    contacted: { 
      type: Boolean, 
      default: false 
    },
    note: { 
      type: String, 
      default: "",
      trim: true
    },
    tags: { 
      type: [String], 
      default: [] 
    },
    lastContactedAt: { 
      type: Date 
    },
  },
  { 
    timestamps: true,
    // Add this to ensure proper error handling
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save middleware to normalize phone number
UserSchema.pre('save', function(next) {
  if (this.phoneNumber) {
    // Remove all non-digit characters except + at the beginning
    this.phoneNumber = this.phoneNumber.replace(/(?!^\+)\D/g, '');
  }
  next();
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ role: 1 });

module.exports = mongoose.model("User", UserSchema);