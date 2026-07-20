const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // Email Verification OTP
    // ==========================

    emailOTP: {
      type: String,
      default: "",
    },

    emailOTPExpire: {
      type: Date,
    },

    emailOTPLastSent: {
      type: Date,
    },

    // ==========================
    // Reset Password OTP
    // ==========================

    resetOtp: {
      type: String,
      default: "",
    },

    resetOtpExpire: {
      type: Date,
    },

    resetOTPLastSent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
