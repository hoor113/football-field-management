import mongoose from "mongoose"
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  field_id: { type: Schema.Types.ObjectId, ref: 'Field', required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  created_at: { type: Date, default: Date.now }
});

export const Rating =  mongoose.model("Rating", RatingSchema)