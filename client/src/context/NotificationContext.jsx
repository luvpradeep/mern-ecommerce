import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

import { AuthContext } from "./AuthContext";

import api from "../services/api";

export const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  // ==============================
  // Fetch Notifications
  // ==============================

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/notifications");

      setNotifications(
        Array.isArray(data.notifications)
          ? data.notifications
          : []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  if (user) {
    fetchNotifications();
  } else {
    setNotifications([]);
  }
}, [user, fetchNotifications]);

  // ==============================
  // Computed Badge Count
  // ==============================

  const unreadCount = notifications.reduce(
    (count, item) => count + (!item.isRead ? 1 : 0),
    0
  );

  // ==============================
  // Add Notification
  // (used after placing an order)
  // ==============================

  const addNotification = (notification) => {
    setNotifications((prev) => [
      notification,
      ...prev,
    ]);
  };

  // ==============================
  // Mark Single Read
  // ==============================

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      await fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // Mark All Read
  // ==============================

  const markAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      await fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // Delete One
  // ==============================

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      await fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // Clear Read
  // ==============================

  const clearRead = async () => {
    try {
      await api.delete(
        "/notifications/clear-read"
      );
      await fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        loading,

        notifications,

        unreadCount,

        fetchNotifications,

        addNotification,

        markRead,

        markAllRead,

        deleteNotification,

        clearRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationProvider;