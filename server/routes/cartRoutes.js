const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

router.get("/", protect, getCart);

router.post("/", protect, addToCart);

router.put("/:id", protect, updateQuantity);

router.delete("/:id", protect, removeItem);

router.delete("/clear/all", protect, clearCart);

module.exports = router;