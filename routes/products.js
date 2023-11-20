import express from "express";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  getOnSale,
} from "../controllers/products.js";

import catchAsync from "../utils/catchAsync.js";
import { validateProduct } from "../middlewares/product.js";

const productsRouter = express.Router({ mergeParams: true });

productsRouter.get("/", catchAsync(getProducts));
productsRouter.get("/onSale", catchAsync(getOnSale));
productsRouter.post("/", validateProduct, catchAsync(createProduct));
productsRouter.get("/:id", catchAsync(getSingleProduct));
productsRouter.put("/:id", updateProduct);

export default productsRouter;
