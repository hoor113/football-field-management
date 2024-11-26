import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import { Booking } from "../models/booking.model.js";
import { Field } from "../models/field.model.js";
export const makeBooking = async (req, res) => {
    const { field_id, ground_id, start_time, end_time, services } = req.body;
    if (!(field_id && ground_id && start_time && end_time)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }
    try {
        const customer_id = req.user.id
        
        const booking = await Booking.create({ customer_id, field_id, ground_id, start_time, end_time, services });
        res.status(200).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

