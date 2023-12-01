import mongoose from "mongoose";
import Review from "../models/review.js";
import AppError from "../utils/AppError.js";

export const validateReview = (req, res, next) => {
  const { rating, body } = req.body;
  if (rating <= 0 || rating > 5) {
    const msg = "rating should be between 1 and 5";
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

export const isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    throw new AppError(`No product with id ${id} found`, 404);

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    throw new AppError(`No review with id ${reviewId} found`, 404);

  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    throw new AppError("Unauthorized action", 401);
  } else next();
};
