import express from "express";

import { createReview, deleteReview } from "../controllers/reviews.js";

import { isAuthor, validateReview } from "../middlewares/reviews.js";
import { isLoggedIn } from "../middlewares/users.js";
import catchAsync from "../utils/catchAsync.js";

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post("/", isLoggedIn, validateReview, catchAsync(createReview));

reviewsRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  catchAsync(deleteReview)
);

export default reviewsRouter;
