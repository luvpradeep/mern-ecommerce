import { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaEnvelope,
  FaUser,
  FaShieldAlt,
  FaPhone,
} from "react-icons/fa";
import "./Profile.css";
import { toast } from "react-toastify";

function Profile() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role || "user";

  // ======================================
  // PROFILE
  // ======================================

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [emailVerified, setEmailVerified] = useState(false);

  const [loading, setLoading] = useState(false);

  // ======================================
  // EMAIL VERIFICATION
  // ======================================

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [otp, setOtp] = useState("");

  const [sendingOtp, setSendingOtp] = useState(false);

  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);

  const [otpExpireTimer, setOtpExpireTimer] = useState(600);

  const [otpExpired, setOtpExpired] = useState(false);

  // ======================================
  // CHANGE PASSWORD
  // ======================================

  const [oldPassword, setOldPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordStrength, setPasswordStrength] = useState("");

  const [showOld, setShowOld] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  // ======================================
  // FORGOT PASSWORD
  // ======================================

  const [showForgotModal, setShowForgotModal] = useState(false);

  const [forgotStep, setForgotStep] = useState(1);

  const [forgotLoading, setForgotLoading] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [forgotOtp, setForgotOtp] = useState("");

  const [forgotResendTimer, setForgotResendTimer] = useState(60);

  const [forgotExpireTimer, setForgotExpireTimer] = useState(600);

  const [forgotOtpExpired, setForgotOtpExpired] = useState(false);

  const [forgotOldPassword, setForgotOldPassword] = useState("");

  const [forgotNewPassword, setForgotNewPassword] = useState("");

  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");

  const [forgotPasswordStrength, setForgotPasswordStrength] = useState("");

  const [showForgotOld, setShowForgotOld] = useState(false);

  const [showForgotNew, setShowForgotNew] = useState(false);

  const [showForgotConfirm, setShowForgotConfirm] = useState(false);

  // ======================================
  // LOAD PROFILE
  // ======================================

  useEffect(() => {
    fetchProfile();
  }, []);

  // ======================================
  // EMAIL OTP TIMER
  // ======================================
  //resend timer
  useEffect(() => {
    if (!showOtpModal) return;

    if (resendTimer <= 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpModal, resendTimer]);
  //otp expired timer
  useEffect(() => {
    if (!showOtpModal) return;

    if (otpExpireTimer <= 0) {
      setOtpExpired(true);

      return;
    }

    const interval = setInterval(() => {
      setOtpExpireTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpireTimer, showOtpModal]);

  // ======================================
  // FORGOT OTP TIMER
  // ======================================
  //resend timer
  useEffect(() => {
    if (!showForgotModal || forgotStep !== 2) return;

    if (forgotResendTimer <= 0) return;

    const interval = setInterval(() => {
      setForgotResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showForgotModal, forgotStep, forgotResendTimer]);
  //expiry timer
  useEffect(() => {
    if (!showForgotModal || forgotStep !== 2) return;

    if (forgotExpireTimer <= 0) {
      setForgotOtpExpired(true);

      return;
    }

    const interval = setInterval(() => {
      setForgotExpireTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [forgotExpireTimer, showForgotModal, forgotStep]);

  // ======================================
  // PASSWORD STRENGTH
  // ======================================

  const calculateStrength = (password) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";

    return "Strong";
  };

  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength("");
      return;
    }

    setPasswordStrength(calculateStrength(newPassword));
  }, [newPassword]);

  useEffect(() => {
    if (!forgotNewPassword) {
      setForgotPasswordStrength("");
      return;
    }

    setForgotPasswordStrength(calculateStrength(forgotNewPassword));
  }, [forgotNewPassword]);

  // ======================================
  // HELPERS
  // ======================================

  const resetEmailOTP = () => {
    setOtp("");
    setResendTimer(60);
    setOtpExpireTimer(600);
    setOtpExpired(false);
  };

  const resetForgotFlow = () => {
    setForgotStep(1);

    setForgotOtp("");

    setForgotResendTimer(60);

    setForgotExpireTimer(600);

    setForgotOtpExpired(false);

    setForgotOldPassword("");

    setForgotNewPassword("");

    setForgotConfirmPassword("");

    setForgotPasswordStrength("");

    setShowForgotOld(false);

    setShowForgotNew(false);

    setShowForgotConfirm(false);
  };

  // ======================================
  // GET PROFILE
  // ======================================

  const fetchProfile = async () => {
    try {

      const { data } = await api.get(
        "/users/profile");

      const profile = data.user;

      setName(profile.name || "");
      setEmail(profile.email || "");
      setOriginalEmail(profile.email || "");
      setPhone(profile.phone || "");
      setEmailVerified(profile.emailVerified || false);

      localStorage.setItem("user", JSON.stringify(profile));

      setPhoneError("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
    }
  };

  // ======================================
  // UPDATE PROFILE
  // ======================================

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Name is required");

    if (!email.trim()) return toast.error("Email is required");

    if (phone && !/^[6-9]\d{9}$/.test(phone))
      return toast.error("Please enter a valid mobile number");

    try {
      setLoading(true);

      const { data } = await api.put(
        "/users/profile",
        {
          name: name.trim(),
          email: email.trim(),
          phone,
        },
      );

      const updatedUser = data.user;

      setName(updatedUser.name);
      setEmail(updatedUser.email);
      setOriginalEmail(updatedUser.email);
      setPhone(updatedUser.phone || "");
      setEmailVerified(updatedUser.emailVerified);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // CHANGE PASSWORD
  // ======================================

  const changePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (oldPassword === newPassword) {
      return toast.error("New password cannot be same as old password");
    }

    if (passwordStrength === "Weak") {
      return toast.error("Please choose a stronger password");
    }

    try {
      setLoading(true);

      const { data } = await api.put(
        "/users/change-password",
        {
          oldPassword,
          newPassword,
        },
       );

      toast.success(data.message);

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength("");

      setShowOld(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // SEND EMAIL OTP
  // ======================================

  const sendOtp = async () => {
    try {
      setSendingOtp(true);

      const { data } = await api.post(
        "/users/send-email-otp",
        {}, );

      toast.success(data.message);

      resetEmailOTP();

      setShowOtpModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  // ======================================
  // VERIFY EMAIL OTP
  // ======================================

  const verifyOtp = async () => {
    if (!otp.trim()) {
      return toast.error("Enter OTP");
    }

    if (otp.length !== 6) {
      return toast.error("OTP must be 6 digits");
    }

    try {
      setVerifyingOtp(true);

      const { data } = await api.post(
        "/users/verify-email-otp",
        {
          otp,
        },
        );

      toast.success(data.message);

      setEmailVerified(true);

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        emailVerified: true,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowOtpModal(false);

      resetEmailOTP();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // ======================================
  // SEND FORGOT PASSWORD OTP
  // ======================================

  const sendForgotOtp = async () => {
    try {
      setForgotLoading(true);

      const { data } = await api.post(
        "/users/forgot-password",
        {
          email,
        },
      );

      toast.success(data.message);

      setForgotStep(2);

      setForgotOtp("");

      setForgotResendTimer(60);

      setForgotExpireTimer(600);

      setForgotOtpExpired(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // ======================================
  // VERIFY FORGOT OTP
  // ======================================

  const verifyForgotOtp = async () => {
    if (!forgotOtp.trim()) return toast.error("Enter OTP");

    if (forgotOtp.length !== 6) return toast.error("OTP must be 6 digits");

    try {
      setForgotLoading(true);

      const { data } = await api.post(
        "/users/verify-reset-otp",
        {
          email,
          otp: forgotOtp,
        },
      );

      toast.success(data.message);

      setForgotStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // ======================================
  // RESET PASSWORD
  // ======================================

  const resetForgotPassword = async () => {
    if (!forgotNewPassword) return toast.error("Enter new password");

    if (!forgotConfirmPassword) return toast.error("Confirm password");

    if (forgotNewPassword !== forgotConfirmPassword)
      return toast.error("Passwords do not match");

    if (forgotPasswordStrength === "Weak")
      return toast.error("Please choose a stronger password");

    if (oldPassword && oldPassword === forgotNewPassword)
      return toast.error("New password cannot be same as old password");

    try {
      setForgotLoading(true);

      const { data } = await api.post(
        "/users/reset-password",
        {
          email,
          otp: forgotOtp,
          newPassword: forgotNewPassword,
        },
      );

      toast.success(data.message);

      closeForgotPassword();
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setForgotLoading(false);
    }
  };

  // ======================================
  // OPEN FORGOT PASSWORD
  // ======================================

  const openForgotPassword = () => {
    setForgotEmail(email);

    resetForgotFlow();

    setShowForgotModal(true);
  };

  // ======================================
  // CLOSE FORGOT PASSWORD
  // ======================================

  const closeForgotPassword = () => {
    resetForgotFlow();

    setShowForgotModal(false);
  };

  return (
    <div className={showOtpModal || showForgotModal ? "profile-page blur-page" : "profile-page"}>
    <div className="profile-page">
      {/* ==========================
          PROFILE HEADER
      ========================== */}

      <div className="profile-header-card">
        <div className="profile-avatar">
          <FaUserCircle />
        </div>

        <div className="profile-user-info">
          <h1>{name || "User"}</h1>

          <p>{email}</p>

          <span className="profile-role">
            <FaShieldAlt />
            {role === "admin" ? "Administrator" : "Customer"}
          </span>
        </div>
      </div>

      {/* ==========================
          MAIN GRID
      ========================== */}

      <div className="profile-grid">
        {/* ==========================
            PERSONAL INFORMATION
        ========================== */}

        <div className="profile-card">
          <h2>
            <FaUser />
            Personal Information
          </h2>

          <form onSubmit={updateProfile}>
            {/* NAME */}

            <label>Full Name</label>

            <div className="profile-input-box">
              <FaUser className="profile-input-icon" />

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* EMAIL */}

            <label>Email Address</label>

            <div className="profile-input-box email-box">
              <FaEnvelope className="profile-input-icon" />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);

                  if (e.target.value !== originalEmail) {
                    setEmailVerified(false);
                  }
                }}
              />

              {!emailVerified ? (
                <button
                  type="button"
                  className="verify-email-btn"
                  onClick={sendOtp}
                >
                  {sendingOtp ? "Sending..." : "Verify"}
                </button>
              ) : (
                <span className="verified-badge">✔ Verified</span>
              )}
            </div>

            {/* PHONE */}

            <label>Phone Number</label>

            <div className="profile-input-box phone-box">
              <FaPhone className="profile-input-icon phone-icon" />
              <span className="country-code">+91</span>

              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                maxLength={10}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "");

                  if (value.length > 10) return;

                  setPhone(value);

                  if (value.length === 0) {
                    setPhoneError("");
                  } else if (!/^[6-9]/.test(value)) {
                    setPhoneError("Mobile number must start with 6, 7, 8 or 9");
                  } else if (value.length < 10) {
                    setPhoneError("Phone number must contain 10 digits");
                  } else {
                    setPhoneError("");
                  }
                }}
              />
            </div>

            {phoneError && <small className="phone-error">{phoneError}</small>}

            <div className="member-since-row">
              <span className="member-label">Member Since</span>
              <span className="member-date">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </span>
            </div>

            {/* UPDATE */}

            <div className="profile-action-row">
              <button type="submit" className="profile-btn profile-update-btn">
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* ==========================
            CHANGE PASSWORD
        ========================== */}

        <div className="profile-card">
          <h2>
            <FaLock />
            Change Password
          </h2>

          <form onSubmit={changePassword}>
            {/* OLD PASSWORD */}

            <label>Old Password</label>

            <div className="profile-input-box">
              <FaLock className="profile-input-icon" />

              <input
                type={showOld ? "text" : "password"}
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowOld(!showOld)}
              >
                {showOld ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="forgot-password-row">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={openForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* NEW PASSWORD */}

            <label>New Password</label>

            <div className="profile-input-box">
              <FaLock className="profile-input-icon" />

              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {passwordStrength && (
              <div
                className={`password-strength ${passwordStrength.toLowerCase()}`}
              >
                Password Strength :<strong> {passwordStrength}</strong>
              </div>
            )}

            {/* CONFIRM PASSWORD */}

            <label>Confirm Password</label>

            <div className="profile-input-box">
              <FaLock className="profile-input-icon" />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {confirmPassword !== "" && (
              <div
                className={
                  confirmPassword === newPassword
                    ? "password-match"
                    : "password-not-match"
                }
              >
                {confirmPassword === newPassword
                  ? "✓ Passwords Match"
                  : "✗ Passwords Do Not Match"}
              </div>
            )}

            <div className="profile-action-row">
              <button
                type="submit"
                className="profile-btn profile-password-btn"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>

      {/* ===========================================
    EMAIL VERIFICATION MODAL
=========================================== */}

      {showOtpModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => {
            setShowOtpModal(false);
            setOtp("");
          }}
        >
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Email Verification</h2>

            <p className="modal-desc">Enter the verification code sent to</p>

            <div className="modal-email">{email}</div>

            <input
              className="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />

            <div className="otp-btn-row">
              <button
                className="profile-btn profile-btn-primary"
                onClick={verifyOtp}
                disabled={verifyingOtp}
              >
                {verifyingOtp ? "Verifying..." : "Verify Email"}
              </button>

              <button
                className="profile-btn profile-btn-secondary"
                onClick={() => {
                  setShowOtpModal(false);
                  resetEmailOTP();
                }}
              >
                Cancel
              </button>
            </div>

            {resendTimer > 0 ? (
              <p className="otp-resend">
                Resend OTP in <b>{resendTimer}s</b>
              </p>
            ) : (
              <>
                {otpExpired && (
                  <p className="otp-expired">OTP expired. Please resend OTP.</p>
                )}

                <button className="resend-link" type="button" onClick={sendOtp}>
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===========================================
          FORGOT PASSWORD MODAL
      =========================================== */}

      {showForgotModal && (
        <div className="profile-modal-overlay" onClick={closeForgotPassword}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Forgot Password</h2>

            {/* STEP 1 */}
            {forgotStep === 1 && (
              <>
                <p className="modal-desc">Send the verification code to</p>

                <div className="modal-email">{email}</div>

                <button
                  className="profile-btn profile-btn-primary full-btn"
                  onClick={sendForgotOtp}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </>
            )}

            {/* STEP 2 */}
            {forgotStep === 2 && (
              <>
                <p className="modal-desc">
                  Enter the verification code sent to
                </p>

                <div className="modal-email">{email}</div>

                <input
                  className="otp-input"
                  type="text"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={forgotOtp}
                  onChange={(e) =>
                    setForgotOtp(e.target.value.replace(/\D/g, ""))
                  }
                />

                <div className="otp-btn-row">
                  <button
                    className="profile-btn profile-btn-primary"
                    onClick={verifyForgotOtp}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <button
                    className="profile-btn profile-btn-secondary"
                    onClick={closeForgotPassword}
                  >
                    Cancel
                  </button>
                </div>

                {!forgotOtpExpired ? (
                  <p className="otp-resend">
                    Resend OTP in <b>{forgotResendTimer}s</b>
                  </p>
                ) : (
                  <>
                    <p className="otp-expired">
                      OTP expired. Please resend OTP.
                    </p>

                    <button className="resend-link" onClick={sendForgotOtp}>
                      Resend OTP
                    </button>
                  </>
                )}
              </>
            )}

            {/* STEP 3 */}
            {forgotStep === 3 && (
              <>
                <div className="profile-input-box">
                  <FaLock className="profile-input-icon" />

                  <input
                    type={showForgotNew ? "text" : "password"}
                    value={forgotNewPassword}
                    placeholder="New Password"
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowForgotNew(!showForgotNew)}
                  >
                    {showForgotNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {forgotPasswordStrength && (
                  <div
                    className={`password-strength ${forgotPasswordStrength.toLowerCase()}`}
                  >
                    Password Strength :
                    <strong> {forgotPasswordStrength}</strong>
                  </div>
                )}

                <div className="profile-input-box">
                  <FaLock className="profile-input-icon" />

                  <input
                    type={showForgotConfirm ? "text" : "password"}
                    value={forgotConfirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowForgotConfirm(!showForgotConfirm)}
                  >
                    {showForgotConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {forgotConfirmPassword && (
                  <div
                    className={
                      forgotConfirmPassword === forgotNewPassword
                        ? "password-match"
                        : "password-not-match"
                    }
                  >
                    {forgotConfirmPassword === forgotNewPassword
                      ? "✓ Passwords Match"
                      : "✗ Passwords Do Not Match"}
                  </div>
                )}

                <div className="otp-btn-row">
                  <button
                    className="profile-btn profile-btn-primary"
                    onClick={resetForgotPassword}
                    disabled={forgotLoading}
                  >
                    {forgotLoading ? "Updating..." : "Update Password"}
                  </button>

                  <button
                    className="profile-btn profile-btn-secondary"
                    onClick={closeForgotPassword}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
