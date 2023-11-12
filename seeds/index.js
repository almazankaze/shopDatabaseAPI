import mongoose from "mongoose";
import SHOP_DATA from "./products.js";
import Product from "../models/product.js";

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce-store");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Product.deleteMany({});
  for (let i = 0; i < SHOP_DATA.length; i++) {
    const product = new Product({
      ...SHOP_DATA[i],
    });
    await product.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
