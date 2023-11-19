import joi from "joi";

const Joi = joi;

export const ProductSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    shortname: Joi.string().required(),
    price: Joi.object({
      current: Joi.number().required().min(0),
      original: Joi.number().required().min(0),
    }).required(),
    onSale: Joi.boolean().required,
    inStock: Joi.boolean().required,
    productType: Joi.string().required(),
    categories: Joi.array().items(Joi.string().required),
  }).required(),
});
