import mongoose from "mongoose";
import Product from "../models/product.js";

const projectStage = {
  $project: {
    _id: 1,
    score: { $meta: "searchScore" },
    name: 1,
    img: 1,
    price: 1,
    onSale: 1,
    rating: 1,
    inStock: 1,
    categories: 1,
  },
};

const limitStage = {
  $limit: 64,
};

const createSearchAggregation = async (
  searchTerm,
  onSale,
  inStock,
  freeShipping,
  category,
  minPrice,
  maxPrice
) => {
  let searchAggregation = [];

  let searchStage = {
    $search: {
      compound: {},
    },
  };

  let filterArray = [];
  let mustArray = [];
  let shouldArray = [];
  let mustNotArray = [];

  const searchTermObject = {
    text: {
      query: searchTerm,
      path: ["name", "categories"],
      fuzzy: {
        maxEdits: 1,
      },
    },
  };

  const inStockObject = {
    equals: {
      value: true,
      path: "inStock",
    },
  };

  const onSaleObject = {
    equals: {
      value: true,
      path: "onSale",
    },
  };

  const shippingObject = {
    range: {
      path: "price.current",
      gte: 30,
    },
  };

  const categoryObject = {
    text: {
      query: category,
      path: "categories",
    },
  };

  const rangeObject = {
    range: {
      path: "price.current",
      gte: minPrice,
      lte: maxPrice,
    },
  };

  if (searchTerm !== "") {
    mustArray.push(searchTermObject);
  }

  if (onSale === true) {
    mustArray.push(onSaleObject);
  }

  if (inStock === true) {
    mustArray.push(inStockObject);
  }

  if (freeShipping === true) {
    filterArray.push(shippingObject);
  }

  if (category.length !== 0) {
    mustArray.push(categoryObject);
  }

  filterArray.push(rangeObject);

  searchStage.$search.compound.must = mustArray;
  searchStage.$search.compound.filter = filterArray;

  searchAggregation.push(searchStage, limitStage, projectStage);

  return searchAggregation;
};

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
  const onSale = /true/.test(req.query.onSale);
  const inStock = /true/.test(req.query.inStock);
  const freeShipping = /true/.test(req.query.freeShip);
  const categories = req.query.categories ? req.query.categories : [];
  const minPrice = req.query.minPrice ? req.query.minPrice : 0;
  const maxPrice = req.query.maxPrice ? req.query.maxPrice : 10000;
  const limit = 8;
  const result = {};

  result.page = page;

  try {
    const agg = await createSearchAggregation(
      term,
      onSale,
      inStock,
      freeShipping,
      categories,
      minPrice,
      maxPrice
    );

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
