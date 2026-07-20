const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  cancelOrder,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.put("/cancel/:id", protect, cancelOrder);

module.exports = router;
