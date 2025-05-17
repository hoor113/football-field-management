import { Customer } from "#backend/models/customer.model.js";
import jwt from "jsonwebtoken";
import { Booking } from "#backend/models/booking.model.js";
import { Field } from "#backend/models/field.model.js";
import { Notification } from '#backend/models/notification.model.js';
import { Rating } from "#backend/models/rating.model.js";


//customer/rating
export const submitRating = async (req, res) => {
    const { rating, comment, field_id } = req.body;
    const customer_id = req.user.id;

    try {
        const newRating = new Rating({
            customer_id,
            field_id,
            stars: rating,
            comment,
        });

        await newRating.save();

        res.status(201).json({ success: true, message: 'Gửi đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi gửi đánh giá', 
            error: error.message 
        });
    }
};

export const getFieldRatings = async (req, res) => {
    const { fieldId } = req.params;

    try {
        const ratings = await Rating.find({ field_id: fieldId }).populate('customer_id');

        res.status(200).json({ success: true, ratings });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi lấy đánh giá', 
            error: error.message 
        });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const ratings = await Rating.find({ field_id: fieldId });
        
        if (ratings.length === 0) {
            return res.json({ averageRating: 0 });
        }

        const averageRating = ratings.reduce((acc, curr) => acc + curr.stars, 0) / ratings.length;
        res.json({ averageRating });
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy điểm đánh giá trung bình', 
            error: error.message 
        });
    }
};
