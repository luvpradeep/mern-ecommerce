const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  try {
    const existing = await Wishlist.findOne({
      user: req.user._id,
      product: req.params.productId,
    });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);

      return res.json({
        success: true,
        action: "removed",
        message: "Removed from wishlist",
      });
    }

    await Wishlist.create({
      user: req.user._id,
      product: req.params.productId,
    });

    res.status(201).json({
      success: true,
      action: "added",
      message: "Added to wishlist",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      user: req.user._id,
    }).populate("product");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      product: req.params.productId,
    });

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};