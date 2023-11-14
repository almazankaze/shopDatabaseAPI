import mongoose from "mongoose";
import Product from "../models/product.js";

export const getAutoCompleteProducts = async (req, res) => {
  try {
    const { auto } = req.query;

    const agg = [
      {
        $search: {
          autocomplete: {
            query: auto,
            path: "name",
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          shortname: 1,
        },
      },
    ];

    const resp = await Product.aggregate(agg);

    return res.json(resp);
  } catch (err) {
    res.json([]);
  }
};

export const getProducts = async (req, res) => {
  const term = req.query.term;
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 8;
  const result = {};

  result.page = page;

  try {
    const agg = [
      {
        $search: {
          text: {
            query: term,
            path: ["name", "categories"],
            fuzzy: {
              maxEdits: 1,
            },
          },
        },
      },
      {
        $limit: 64,
      },
      {
        $project: {
          _id: 1,
          score: { $meta: "searchScore" },
          name: 1,
          img: 1,
          dprice: 1,
          oprice: 1,
          onSale: 1,
          rating: 1,
          inStock: 1,
          categories: 1,
        },
      },
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const resp = await Product.aggregate(agg);
    result.pages = Math.ceil(resp.length / limit);

    result.result = resp.slice(startIndex, endIndex);

    return res.json(result);
  } catch (err) {
    result.result = [];
    result.pages = 0;
    res.json(result);
  }
};
