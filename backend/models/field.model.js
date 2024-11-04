import mongoose from "mongoose"
import { Rating } from "./rating.model";
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Schema.Types.Decimal128, required: true }
});

const GroundSchema = new Schema({
    ground_number: { type: Number, required: true },
    name: { type: String, required: true },
    status: { type: Boolean, default: true },
    size: { type: String, required: true },
    material: { type: String, required: true },
    price_per_hour: { type: Schema.Types.Decimal128, required: true }
});
  

const FieldSchema = new Schema({
    owner_id: { type: Schema.Types.ObjectId, ref: 'FieldOwner', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    base_price: { type: Schema.Types.Decimal128, required: true },
    image_url: { type: String },
    status: { type: Boolean, default: true },
    total_grounds: { type: Number, required: true },
    grounds: [GroundSchema],
    services: [ServiceSchema]
});

// Calculate average ratings - Not sure how it works
/*
FieldSchema.methods.getAverageRating = async function() {
    return await Rating.aggregate([
      { $match: { field_id: this._id }},
      { 
        $group: {
          _id: null,
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
  };

FieldSchema.virtual('averageRating', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'field_id',
    options: { lean: true },
    pipeline: [
      {
        $group: {
          _id: null,
          averageStars: { $avg: '$stars' },
          totalRatings: { $sum: 1 }
        }
      }
    ]
  });
*/

export const Field = new mongoose.model("Field", FieldSchema)