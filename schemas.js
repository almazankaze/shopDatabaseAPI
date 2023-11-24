import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

export const ProductSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required().escapeHTML(),
    shortname: Joi.string().required().escapeHTML(),
    price: Joi.object({
      current: Joi.number().required().min(0),
      original: Joi.number().required().min(0),
    }).required(),
    onSale: Joi.boolean().required(),
    inStock: Joi.boolean().required(),
    productType: Joi.string().required().escapeHTML(),
    categories: Joi.array().items(Joi.string().required().escapeHTML()),
  }).required(),
});
