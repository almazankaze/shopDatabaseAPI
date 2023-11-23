import mongoose from "mongoose";
import Product from "../models/product.js";
import AppError from "../utils/AppError.js";

export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
};

export const getOnSale = async (req, res) => {
  const products = await Product.find({ onSale: true }).limit(8);
  res.status(200).json(products);
};

export const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(`No product with id ${id} found`, 404);

  const product = await Product.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  });

  if (!product) throw new AppError(`No product with id ${id} found`, 404);

  res.status(200).json(product);
};

export const createProduct = async (req, res) => {
  const product = new Product(req.body.product);
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
};
