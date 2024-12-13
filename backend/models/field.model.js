import mongoose from "mongoose"
// import { Rating } from "./rating.model";
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, default: 'Không có mô tả' },
  image_url: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzBeng5o2seSmkdywgldLhL4PQd0nAhJWNnQ&s' },
  unit: { type: String, required: true, default: 'cái' },
  price: { type: Number, required: true }
});


// Define a single time slot (e.g., 7:00-9:00, 9:00-11:00)
const TimeSlotSchema = new Schema({
  start_time: { type: String, required: true }, // "07:00"
  end_time: { type: String, required: true },   // "09:00"
  is_available: { type: Boolean, default: true }
});

// Define daily schedule
const DailyScheduleSchema = new Schema({
  day_of_week: { type: Number, required: true }, // 0-6
  time_slots: [TimeSlotSchema]
});

// Update occupation schema with booking window
const OccupationSchema = new Schema({
  date: { type: Date, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  booking_id: { type: Schema.Types.ObjectId, ref: 'Booking' },
  customer_id: { type: Schema.Types.ObjectId, ref: 'Customer' },
});

const GroundSchema = new Schema({
  ground_number: { type: Number, required: true },
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
  size: { type: String, required: true },
  material: { type: String, required: true },
  // price: { type: Number, required: true },
  occupied_slots: [OccupationSchema]
});

// Define operating hours range
const OperatingHoursSchema = new Schema({
    start_hour: { type: Number, required: true },
    end_hour: { type: Number, required: true }
});

const FieldSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: 'FieldOwner', required: true },
  name: { type: String, required: true },
  description: { type: String, default: 'Không có mô tả' },
  address: { type: String, required: true },
  base_price: { type: Number, required: true },
  image_url: { type: String },
  status: { type: Boolean, default: true },
  total_grounds: { type: Number, required: true },
  grounds: [GroundSchema],
  services: [ServiceSchema],
  operating_hours: {
    type: [OperatingHoursSchema],
    required: true,
    validate: {
        validator: function(hours) {
            return hours && hours.length > 0;
        },
        message: 'At least one operating hours range is required'
    }
  },
  service_times: {
    type: [DailyScheduleSchema],
    default: function() {
        // Use the operating hours to generate time slots
        const generateTimeSlots = (startHour, endHour) => {
            const slots = [];
            for (let hour = startHour; hour < endHour; hour += 2) {
                slots.push({
                    start_time: `${hour.toString().padStart(2, '0')}:00`,
                    end_time: `${(hour + 2).toString().padStart(2, '0')}:00`,
                    is_available: true
                });
            }
            return slots;
        };

        // Get operating hours from the field
        const hours = this.operating_hours[0] || { start_hour: 7, end_hour: 23 };

        // Generate schedule for each day
        return [0, 1, 2, 3, 4, 5, 6].map(day => ({
            day_of_week: day,
            time_slots: generateTimeSlots(hours.start_hour, hours.end_hour)
        }));
    }
  }
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
    ]
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
    ]
  });
*/

export const Field =  mongoose.model("Field", FieldSchema)