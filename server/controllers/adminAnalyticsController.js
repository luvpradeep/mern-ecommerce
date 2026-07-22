const Product = require("../models/Product");
const User = require("../models/user");
const Order = require("../models/order");

const getDashboardStats = async (req, res) => {
  try {
    const products = await Product.find();
    const users = await User.find();
    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    const deliveredOrders = orders.filter(
      (o) => o.orderStatus === "Delivered"
    ).length;

    const pendingOrders = orders.length - deliveredOrders;

    const averageOrderValue =
      orders.length > 0
        ? Math.round(totalRevenue / orders.length)
        : 0;

    const lowStockCount = products.filter(
      (p) => p.stock > 0 && p.stock < 5
    ).length;

    const outOfStockCount = products.filter(
      (p) => p.stock === 0
    ).length;

    const inStockCount = products.filter(
      (p) => p.stock >= 5
    ).length;

    const adminCount = users.filter(
      (u) => u.role === "admin"
    ).length;

    const customerCount = users.filter(
      (u) => u.role === "user"
    ).length;

    res.json({
      productCount: products.length,

      inStockCount,
      lowStockCount,
      outOfStockCount,

      userCount: users.length,
      adminCount,
      customerCount,

      orderCount: orders.length,
      deliveredOrders,
      pendingOrders,

      totalRevenue,
      averageOrderValue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAnalytics = async (req, res) => {
  try {

    // Monthly Revenue
    const orders = await Order.find();

    const revenueByMonth = Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(
        order.createdAt
      ).getMonth();

      revenueByMonth[month] +=
        order.totalPrice;
    });

    // Category Counts
    const products =
      await Product.find();

    const categoryMap = {};

    products.forEach((product) => {
      categoryMap[product.category] =
        (categoryMap[
          product.category
        ] || 0) + 1;
    });

    res.json({
      revenueByMonth,
      categoryCounts: categoryMap,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { 
       getDashboardStats,
       getAnalytics,
       };