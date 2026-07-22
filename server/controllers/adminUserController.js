const User = require("../models/user");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().sort({
      createdAt: -1,
    });

    const totalUsers = users.length;

    const adminUsers = users.filter(
      (user) => user.role === "admin"
    ).length;

    const customerUsers = users.filter(
      (user) => user.role !== "admin"
    ).length;

    res.status(200).json({
      success: true,
      users,
      stats: {
        totalUsers,
        adminUsers,
        customerUsers,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Make Admin
const makeAdmin = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "User is already an admin",
      });
    }

    user.role = "admin";

    await user.save();

    res.json({
      success: true,
      message: "User promoted to admin",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {

    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getAllUsers,
  makeAdmin,
  deleteUser,
};
