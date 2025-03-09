import mongoose from "mongoose"
import { Field } from "#backend/models/field.model.js"
import { FieldOwner } from "#backend/models/field-owner.model.js";
import { Booking } from '#backend/models/booking.model.js';
import { Notification } from '#backend/models/notification.model.js'; // Import the Notification model


//owner/notification
export const getBookingNoti = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const fieldOwner = await FieldOwner.findById(ownerId)
            .select('fields')
            .populate('fields');

        if (!fieldOwner) {
            return res.status(404).json({
                success: false,
                message: 'Chủ sân không tồn tại'
            });
        }

        const fieldIds = fieldOwner.fields.map(field => field._id);

        const bookings = await Booking.find({
            field_id: { $in: fieldIds }
        })
        .populate('customer_id', 'fullname email phone_no')
        .populate('field_id')
        .sort({ order_time: -1 });

        const notifications = await Notification.find({
            ownerId: ownerId,
            bookingId: { $in: bookings.map(booking => booking._id) },
            isRead: false
        }).sort({ createdAt: -1 });

        const notificationsWithDetails = notifications.map(notification => {
            const booking = bookings.find(b => b._id.toString() === notification.bookingId.toString());
            if (!booking) return null;

            // Find the specific ground from the field's grounds array
            const ground = booking.field_id.grounds.find(g => 
                g._id.toString() === booking.ground_id.toString()
            );

            return {
                id: notification._id,
                message: notification.message,
                bookingDetails: {
                    ...booking.toObject(),
                    ground: ground ? {
                        id: ground._id,
                        name: ground.name,
                        number: ground.ground_number
                    } : null,
                    field_name: booking.field_id.name
                },
                customerDetails: booking.customer_id,
                createdAt: notification.createdAt
            };
        }).filter(Boolean); // Remove any null values

        res.status(200).json({
            success: true,
            notifications: notificationsWithDetails
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Lấy thông báo thất bại',
            error: error.message
        });
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const ownerId = req.user.id;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, ownerId: ownerId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Thông báo không tồn tại'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Thông báo đã được đánh dấu là đã đọc',
            notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi đánh dấu thông báo là đã đọc',
            error: error.message
        });
    }
};