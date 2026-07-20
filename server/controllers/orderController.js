const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Notification = require("../models/Notification");

// =====================================
// CREATE ORDER
// =====================================

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, paymentInfo } =
      req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const finalItems = [];

    // ==========================
    // VERIFY STOCK
    // ==========================

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.qty) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} item(s) left.`,
        });
      }

      finalItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
    }

    // ==========================
    // CALCULATE ORDER TOTALS
    // ==========================

    const itemsPrice = finalItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );

    const shippingPrice = itemsPrice >= 999 ? 0 : 60;

    const taxPrice = Math.round(itemsPrice * 0.05); // 5% GST

    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // ==========================
    // CREATE ORDER
    // ==========================

    const order = await Order.create({
      user: req.user._id,

      orderItems: finalItems,

      shippingAddress,

      paymentMethod,

      paymentInfo:
        paymentMethod === "COD"
          ? {
              status: "Pending",
            }
          : paymentInfo,

      itemsPrice,

      shippingPrice,

      taxPrice,

      totalPrice,
    });

    // ==========================
    // UPDATE STOCK
    // ==========================

    for (const item of finalItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.qty,
        },
      });
    }

    // ==========================
    // CLEAR USER CART
    // ==========================

    await Cart.deleteMany({
      user: req.user._id,
    });

    // ==========================
    // CREATE NOTIFICATION
    // ==========================

    await Notification.create({
      user: req.user._id,
      title: "Order Placed",
      message: "Your order has been placed successfully.",
    });

    // ==========================
    // SUCCESS
    // ==========================

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET MY ORDERS
// =====================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("orderItems.product")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET SINGLE ORDER
// =====================================

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// CANCEL ORDER
// =====================================

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "Processing" && order.orderStatus !== "Packed") {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled.",
      });
    }

    order.orderStatus = "Cancelled";

    if (order.paymentMethod === "COD") {
      order.paymentInfo.status = "Cancelled";
    }

    await order.save();

    // Restore stock

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: item.qty,
        },
      });
    }

    // Notification

    await Notification.create({
      user: req.user._id,
      title: "Order Cancelled",
      message: `Order #${order._id.toString().slice(-8)} has been cancelled.`,
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};
