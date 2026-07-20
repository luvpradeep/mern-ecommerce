import { useContext } from "react";

import "./Notifications.css";

import {
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaBell,
  FaTrash,
  FaCheck,
  FaClock,
} from "react-icons/fa";

import { FaEnvelopeOpen } from "react-icons/fa6";

import { NotificationContext } from "../context/NotificationContext";

function Notifications() {
  const {
    notifications,
    unreadCount,
    loading,

    markRead,
    markAllRead,
    deleteNotification,
    clearRead,
  } = useContext(NotificationContext);

  // =====================================
  // ICONS
  // =====================================

  const getIcon = (message = "") => {
    const text = message.toLowerCase();

    if (text.includes("placed"))
      return <FaShoppingBag className="order-icon" />;

    if (text.includes("shipped")) return <FaTruck className="ship-icon" />;

    if (text.includes("delivered"))
      return <FaCheckCircle className="success-icon" />;

    if (text.includes("cancel"))
      return <FaTimesCircle className="cancel-icon" />;

    return <FaBell className="bell-icon" />;
  };

  const getTypeClass = (message = "") => {
    const text = message.toLowerCase();

    if (text.includes("placed")) return "order";

    if (text.includes("shipped")) return "shipping";

    if (text.includes("delivered")) return "success";

    if (text.includes("cancel")) return "cancel";

    return "default";
  };

  // =====================================
  // TIME
  // =====================================

  const getRelativeTime = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    if (seconds < 60) return "Just now";

    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;

    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hrs ago`;

    if (seconds < 172800) return "Yesterday";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>

          <p>Stay updated with your latest shopping activity.</p>
        </div>

        {notifications.length > 0 && (
          <div className="header-buttons">
            <button className="mark-btn" onClick={markAllRead}>
              <FaEnvelopeOpen />
              Mark All Read
            </button>

            <button className="clear-btn" onClick={clearRead}>
              <FaTrash />
              Clear Read
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="notification-loading">Loading Notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="empty-notifications">
          <FaBell className="empty-icon" />

          <h2>No Notifications</h2>

          <p>We'll notify you when something important happens.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`notification-card ${getTypeClass(
                n.message,
              )} ${!n.isRead ? "unread" : ""}`}
            >
              <div className="notification-left">{getIcon(n.message)}</div>

              <div className="notification-content">
                <div className="notification-top">
                  <p>{n.message}</p>

                  {!n.isRead && <span className="new-badge">NEW</span>}
                </div>

                <small>
                  <FaClock />

                  {getRelativeTime(n.createdAt)}
                </small>
              </div>

              <div className="notification-actions">
                {!n.isRead && (
                  <button className="read-btn" onClick={() => markRead(n._id)}>
                    <FaCheck />
                  </button>
                )}

                <button
                  className="del-btn"
                  onClick={() => deleteNotification(n._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
