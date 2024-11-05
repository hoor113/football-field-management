import mongoose from "mongoose"
const Schema = mongoose.Schema;

const BookedServiceSchema = new Schema({
  service_id: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Schema.Types.Decimal128, required: true }
});

const BookingSchema = new Schema({
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  field_id: { type: Schema.Types.ObjectId, ref: 'Field', required: true },
  ground_id: { type: Schema.Types.ObjectId, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  order_time: { type: Date, default: Date.now },
  price: { type: Schema.Types.Decimal128, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  services: [BookedServiceSchema]
});

export const Booking =  mongoose.model("Booking", BookingSchema)