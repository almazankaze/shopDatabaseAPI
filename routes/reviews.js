import express from "express";

import { createReview, deleteReview } from "../controllers/reviews.js";

import { isAuthor, notPosted, validateReview } from "../middlewares/reviews.js";
import { isLoggedIn } from "../middlewares/users.js";
import catchAsync from "../utils/catchAsync.js";

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post(
  "/",
  isLoggedIn,
  catchAsync(notPosted),
  validateReview,
  catchAsync(createReview)
);

reviewsRouter.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(isAuthor),
  catchAsync(deleteReview)
);

export default reviewsRouter;
