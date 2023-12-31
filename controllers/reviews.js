import mongoose from "mongoose";
import Product from "../models/product.js";
import Review from "../models/review.js";
import AppError from "../utils/AppError.js";

export const createReview = async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) throw new AppError(`No product with id ${id} found`, 404);

  const review = new Review(req.body);
  review.author = req.user._id;

  const date = new Date().toISOString().slice(0, 10);
  review.date = date;

  product.reviews.push(review);
  await review.save();
  await product.save();

  const updatedReview = await Review.findById(review._id).populate("author");

  res.status(201).json(updatedReview);
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({
    status: 200,
    _id: reviewId,
    message: "Review removed successfully",
  });
};
