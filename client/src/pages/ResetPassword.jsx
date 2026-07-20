import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";

import "./Auth.css";

function ResetPassword() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail");

  const otp =
    localStorage.getItem("resetOTP");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [type, setType] =
    useState("");

  const [strength, setStrength] =
    useState("");

  // ===========================
  // PASSWORD STRENGTH
  // ===========================

  useEffect(() => {

    if (!newPassword) {

      setStrength("");

      return;

    }

    let score = 0;

    if (newPassword.length >= 8) score++;

    if (/[A-Z]/.test(newPassword)) score++;

    if (/[0-9]/.test(newPassword)) score++;

    if (/[!@#$%^&*]/.test(newPassword)) score++;

    if (score <= 1) {

      setStrength("Weak");

    } else if (score <= 3) {

      setStrength("Medium");

    } else {

      setStrength("Strong");

    }

  }, [newPassword]);

  // ===========================
  // SUBMIT
  // ===========================

  const submitHandler = async (e) => {

    e.preventDefault();

    if (newPassword !== confirmPassword) {

      setMessage("Passwords do not match");

      setType("error");

      return;

    }

    try {

      setLoading(true);

      const { data } =
        await axios.post(
          "http://localhost:5000/api/users/reset-password",
          {
            email,
            otp,
            newPassword,
          }
        );

      setMessage(
        data.message ||
        "Password Updated"
      );

      setType("success");

      localStorage.removeItem("resetOTP");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (err) {

      setMessage(
        err.response?.data?.message ||
        "Reset Failed"
      );

      setType("error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-left">

        <FaCheckCircle className="auth-logo" />

        <h1>Create New Password</h1>

        <p>

          Your new password should be
          different from the previous one.

        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Reset Password</h2>

          <p>Create a secure password</p>

          {message && (

            <div className={`message ${type}`}>

              {message}

            </div>

          )}

          <form onSubmit={submitHandler}>

            {/* PASSWORD */}

            <div className="auth-input">

              <FaLock />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword
                  ? <FaEyeSlash/>
                  : <FaEye/>}

              </button>

            </div>

            {/* STRENGTH */}

            {strength && (

              <div className="strength-wrapper">

                <div
                  className={`strength-bar ${strength.toLowerCase()}`}
                />

                <p>

                  Password Strength :
                  <strong> {strength}</strong>

                </p>

              </div>

            )}

            {/* CONFIRM */}

            <div className="auth-input">

              <FaLock />

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >

                {showConfirm
                  ? <FaEyeSlash/>
                  : <FaEye/>}

              </button>

            </div>

            {confirmPassword && (

              <small
                className={
                  confirmPassword === newPassword
                    ? "match"
                    : "not-match"
                }
              >

                {confirmPassword === newPassword
                  ? "✓ Passwords Match"
                  : "✗ Passwords Do Not Match"}

              </small>

            )}

            <button
              className="auth-btn"
              disabled={loading}
            >

              {loading
                ? "Updating..."
                : "Reset Password"}

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}

export default ResetPassword;