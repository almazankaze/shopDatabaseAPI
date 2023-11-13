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
  dprice: "",
  oprice: 69.99,
  percentOff: "",
  rating: 4,
  inStock: true,
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
    await Product.findByIdAndRemove("655191cce773ae970ed4b058");

    return "Deleted product";
  } catch (err) {
    return "Error deleting the product";
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
