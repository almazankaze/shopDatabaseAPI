import { ReviewSchema } from "../schemas.js";
import AppError from "../utils/AppError.js";
import Review from "../models/review.js";

export const validateReview = (req, res, next) => {
  const { error } = ReviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
