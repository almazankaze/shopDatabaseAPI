import mongoose from "mongoose";
import express from "express";
import Product from "./models/product.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const newProduct = {
  name: "Call of Duty: Modern Warfare III Standard Edition - PlayStation 5",
  shortname: "Call of Duty: Modern Warfare III",
  desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque culpa, odio, qui praesentium dignissimos eaque dolorum porro alias neque, eius animi ipsa voluptates. Optio repellat tempora voluptas, dolores ipsam ad!",
  img: "",
  price: {
    current: 59.99,
    original: 59.99,
  },
  onSale: false,
  inStock: true,
  productType: "Games",
  categories: ["Nintendo Switch"],
};

const addProduct = async () => {
  const product = new Product(newProduct);

  try {
    await product.save();
    return "Inserted new product";
  } catch (err) {
    return "Error inserting new product";
  }
};

const removeProduct = async () => {
  try {
    await Product.findByIdAndRemove(process.env.ID);

    return "Deleted product";
  } catch (err) {
    return "Error deleting the product";
  }
};

const updateProduct = async () => {
  try {
    const updated = await Product.findByIdAndUpdate(
      process.env.ID,
      {
        inStock: false,
      },
      { new: true, runValidators: true }
    );

    // await foundProduct.toggleOnSale(true, 20);

    return "Updated product";
  } catch (err) {
    return "Error updating the product";
  }
};

mongoose
  .connect(process.env.CONNECTION)
  .then(() => {
    console.log("connected to database");
    removeProduct().then((mess) => {
      mongoose.connection.close();
      console.log(`${mess} and closed connection`);
    });
  })
  .catch((e) =>
    console.log("Something went wrong and could not start server.")
  );
