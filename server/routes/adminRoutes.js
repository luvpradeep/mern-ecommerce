const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/adminController");

const {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/adminOrderController");

const {
  getDashboardStats,
  getAnalytics,
} = require("../controllers/adminAnalyticsController");

const {
  getAllUsers,
  makeAdmin,
  deleteUser,
} = require("../controllers/adminUserController");

// GET DASHBOARD STATS
router.get(
  "/dashboard",
  protect,
  adminMiddleware,
  getDashboardStats
);

// GET ANALYTICS
router.get(
  "/analytics",
  protect,
  adminMiddleware,
  getAnalytics
);

// GET ALL PRODUCTS
router.get(
  "/products",
  protect,
  adminMiddleware,
  getProducts
);

// GET PRODUCT BY ID
router.get(
  "/products/:id",
  protect,
  adminMiddleware,
  getProductById
);

// CREATE PRODUCT
router.post(
  "/products",
  protect,
  adminMiddleware,
  createProduct
);

// UPDATE PRODUCT
router.put(
  "/products/:id",
  protect,
  adminMiddleware,
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/products/:id",
  protect,
  adminMiddleware,
  deleteProduct
);

// GET ALL ORDERS
router.get(
  "/orders",
  protect,
  adminMiddleware,
  getAllOrders
);

// UPDATE ORDER STATUS
router.put(
  "/orders/:id/status",
  protect,
  adminMiddleware,
  updateOrderStatus
);

// CANCEL ORDER
router.put(
  "/orders/:id/cancel",
  protect,
  adminMiddleware,
  cancelOrder
);

// GET ALL USER
router.get(
  "/users",
  protect,
  adminMiddleware,
  getAllUsers
);

// MAKE ADMIN
router.put(
  "/users/:id/admin",
  protect,
  adminMiddleware,
  makeAdmin
);

// DELETE USER
router.delete(
  "/users/:id",
  protect,
  adminMiddleware,
  deleteUser
);

module.exports = router;