import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-brand">
          <h2>MERN Shop</h2>

          <p>
            Your one-stop destination for quality products with
            secure shopping, fast delivery and trusted service.
          </p>
        </div>

        {/* Links */}

        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/orders">Orders</Link>
        </div>

        {/* Customer */}

        <div className="footer-column">
          <h3>Customer</h3>

          <Link to="/checkout">Checkout</Link>
          <Link to="/notifications">Notifications</Link>
          <Link to="/profile">Profile</Link>
        </div>

        {/* Contact */}

        <div className="footer-column">
          <h3>Contact</h3>

          <p>
            <FaMapMarkerAlt />
            Chennai, India
          </p>

          <p>
            <FaPhone />
            +91 98765 43210
          </p>

          <p>
            <FaEnvelope />
            support@mernshop.com
          </p>
        </div>

      </div>

      <div className="footer-bottom">

        <div className="footer-social">

          <a href="https://www.facebook.com/">
            <FaFacebookF />
          </a>

          <a href="https://www.instagram.com/">
            <FaInstagram />
          </a>

          <a href="https://www.linkedin.com/in/pradeep-d-339162415/">
            <FaLinkedinIn />
          </a>

          <a href="https://github.com/luvpradeep">
            <FaGithub />
          </a>

        </div>

        <p>
          © 2026 MERN Shop. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;