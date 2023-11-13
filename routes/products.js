import express from "express";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  removeProduct,
} from "../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getSingleProduct);
productsRouter.post("/new", createProduct);
productsRouter.delete("/:id", removeProduct);

export default productsRouter;
