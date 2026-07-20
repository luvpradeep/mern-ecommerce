const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const products = require("./data/seedProducts");

dotenv.config();

// ===============================
// CONNECT DATABASE
// ===============================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

// ===============================
// IMPORT PRODUCTS
// ===============================

const importData = async () => {
  try {
    // Delete existing products
    await Product.deleteMany();

    // Insert new products
    await Product.insertMany(products);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// ===============================
// DELETE PRODUCTS ONLY
// ===============================

const destroyData = async () => {
  try {
    await Product.deleteMany();

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// ===============================
// COMMANDS
// ===============================

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}