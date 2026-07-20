import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import "./Auth.css";

function Register() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [strength, setStrength] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // ===========================
  // PASSWORD STRENGTH
  // ===========================

  useEffect(() => {

    const pass = formData.password;

    if (!pass) {
      setStrength("");
      return;
    }

    let score = 0;

    if (pass.length >= 8) score++;

    if (/[A-Z]/.test(pass)) score++;

    if (/[0-9]/.test(pass)) score++;

    if (/[!@#$%^&*]/.test(pass)) score++;

    if (score <= 1)
      setStrength("Weak");

    else if (score <= 3)
      setStrength("Medium");

    else
      setStrength("Strong");

  }, [formData.password]);

  // ===========================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  // ===========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setMessage("Passwords do not match");

      setMessageType("error");

      return;

    }

    try {

      setLoading(true);

      const res = await api.post(
        "/users/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setMessage(
        res.data.message ||
          "Registration Successful"
      );

      setMessageType("success");

      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (err) {

      setMessage(

        err.response?.data?.message ||

          "Registration Failed"

      );

      setMessageType("error");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="auth-page">

      {/* LEFT */}

      <div className="auth-left">

        <FaShoppingBag className="auth-logo"/>

        <h1>MERN Shop</h1>

        <p>

          Create your account and enjoy
          secure shopping with wishlist,
          notifications and quick checkout.

        </p>

      </div>

      {/* RIGHT */}

      <div className="auth-right">

        <div className="auth-card">

          <h2>Create Account</h2>

          <p>Let's get started 🚀</p>

          {message && (

            <div className={`message ${messageType}`}>

              {message}

            </div>

          )}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="auth-input">

              <FaUser/>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

            {/* EMAIL */}

            <div className="auth-input">

              <FaEnvelope/>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="auth-input">

              <FaLock/>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={()=>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {
                  showPassword
                  ? <FaEyeSlash/>
                  : <FaEye/>
                }

              </button>

            </div>

            {/* Strength */}

            {strength && (

              <div className={`strength ${strength.toLowerCase()}`}>

                Password Strength :

                <strong>

                  {" "}

                  {strength}

                </strong>

              </div>

            )}

            {/* CONFIRM */}

            <div className="auth-input">

              <FaLock/>

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={()=>
                  setShowConfirm(
                    !showConfirm
                  )
                }
              >

                {
                  showConfirm
                  ? <FaEyeSlash/>
                  : <FaEye/>
                }

              </button>

            </div>

            {/* MATCH */}

            {formData.confirmPassword && (

              formData.password ===
              formData.confirmPassword ?

              <div className="password-match">

                <FaCheckCircle/>

                Passwords Match

              </div>

              :

              <div className="password-not-match">

                <FaTimesCircle/>

                Passwords Do Not Match

              </div>

            )}

            <button
              className="auth-btn"
              disabled={loading}
            >

              {
                loading
                ? "Creating..."
                : "Create Account"
              }

            </button>

          </form>

          <p className="auth-footer">

            Already have an account?

            <Link to="/login">

              Login

            </Link>

          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;