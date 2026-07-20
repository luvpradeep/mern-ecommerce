const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    changePassword,
    sendEmailOTP,
    verifyEmailOTP,
} = require("../controllers/userController");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
    "/verify-reset-otp",
    verifyResetOTP
);

router.post(
  "/reset-password",
  resetPassword
);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.post(
  "/send-email-otp",
  protect,
  sendEmailOTP
);

router.post(
  "/verify-email-otp",
  protect,
  verifyEmailOTP
);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

module.exports = router;