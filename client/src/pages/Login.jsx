import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
} from "react-icons/fa";

import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const res = await api.post(
        "/users/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      login(
        res.data.user,
        res.data.token
      );

      setMessage("Login Successful");

      setMessageType("success");

      setTimeout(() => {

        if(res.data.user.role==="admin"){
          navigate("/admin");
        }else{
          navigate("/");
        }

      },1000);

    } catch (err) {

      setMessage(
        err.response?.data?.message ||
        "Login Failed"
      );

      setMessageType("error");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-left">

        <FaShoppingBag className="auth-logo"/>

        <h1>MERN Shop</h1>

        <p>

          Shop smarter with secure login,
          wishlist, orders and fast checkout.

        </p>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>Welcome Back 👋</h2>

          <p>
            Login to continue shopping
          </p>

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

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
                  setShowPassword(!showPassword)
                }
              >
                {
                  showPassword
                  ? <FaEyeSlash/>
                  : <FaEye/>
                }
              </button>

            </div>

            <div className="auth-options">

              <Link
                to="/forgot-password"
                className="forgot-link"
              >
                Forgot Password?
              </Link>

            </div>

            <button
              className="auth-btn"
              disabled={loading}
            >
              {
                loading
                ? "Logging in..."
                : "Login"
              }
            </button>

          </form>

          <p className="auth-footer">

            Don't have an account?

            <Link to="/register">

              Register

            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;