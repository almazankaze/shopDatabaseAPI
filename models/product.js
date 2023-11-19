import mongoose from "mongoose";
import Review from "./review.js";
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
  inStock: { type: Boolean, required: true },
  productType: { type: String, required: true },
  categories: { type: [String], required: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

ProductSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
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

const Product = mongoose.model("Product", ProductSchema);

export default Product;
