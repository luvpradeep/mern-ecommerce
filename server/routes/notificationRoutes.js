const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  clearReadNotifications,
  getUnreadCount,
} = require("../controllers/notificationController");

const protect  = require("../middleware/authMiddleware");

// =====================================
// GET ALL NOTIFICATIONS
// =====================================

router.get("/", protect, getNotifications);

// =====================================
// GET UNREAD COUNT
// =====================================

router.get("/unread-count", protect, getUnreadCount);

// =====================================
// MARK ALL AS READ
// =====================================

router.put("/read-all", protect, markAllRead);

// =====================================
// MARK SINGLE AS READ
// =====================================

router.put("/:id/read", protect, markAsRead);

// =====================================
// CLEAR ALL READ NOTIFICATIONS
// =====================================

router.delete(
  "/clear-read",
  protect,
  clearReadNotifications
);

// =====================================
// DELETE SINGLE NOTIFICATION
// =====================================

router.delete(
  "/:id",
  protect,
  deleteNotification
);

module.exports = router;