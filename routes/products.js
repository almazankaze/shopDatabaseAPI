import express from "express";

import {
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/products.js";

import catchAsync from "../utils/catchAsync.js";
import { validateProduct } from "../middlewares/product.js";

const productsRouter = express.Router();

productsRouter.get("/", catchAsync(getProducts));
productsRouter.get("/:id", catchAsync(getSingleProduct));
productsRouter.put("/:id", updateProduct);

export default productsRouter;
