const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProductReview,
} = require("../controllers/productController");

const  protect  = require("../middleware/authMiddleware");

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post(
  "/:id/reviews",
  protect,
  createProductReview
);

module.exports = router;