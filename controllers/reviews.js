import mongoose from "mongoose";
import Product from "../models/product.js";
import Review from "../models/review.js";
import AppError from "../utils/AppError.js";

export const createReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(`No product with id ${id} found`, 404);

  const product = await Product.findById(req.params.id);

  if (!product) throw new AppError(`No product with id ${id} found`, 404);

  const review = new Review(req.body);
  review.author = req.user._id;

  product.reviews.push(review);
  await review.save();
  await product.save();
  res.status(201).json(review);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({ status: 200, message: "Review removed successfully" });
};
