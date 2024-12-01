import { Customer } from "../models/customer.model.js";
import jwt from "jsonwebtoken";
import { Booking } from "../models/booking.model.js";
import { Field } from "../models/field.model.js";

// Helper function to check if a time slot is currently available
const isTimeSlotAvailable = (ground, startTime, endTime) => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const startHour = parseInt(startTime.split(':')[0]);

    // Don't allow booking past times
    if (startHour < currentHour) {
        return false;
    }

    // Check if the slot overlaps with any occupied slots
    return !ground.occupied_slots.some(slot => {
        if (slot.status === 'occupied') {
            const slotStartHour = parseInt(slot.start_time.split(':')[0]);
            const slotEndHour = parseInt(slot.end_time.split(':')[0]);
            
            // Check for overlap
            return (startHour < slotEndHour && endTime > slotStartHour);
        }
        return false;
    });
};

export const makeBooking = async (req, res) => {
    const { field_id, ground_id, start_time, end_time, services } = req.body;
    
    if (!(field_id && ground_id && start_time && end_time)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ success: false, message: "Field not found" });
        }

        const ground = field.grounds.id(ground_id);
        if (!ground) {
            return res.status(404).json({ success: false, message: "Ground not found" });
        }

        // Check if the time slot is available
        if (!isTimeSlotAvailable(ground, start_time, end_time)) {
            return res.status(400).json({ 
                success: false, 
                message: "This time slot is not available" 
            });
        }

        const customer_id = req.user.id;
        
        // Create the booking
        const booking = await Booking.create({ 
            customer_id, 
            field_id, 
            ground_id, 
            start_time, 
            end_time, 
            services 
        });

        // Update ground occupation
        ground.occupied_slots.push({
            date: new Date(),
            start_time,
            end_time,
            booking_id: booking._id,
            customer_id,
            status: 'occupied'
        });

        await field.save();

        res.status(200).json({ 
            success: true,
            message: 'Booking created successfully', 
            booking 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};

export const getBookings = async (req, res) => {
    const customer_id = req.user.id
    const bookings = await Booking.findAll({ where: { customer_id } });
    res.status(200).json({ bookings });
}

export const getRecommendedFields = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const fields = await Field.find()
            .limit(limit);
        res.status(200).json({ success: true, fields });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching fields', error: error.message });
    }
}

export const SearchFields = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const fields = await Field.find({ 
            name: { 
                $regex: searchTerm, 
                $options: 'i' 
            } 
        });
        
        res.status(200).json({ 
            success: true, 
            fields 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error searching fields', 
            error: error.message 
        });
    }
}

