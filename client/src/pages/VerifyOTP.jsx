import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaShieldAlt,
  FaArrowLeft,
  FaRedo,
} from "react-icons/fa";

import "./Auth.css";

function VerifyOTP() {

  const navigate = useNavigate();

  const email =
    localStorage.getItem("resetEmail");

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const inputs = useRef([]);

  const [message, setMessage] =
    useState("");

  const [type, setType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [seconds, setSeconds] =
    useState(60);

  // ===========================
  // TIMER
  // ===========================

  useEffect(() => {

    if (seconds <= 0) return;

    const timer = setInterval(() => {

      setSeconds((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [seconds]);

  // ===========================
  // INPUT
  // ===========================

  const handleChange = (value, index) => {

    if (!/^[0-9]?$/.test(value))
      return;

    const copy = [...otp];

    copy[index] = value;

    setOtp(copy);

    if (
      value &&
      index < 5
    ) {
      inputs.current[index + 1].focus();
    }

  };

  // ===========================
  // BACKSPACE
  // ===========================

  const handleKeyDown = (
    e,
    index
  ) => {

    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      inputs.current[index - 1].focus();

    }

  };

  // ===========================
  // PASTE
  // ===========================

  const handlePaste = (e) => {

    const pasted =
      e.clipboardData
        .getData("text")
        .trim();

    if (!/^\d{6}$/.test(pasted))
      return;

    const arr =
      pasted.split("");

    setOtp(arr);

    arr.forEach((v, i) => {

      if (inputs.current[i]) {

        inputs.current[i].value = v;

      }

    });

  };

  // ===========================
  // VERIFY
  // ===========================

  const verifyOTP = (e) => {

    e.preventDefault();

    const finalOTP =
      otp.join("");

    if (finalOTP.length !== 6) {

      setMessage(
        "Enter 6 digit OTP"
      );

      setType("error");

      return;

    }

    localStorage.setItem(
      "resetOTP",
      finalOTP
    );

    navigate("/reset-password");

  };

  // ===========================
  // RESEND
  // ===========================

  const resendOTP = async () => {

    try {

      setLoading(true);

      await axios.post(

        "http://localhost:5000/api/users/forgot-password",

        {
          email,
        }

      );

      setSeconds(60);

      setMessage(
        "OTP Sent Again"
      );

      setType("success");

    } catch (err) {

      setMessage(
        "Unable to resend OTP"
      );

      setType("error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      <div className="auth-left">

        <FaShieldAlt className="auth-logo" />

        <h1>Email Verification</h1>

        <p>

          Enter the 6-digit OTP sent to

          <br />

          <strong>{email}</strong>

        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Verify OTP</h2>

          <p>Enter the code below</p>

          {message && (

            <div
              className={`message ${type}`}
            >
              {message}
            </div>

          )}

          <form
            onSubmit={verifyOTP}
          >

            <div
              className="otp-container"
              onPaste={handlePaste}
            >

              {otp.map((num, index) => (

                <input
                  key={index}
                  ref={(el) =>
                    (inputs.current[index] = el)
                  }
                  value={num}
                  maxLength="1"
                  onChange={(e) =>
                    handleChange(
                      e.target.value,
                      index
                    )
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(
                      e,
                      index
                    )
                  }
                />

              ))}

            </div>

            <button
              className="auth-btn"
            >
              Verify OTP
            </button>

          </form>

          {seconds > 0 ? (

            <p className="otp-timer">

              Resend OTP in

              <strong>
                {" "}
                {seconds}s
              </strong>

            </p>

          ) : (

            <button
              className="resend-btn"
              onClick={resendOTP}
              disabled={loading}
            >

              <FaRedo />

              Resend OTP

            </button>

          )}

          <Link
            to="/login"
            className="back-link"
          >

            <FaArrowLeft />

            Back to Login

          </Link>

        </div>

      </div>

    </div>

  );

}

export default VerifyOTP;