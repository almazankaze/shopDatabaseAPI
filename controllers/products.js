import mongoose from "mongoose";
import Product from "../models/product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No birthday with that id exists");
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (e) {
    res.status(404).json({ message: e.message });
  }
};
