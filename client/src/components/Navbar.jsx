import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaShoppingCart,
  FaHeart,
  FaBell,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaCreditCard,
  FaUserShield,
} from "react-icons/fa";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { NotificationContext } from "../context/NotificationContext";
import { AuthContext } from "../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Authentication
  const { logout } = useContext(AuthContext);

  const { resetCart } = useContext(CartContext);

  const { resetWishlist } = useContext(WishlistContext);

  // Cart
  const { cartItems } = useContext(CartContext);

  // Wishlist
  const { wishlistItems, wishlistCount } = useContext(WishlistContext);

  // Notifications
  const { unreadCount } = useContext(NotificationContext);

  // Cart Badge
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
  resetCart();

  resetWishlist();

  logout();

  navigate("/login");

  setMenuOpen(false);
};

  return (
    <>
      <nav className="navbar">
        <button className="menu-btn" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </button>

        <h2 className="logo">MERN Shop</h2>

        <div className="mobile-user">
          {user ? (
            <Link to="/profile" className="mobile-profile">
              {user?.name?.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link to="/login" className="mobile-login">
              Login
            </Link>
          )}
        </div>

        <div className="desktop-links">
          <Link to="/">Home</Link>

          <Link to="/cart" className="badge-link">
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>

          <Link to="/checkout">Checkout</Link>

          <Link to="/wishlist" className="badge-link">
            Wishlist
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </Link>

          <Link to="/orders">Orders</Link>

          <Link to="/notifications" className="badge-link">
            Notifications
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>

          {user ? (
            <>
              <div className="profile-menu">
                <button className="profile-circle">
                  {user?.name?.charAt(0).toUpperCase()}
                </button>

                <div className="profile-dropdown">
                  <p>{user?.name}</p>

                  <Link to="/profile">My Profile</Link>

                  {user?.role === "admin" && (
                    <Link to="/admin" className="admin-link">
                      Admin Dashboard
                    </Link>
                  )}

                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>

              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>

      <div
        className={`overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <div className={`sidebar ${menuOpen ? "active" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{user?.name}</h2>

          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <div className="sidebar-content">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <FaHome />
            Home
          </Link>

          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <FaShoppingCart />
            Cart
            {cartCount > 0 && <span className="mobile-badge">{cartCount}</span>}
          </Link>

          <Link to="/checkout" onClick={() => setMenuOpen(false)}>
            <FaCreditCard />
            Checkout
          </Link>

          <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
            <FaHeart />
            Wishlist
            {wishlistCount > 0 && (
              <span className="mobile-badge">{wishlistCount}</span>
            )}
          </Link>

          <Link to="/orders" onClick={() => setMenuOpen(false)}>
            <FaClipboardList />
            Orders
          </Link>

          <Link to="/notifications" onClick={() => setMenuOpen(false)}>
            <FaBell />
            Notifications
            {unreadCount > 0 && (
              <span className="mobile-badge">{unreadCount}</span>
            )}
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            <FaUser />
            Profile
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="admin-link"
              onClick={() => setMenuOpen(false)}
            >
              <FaUserShield />
              Admin Dashboard
            </Link>
          )}
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
