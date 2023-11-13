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
              maxEdits: 2,
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
  try {
    const { term } = req.query;

    const agg = [
      {
        $search: {
          text: {
            query: term,
            path: "name",
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      },
      {
        $limit: 50,
      },
      {
        $project: {
          _id: 1,
          score: { $meta: "searchScore" },
          name: 1,
          img: 1,
          dprice: 1,
          oprice: 1,
          percentOff: 1,
          rating: 1,
          inStock: 1,
        },
      },
    ];

    const resp = await Product.aggregate(agg);

    return res.json(resp);
  } catch (err) {
    res.json([]);
  }
};
