import express from "express";

import { getProducts, getSingleProduct } from "../controllers/products.js";

const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getSingleProduct);

export default productsRouter;
