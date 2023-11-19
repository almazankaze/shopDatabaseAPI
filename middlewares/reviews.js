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
