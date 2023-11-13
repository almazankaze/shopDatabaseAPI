import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: String,
  shortname: String,
  desc: String,
  img: String,
  dprice: Number,
  oprice: Number,
  percentOff: Number,
  rating: Number,
  inStock: Boolean,
});

const Product = mongoose.model("product", ProductSchema);

export default Product;
