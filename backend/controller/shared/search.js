import { Customer } from "#backend/models/customer.model.js";
import jwt from "jsonwebtoken";
import { Booking } from "#backend/models/booking.model.js";
import { Field } from "#backend/models/field.model.js";
import { Notification } from '#backend/models/notification.model.js';
import { Rating } from "#backend/models/rating.model.js";

//common/search
export const getRecommendedFields = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        const fields = await Field.find()
            .populate('owner_id', 'fullname email')
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
            message: 'Lỗi khi tìm kiếm sân',
            error: error.message
        });
    }
}

// Function to search fields by name or location
export const HPsearchFields = async (req, res) => {
    try {
        const { name, address } = req.query;

        // Build the query object
        const query = {};
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }
        if (address) {
            query.address = { $regex: address, $options: 'i' }; // Case-insensitive search
        }

        // Find fields matching the query
        const fields = await Field.find(query);
        res.status(200).json({ success: true, fields });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sân:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi tìm kiếm sân', 
            error: error.message 
        });
    }
};