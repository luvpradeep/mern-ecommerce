import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaStore,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

import "./AdminNavbar.css";

function AdminNavbar() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <nav className="admin-navbar">

        {/* Mobile Menu */}

        <button
          className="admin-menu-btn"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>

        <h2 className="admin-logo">
          MERN Shop
        </h2>

        <div>
            <Link to="/admin/profile" className="mobile-profile">
              {user?.name?.charAt(0).toUpperCase()}
            </Link>
        </div>

        {/* Desktop */}

        <div className="admin-links">

          <Link to="/admin">
            Dashboard
          </Link>

          <Link to="/admin/products">
            Products
          </Link>

          <Link to="/admin/orders">
            Orders
          </Link>

          <Link to="/admin/users">
            Users
          </Link>

          <div className="admin-profile">

            <button className="admin-profile-btn, profile-circle">
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            <div className="admin-dropdown">

              <p>{user?.name}</p>

              <Link to="/admin/profile">
                My Profile
              </Link>

              <Link to="/">
                User Store
              </Link>

              <button onClick={handleLogout}>
                Logout
              </button>

            </div>

          </div>

        </div>

      </nav>

      {/* Overlay */}

      <div
        className={`admin-overlay ${
          menuOpen ? "active" : ""
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Sidebar */}

      <div
        className={`admin-sidebar ${
          menuOpen ? "active" : ""
        }`}
      >

        <div className="admin-sidebar-header">

          <h2>{user?.name}</h2>

          <button
            className="admin-close-btn"
            onClick={() => setMenuOpen(false)}
          >
            <FaTimes />
          </button>

        </div>

        <div className="admin-sidebar-links">

          <Link
            to="/admin"
            onClick={() => setMenuOpen(false)}
          >
            <FaTachometerAlt />
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            onClick={() => setMenuOpen(false)}
          >
            <FaBoxOpen />
            Products
          </Link>

          <Link
            to="/admin/orders"
            onClick={() => setMenuOpen(false)}
          >
            <FaClipboardList />
            Orders
          </Link>

          <Link
            to="/admin/users"
            onClick={() => setMenuOpen(false)}
          >
            <FaUsers />
            Users
          </Link>

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            <FaStore />
            User Store
          </Link>

        </div>

        <div className="admin-sidebar-footer">

          <button onClick={handleLogout}>

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>
    </>
  );
}

export default AdminNavbar;