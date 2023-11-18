import express from "express";

import catchAsync from "../utils/catchAsync.js";
import { validateReview } from "../middlewares/review.js";

const reviewsRouter = express.Router();

export default reviewsRouter;
