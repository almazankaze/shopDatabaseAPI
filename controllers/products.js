import mongoose from "mongoose";
import Product from "../models/product.js";

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
