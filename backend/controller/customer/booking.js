import { Customer } from "#backend/models/customer.model.js";
import jwt from "jsonwebtoken";
import { Booking } from "#backend/models/booking.model.js";
import { Field } from "#backend/models/field.model.js";
import { Notification } from '#backend/models/notification.model.js';
import { Rating } from "#backend/models/rating.model.js";

//customer/book
// Helper function to check if a time slot is currently available
const isTimeSlotAvailable = (ground, startTime) => {
    const currentTime = new Date();
    const startDateTime = new Date(startTime);
    const currentTimestamp = Date.now(); // Get current time in milliseconds
    const startTimestamp = new Date(startTime).getTime(); // Convert start time to milliseconds
    // console.log('Start timestamp:', startTimestamp);
    // console.log('Current timestamp:', currentTimestamp);

    // Check if the start time is in the past
    if (startTimestamp < currentTimestamp) {
        return false; // Cannot book in the past
    }

    // Check if the slot overlaps with any occupied slots
    return !ground.occupied_slots.some(slot => {
        const slotStartDateTime = new Date(slot.start_time);
        // Check for overlap
        return startDateTime.getTime() === slotStartDateTime.getTime();

    });
};

export const makeBooking = async (req, res) => {
    const { field_id, ground_id, start_time, end_time, price, services, booking_date } = req.body;

    if (!(field_id && ground_id && start_time && end_time && booking_date)) {
        return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin" });
    }

    try {
        const field = await Field.findById(field_id);
        if (!field) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sân" });
        }

        const ground = field.grounds.id(ground_id);
        if (!ground) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sân con" });
        }

        // Check if the time slot is available
        if (!isTimeSlotAvailable(ground, start_time)) {
            return res.status(400).json({
                success: false,
                message: "Khung giờ này không khả dụng. Bạn đang đặt sân trong quá khứ hoặc khung giờ đã được đặt."
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
            price,
            services
        });

        await field.save();

        res.status(200).json({
            success: true,
            message: 'Đặt sân thành công',
            bookingId: booking._id,
            start_time: start_time,
            end_time: end_time
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi máy chủ',
            error: error.message
        });
    }
};

export const getBookings = async (req, res) => {
    const customer_id = req.user.id
    const bookings = await Booking.find({ customer_id });
    res.status(200).json({ bookings });
}