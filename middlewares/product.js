import { ProductSchema } from "../schemas.js";
import AppError from "../utils/AppError.js";
import Product from "../models/product.js";

export const validateProduct = (req, res, next) => {
  const { error } = ProductSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
