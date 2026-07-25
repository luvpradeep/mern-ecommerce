import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaEnvelope,
  FaArrowLeft,
  FaPaperPlane,
  FaLock,
} from "react-icons/fa";

import "./Auth.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [type, setType] = useState("");

  // ============================
  // SEND OTP
  // ============================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/users/forgot-password",
        {
          email,
        }
      );

      localStorage.setItem("resetEmail", email);

      setMessage(data.message || "OTP Sent Successfully");

      setType("success");

      setTimeout(() => {
        navigate("/verify-otp");
      }, 2000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to send OTP"
      );

      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">

        <FaLock className="auth-logo" />

        <h1>Forgot Password?</h1>

        <p>
          Don't worry. Enter your registered
          email address and we'll send a
          verification OTP to reset your
          password securely.
        </p>

      </div>

      {/* RIGHT */}

      <div className="auth-right">

        <div className="auth-card">

          <h2>Reset Password</h2>

          <p>
            Enter your registered email
          </p>

          {message && (
            <div
              className={`message ${type}`}
            >
              {message}
            </div>
          )}

          <form onSubmit={submitHandler}>

            <div className="auth-input">

              <FaEnvelope />

              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <button
              className="auth-btn"
              disabled={loading}
            >
              <FaPaperPlane
                style={{
                  marginRight: "8px",
                }}
              />

              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>

          </form>

          <div className="auth-footer">

            <Link
              to="/login"
              className="back-link"
            >
              <FaArrowLeft /> Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;