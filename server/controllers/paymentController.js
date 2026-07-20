const Razorpay = require("razorpay");
const crypto = require("crypto");
const Cart = require("../models/Cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {

    const cart = await Cart.find({
      user: req.user._id,
    }).populate("product");

    if (!cart.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const itemsPrice = cart.reduce(
      (sum, item) =>
        sum +
        item.product.price * item.quantity,
      0
    );

    const shippingPrice =
      itemsPrice >= 999 ? 0 : 60;

    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));

    const total =
      itemsPrice +
      shippingPrice +
      taxPrice;

    const options = {
      amount: total * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order =
      await razorpay.orders.create(options);

    res.json({
      success: true,
      amount: total,
      razorpayOrder: order,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const generatedSignature = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(
      razorpay_order_id + "|" + razorpay_payment_id
    )
    .digest("hex");

  if (
    generatedSignature === razorpay_signature
  ) {
    return res.json({
      success: true,
    });
  }

  res.status(400).json({
    success: false,
  });
};

module.exports = {
  createOrder,
  verifyPayment,
};