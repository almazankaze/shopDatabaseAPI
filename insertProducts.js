import mongoose from "mongoose";
import express from "express";
import SHOP_DATA from "./products.js";
import Product from "./models/product.js";
import Review from "./models/review.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const seedDB = async () => {
  await Product.deleteMany({});
  await Review.deleteMany({});
  for (let i = 0; i < SHOP_DATA.length; i++) {
    const product = new Product({
      ...SHOP_DATA[i],
    });
    await product.save();
  }
};

mongoose
  .connect(process.env.CONNECTION)
  .then(() => {
    console.log("connected to database");
    seedDB().then(() => {
      mongoose.connection.close();
      console.log("inserted new products and closed connection");
    });
  })
  .catch((e) =>
    console.log("Something went wrong and could not start server.")
  );
