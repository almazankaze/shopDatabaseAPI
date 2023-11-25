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
import { isLoggedIn } from "../middlewares/users.js";

const productsRouter = express.Router({ mergeParams: true });

productsRouter
  .get("/", catchAsync(getProducts))
  .post("/", validateProduct, catchAsync(createProduct));

productsRouter.get("/onSale", catchAsync(getOnSale));

productsRouter
  .get("/:id", catchAsync(getSingleProduct))
  .put("/:id", updateProduct);

export default productsRouter;
