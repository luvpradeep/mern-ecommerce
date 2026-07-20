const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

router.post(
  "/:productId",
  protect,
  addToWishlist
);

router.get(
  "/",
  protect,
  getWishlist
);

router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);

module.exports = router;