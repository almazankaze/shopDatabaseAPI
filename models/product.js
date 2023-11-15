import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true },
  shortname: { type: String, required: true },
  desc: String,
  img: String,
  price: {
    current: { type: Number, required: true, min: 0 },
    original: { type: Number, required: true, min: 0 },
  },
  onSale: { type: Boolean, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  inStock: { type: Boolean, default: false },
  categories: { type: [String], required: true },
});

ProductSchema.methods.toggleOnSale = function (isSale, newPrice) {
  this.onSale = isSale;
  this.price.current = newPrice;
  return this.save();
};

ProductSchema.statics.fireSale = function () {
  return this.updateMany(
    {},
    {
      onSale: true,
    }
  );
};

const Product = mongoose.model("product", ProductSchema);

export default Product;
