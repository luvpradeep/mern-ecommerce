const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ==========================
// GET USER CART
// ==========================

const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      user: req.user._id,
    }).populate("product");

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================
// ADD TO CART
// ==========================

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId).select(
    "_id stock price name image"
);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    let item = await Cart.findOne({
      user: req.user._id,
      product: productId,
    });

    if (item) {

      if (item.quantity >= product.stock) {
        return res.status(400).json({
          message: "Maximum stock reached",
        });
      }

      item.quantity += 1;

      await item.save();

    } else {

      item = await Cart.create({
        user: req.user._id,
        product: productId,
        quantity: 1,
      });

    }

    const populatedItem =
      await Cart.findById(item._id)
      .populate("product");

    res.status(200).json(populatedItem);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================
// UPDATE QUANTITY
// ==========================

const updateQuantity = async (req, res) => {

  try {

    const { quantity } = req.body;

    const item = await Cart.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("product");

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        message: "Invalid quantity",
      });
    }

    if (quantity > item.product.stock) {
      return res.status(400).json({
        message: "Stock limit exceeded",
      });
    }

    item.quantity = quantity;

    await item.save();

    const updated =
      await Cart.findById(item._id)
      .populate("product");

    res.status(200).json(updated);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// REMOVE ITEM
// ==========================

const removeItem = async (req, res) => {

  try {

    const item = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!item) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item removed",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// ==========================
// CLEAR CART
// ==========================

const clearCart = async (req, res) => {

  try {

    await Cart.deleteMany({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
};