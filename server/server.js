const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const cartRoutes = require("./routes/cartRoutes");

const invoiceRoutes = require("./routes/invoiceRoutes");

const connectDB = require("./config/db");
connectDB();

const app = express();

const allowedOrigins = [
  "https://mern-ecommerce-henna-omega.vercel.app",
];

app.use(
  cors({
    origin: "https://mern-ecommerce-henna-omega.vercel.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/invoice", invoiceRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
