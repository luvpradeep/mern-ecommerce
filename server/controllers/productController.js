const Product = require("../models/Product");

// Create Product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    let query = {};

    // Search
    if (req.query.keyword) {
      query.name = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // Category Filter
    if (
      req.query.category &&
      req.query.category !== "All"
    ) {
      query.category = req.query.category;
    }

    // Pagination
    const page =
      Number(req.query.page) || 1;

    const limit = 20;

    const skip =
      (page - 1) * limit;

    let sortOption = {};

    // Sort
    if (req.query.sort === "priceLow") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "priceHigh") {
      sortOption = { price: -1 };
    }

    if (req.query.sort === "rating") {
      sortOption = { rating: -1 };
    }

    const totalProducts =
      await Product.countDocuments(
        query
      );

    const products =
      await Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(
        totalProducts / limit
      ),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product By ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Product Review
const createProductReview = async (req, res) => {
  try {

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const review = product.reviews.find(
      (r) =>
        r.user.toString() ===
        req.user._id.toString()
    );

    if (review) {

      review.rating = Number(rating);
      review.comment = comment;

      product.rating =
        product.reviews.reduce(
          (acc, item) => acc + item.rating,
          0
        ) / product.reviews.length;

      await product.save();

      return res.json({
        success: true,
        action: "updated",
        message: "Review Updated",
      });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      action: "created",
      message: "Review Submitted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
};
