import mongoose from "mongoose"
import { Field } from "#backend/models/field.model.js"
import { FieldOwner } from "#backend/models/field-owner.model.js";
import { Booking } from '#backend/models/booking.model.js';
import { Notification } from '#backend/models/notification.model.js'; // Import the Notification model


//onwer/booking
export const acceptBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find booking and verify its existence
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ 
                success: false, 
                message: 'Yêu cầu đặt sân không tồn tại' 
            });
        }

        // Find overlapping bookings (same start time)
        const overlappingBookings = await Booking.find({
            field_id: booking.field_id,
            ground_id: booking.ground_id,
            start_time: booking.start_time,
            _id: { $ne: bookingId }, // Exclude the current booking
            status: 'pending' // Only consider pending bookings
        });

        console.log(overlappingBookings)
        // Find field and populate grounds
        const field = await Field.findById(booking.field_id);
        if (!field) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sân không tồn tại' 
            });
        }

        // Find the specific ground
        const ground = field.grounds.find(g => 
            g._id.toString() === booking.ground_id.toString()
        );
        
        if (!ground) {
            return res.status(404).json({ 
                success: false, 
                message: 'Không tồn tại sân này trong hệ thống' 
            });
        }

        // Add the occupied slot
        ground.occupied_slots.push({
            date: new Date(),
            start_time: booking.start_time,
            end_time: booking.end_time,
            booking_id: booking._id,
            customer_id: booking.customer_id,
        });

        // Update accepted booking status and save changes
        booking.status = 'confirmed';
        await Promise.all([
            booking.save(),
            field.save()
        ]);

        // Create success notification for the accepted booking
        await Notification.create({
            customerId: booking.customer_id,
            bookingId: booking._id,
            message: 'Yêu cầu đặt sân của bạn đã được chấp nhận.',
            isRead: false,
            type: 'success'
        });

        // Handle overlapping bookings
        const rejectPromises = overlappingBookings.map(async (overlappingBooking) => {
            // Skip if it's the same customer
            if (overlappingBooking.customer_id.toString() === booking.customer_id.toString()) {
                return;
            }

            try {
                // Update booking status to cancelled
                overlappingBooking.status = 'cancelled';
                await overlappingBooking.save();

                // Create rejection notification
                await Notification.create({
                    customerId: overlappingBooking.customer_id,
                    bookingId: overlappingBooking._id,
                    message: 'Yêu cầu đặt sân của bạn đã bị từ chối do bị trùng thời gian.',
                    isRead: false,
                    type: 'failed'
                });
            } catch (error) {
                console.error('Error rejecting overlapping booking:', error);
                throw error; // Re-throw to be caught by the main try-catch
            }
        });

        // Wait for all rejection operations to complete
        await Promise.all(rejectPromises);

        res.status(200).json({ 
            success: true, 
            message: 'Yêu cầu đặt sân đã được chấp nhận', 
            booking 
        });

    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Có lỗi x��y ra', 
            error: error.message 
        });
    }
};

export const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Yêu cầu đặt sân không tồn tại' });
        }

        // Update booking status to canceled
        booking.status = 'cancelled';
        await booking.save();

        // Create a notification for the customer
        await Notification.create({
            customerId: booking.customer_id,
            bookingId: booking._id,
            message: 'Yêu cầu đặt sân của bạn đã bị từ chối.',
            isRead: false,
            type: 'failed'
        });

        res.status(200).json({ success: true, message: 'Đã hủy lịch đặt sân', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi máy chủ', error: error.message });
    }
};
