const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");

    orders.sort((a, b) => {
      if (a.orderStatus !== "Delivered" && b.orderStatus === "Delivered")
        return -1;

      if (a.orderStatus === "Delivered" && b.orderStatus !== "Delivered")
        return 1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const totalOrders = orders.length;

    const processingOrders = orders.filter(
      (order) => order.orderStatus !== "Delivered",
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered",
    ).length;

    const totalRevenue = orders
  .filter((o) => o.orderStatus !== "Cancelled")
  .reduce((sum, order) => sum + order.totalPrice, 0);

  const cancelledOrders = orders.filter(
  (o) => o.orderStatus === "Cancelled",
).length;

    res.status(200).json({
      success: true,
      orders,
      stats: {
        totalOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const validStatus = [
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Prevent editing completed orders
    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      return res.status(400).json({
        success: false,
        message: `Order already ${order.orderStatus}`,
      });
    }

    order.orderStatus = orderStatus;

    // Auto payment update for COD
    if (
      orderStatus === "Delivered" &&
      order.paymentMethod === "COD"
    ) {
      order.paymentInfo.status = "Paid";
    }

    await order.save();

    // Notify customer
    await Notification.create({
      user: order.user,
      title: "Order Update",
      message: `Your order status has been updated to "${orderStatus}".`,
    });

    res.json({
      success: true,
      message: "Order updated successfully",
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

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled",
      });
    }

    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,

        {
          $inc: {
            stock: item.qty,
          },
        },
      );
    }

    order.orderStatus = "Cancelled";

    await order.save();

    await Notification.create({
      user: order.user,

      title: "Order Cancelled",

      message: `Your order #${order._id.toString().slice(-8)} has been cancelled by admin.`,
    });

    res.json({
      success: true,

      message: "Order cancelled successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,

      message: err.message,
    });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};
