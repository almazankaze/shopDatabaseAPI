import express from "express";

import { createReview, deleteReview } from "../controllers/reviews.js";

import catchAsync from "../utils/catchAsync.js";
import { validateReview } from "../middlewares/review.js";

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post("/", validateReview, catchAsync(createReview));

reviewsRouter.delete("/:reviewId", catchAsync(deleteReview));

export default reviewsRouter;
