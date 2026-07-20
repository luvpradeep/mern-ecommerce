const Notification = require("../models/Notification");

// =====================================
// GET USER NOTIFICATIONS
// =====================================

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("order", "_id orderStatus");

    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// MARK SINGLE NOTIFICATION AS READ
// =====================================

exports.markAsRead = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// MARK ALL AS READ
// =====================================

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// DELETE SINGLE NOTIFICATION
// =====================================

exports.deleteNotification = async (req, res) => {
  try {
    const notification =
      await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// CLEAR ALL READ NOTIFICATIONS
// =====================================

exports.clearReadNotifications = async (
  req,
  res
) => {
  try {
    await Notification.deleteMany({
      user: req.user._id,
      isRead: true,
    });

    res.json({
      success: true,
      message: "Read notifications cleared",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =====================================
// UNREAD COUNT
// =====================================

exports.getUnreadCount = async (req, res) => {
  try {
    const count =
      await Notification.countDocuments({
        user: req.user._id,
        isRead: false,
      });

    res.json({
      success: true,
      unreadCount: count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};