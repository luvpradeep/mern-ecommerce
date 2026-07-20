const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Register User function

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      emailVerified: false,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User function

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // ==========================
    // Find User
    // ==========================

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ==========================
    // Compare Password
    // ==========================

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ==========================
    // Generate JWT
    // ==========================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // ==========================
    // Response
    // ==========================

    res.status(200).json({
      success: true,
      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (
      user.resetOTPLastSent &&
      Date.now() - user.resetOTPLastSent.getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;

    user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

    user.resetOTPLastSent = new Date();

    await user.save();

    await sendEmail(
      user.email,
      "Password Reset OTP",
      `
      <div style="font-family:Arial;padding:30px">

          <h2 style="color:#2563eb">
              MERN Shop
          </h2>

          <p>Hello <strong>${user.name}</strong>,</p>

          <p>Use the OTP below to reset your password.</p>

          <div
              style="
              font-size:34px;
              letter-spacing:10px;
              font-weight:bold;
              text-align:center;
              background:#eef4ff;
              padding:20px;
              border-radius:10px;
              color:#2563eb;
              "
          >
              ${otp}
          </div>

          <p style="margin-top:20px">
              This OTP is valid for
              <strong>10 minutes</strong>.
          </p>

          <p>Never share this OTP with anyone.</p>

      </div>
      `,
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// VERIFY RESET OTP
// ======================================

const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.resetOtpExpire || user.resetOtpExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired",
      });
    }

    res.json({
      success: true,
      message: "OTP Verified Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Reset Password

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
    });

    if (
      !user ||
      user.resetOtp !== otp ||
      !user.resetOtpExpire ||
      user.resetOtpExpire < Date.now()
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Prevent using the old password again
    const samePassword = await bcrypt.compare(newPassword, user.password);

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpire = null;
    user.resetOTPLastSent = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// CHANGE PASSWORD
// ======================================

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all password fields",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================
    // Verify Old Password
    // ==========================

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // ==========================
    // Prevent Same Password
    // ==========================

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    // ==========================
    // Password Validation
    // ==========================

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, uppercase, lowercase, number and special character",
      });
    }

    // ==========================
    // Save Password
    // ==========================

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET USER PROFILE
// ======================================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -emailOTP -resetOtp",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE USER PROFILE
// ======================================

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================
    // Check Duplicate Email
    // ==========================

    if (email && email !== user.email) {
      const emailExists = await User.findOne({
        email,
      });

      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Email changed

      user.email = email;

      // Need verification again

      user.emailVerified = false;
    }

    // ==========================
    // Update Fields
    // ==========================

    user.name = name || user.name;

    user.phone = phone || "";

    await user.save();

    res.status(200).json({
      success: true,

      message: "Profile Updated Successfully",

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        role: user.role,

        emailVerified: user.emailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

exports.sendEmailOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent spam (60 seconds)
    if (
      user.emailOTPLastSent &&
      Date.now() - user.emailOTPLastSent.getTime() < 60 * 1000
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait 60 seconds before requesting another OTP.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.emailOTP = otp;

    // Valid for 10 minutes
    user.emailOTPExpire = Date.now() + 10 * 60 * 1000;

    user.emailOTPLastSent = new Date();

    await user.save();

    await sendEmail(
      user.email,
      "Email Verification OTP",
      `
      <div style="font-family:Arial;padding:30px;background:#f5f7fb">

          <div style="max-width:500px;margin:auto;background:#fff;border-radius:12px;padding:30px">

              <h2 style="color:#2563eb">
                  MERN Shop
              </h2>

              <p>Hello <strong>${user.name}</strong>,</p>

              <p>
                  Use the OTP below to verify your email.
              </p>

              <div
                  style="
                  font-size:34px;
                  font-weight:bold;
                  letter-spacing:10px;
                  text-align:center;
                  background:#eef4ff;
                  padding:20px;
                  border-radius:10px;
                  color:#2563eb;
                  "
              >
                  ${otp}
              </div>

              <p style="margin-top:25px">
                  This OTP is valid for
                  <strong>10 minutes</strong>.
              </p>

              <p>
                  Do not share this OTP with anyone.
              </p>

          </div>

      </div>
      `,
    );

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailOTP !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (!user.emailOTPExpire || user.emailOTPExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    user.emailVerified = true;

    user.emailOTP = "";
    user.emailOTPExpire = null;
    user.emailOTPLastSent = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email Verified Successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  changePassword,
  sendEmailOTP: exports.sendEmailOTP,
  verifyEmailOTP: exports.verifyEmailOTP,
};
