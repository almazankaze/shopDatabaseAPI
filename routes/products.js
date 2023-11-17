import express from "express";

import {
  getProducts,
  getSingleProduct,
  updateProduct,
} from "../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getSingleProduct);
productsRouter.put("/:id", updateProduct);

export default productsRouter;
