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

  product.reviews.push(review);
  await review.save();
  await product.save();
  res.status(201).json(product);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(`No product with id ${id} found`, 404);

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    throw new AppError(`No review with id ${reviewId} found`, 404);

  await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({ status: 200, message: "Review removed successfully" });
};
