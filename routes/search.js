import express from "express";

import { getAutoCompleteProducts, getProducts } from "../controllers/search.js";

const searchRouter = express.Router();

searchRouter.get("/", getProducts);
searchRouter.get("/autocomplete", getAutoCompleteProducts);

export default searchRouter;
