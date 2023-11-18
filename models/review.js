import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: { type: String, required: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
});

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
