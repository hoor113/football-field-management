import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'FieldOwner'},
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['request', 'success', 'failed'], default: 'request' }
});

export const Notification = mongoose.model("Notification", NotificationSchema); 