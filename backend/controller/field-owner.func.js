import mongoose from "mongoose"
import { Field } from "../models/field.model.js"
import { FieldOwner } from "../models/field-owner.model.js";
import { Booking } from '../models/booking.model.js';
import { Notification } from '../models/notification.model.js'; // Import the Notification model
export const UploadField = async (req, res) => {
    const {
        name,
        address,
        base_price,
        image_url,
        total_grounds,
        description,
        operating_hours
    } = req.body;
    if (!(name && address && base_price && image_url && total_grounds && operating_hours?.length)) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields including operating hours"
        });
    }

    try {
        const owner_id = req.user.id

        // Generate grounds array
        const grounds = Array.from({ length: total_grounds }, (_, index) => ({
            ground_number: index + 1,
            name: `Ground ${index + 1}`,
            status: true,
            size: '7', // Default size
            material: 'Grass', // Default material
            price: base_price // Using base_price as default
        }));

        const NewField = new Field({
            owner_id,
            name,
            description,
            address,
            base_price,
            image_url,
            total_grounds,
            grounds,
            operating_hours
        });

        const fieldId = await NewField.save()
        await FieldOwner.findByIdAndUpdate(owner_id, { $push: { fields: fieldId._id } })

        return res.status(201).json({ success: true, message: "Field created successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
}


export const UploadService = async (req, res) => {
    const { fieldId, name, type, price } = req.body;
    if (!(fieldId || name || type || price)) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const field = await Field.findById(fieldId)
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }
        field.services.push({ name, type, price })
        await field.save()
        res.status(200).json({ message: 'Service added successfully', field });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const UpdateField = async (req, res) => {
    const { field_id } = req.params;
    const { name, description, address, base_price, image_url, total_grounds } = req.body;

    try {
        // Check if field exists and belongs to the owner
        const field = await Field.findOne({
            _id: field_id,
            owner_id: req.user.id
        });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found or you don't have permission"
            });
        }

        // Update field info
        const updatedField = await Field.findByIdAndUpdate(
            field_id,
            {
                $set: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(address && { address }),
                    ...(base_price && { base_price }),
                    ...(image_url && { image_url }),
                    ...(total_grounds && { total_grounds })
                }
            },
            { new: true }
        );

        // Handle ground updates when total_grounds changes
        // if (total_grounds && total_grounds !== field.grounds.length) {
        //     if (total_grounds > field.grounds.length) {
        //         // Add new grounds
        //         const additionalGrounds = Array.from(
        //             { length: total_grounds - field.grounds.length }, 
        //             (_, index) => ({
        //                 ground_number: field.grounds.length + index + 1,
        //                 name: `Ground ${field.grounds.length + index + 1}`,
        //                 status: true,
        //                 size: '7',
        //                 material: 'Grass',
        //                 price: base_price || field.base_price
        //             })
        //         );
        //         updatedField.grounds = [...field.grounds, ...additionalGrounds];
        //     } else {
        //         // Remove excess grounds
        //         // Only remove grounds that don't have active bookings
        //         const groundsToKeep = field.grounds.slice(0, total_grounds);

        //         // Verify no active bookings for grounds being removed
        //         const removedGrounds = field.grounds.slice(total_grounds);
        //         const hasActiveBookings = removedGrounds.some(ground => !ground.status);

        //         if (hasActiveBookings) {
        //             return res.status(400).json({
        //                 success: false,
        //                 message: "Cannot remove grounds with active bookings"
        //             });
        //         }

        //         updatedField.grounds = groundsToKeep;
        //     }
        //     await updatedField.save();
        // }

        return res.status(200).json({
            success: true,
            message: "Field updated successfully",
            field: updatedField
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred",
            error: error.message
        });
    }
};

export const GetFields = async (req, res) => {
    try {
        console.log('Fetching fields for user ID:', req.user.id);

        // Find the field owner and populate the fields array
        const fieldOwner = await FieldOwner.findById(req.user.id)
            .populate({
                path: 'fields',
                // populate: {
                //     path: 'services' // If you want to populate services as well
                // }
            });

        if (!fieldOwner) {
            return res.status(404).json({
                success: false,
                message: "Field owner not found"
            });
        }

        console.log('Found fields:', fieldOwner.fields);

        return res.status(200).json({
            success: true,
            fields: fieldOwner.fields
        });
    } catch (error) {
        console.error('Get Fields Error:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching fields",
            error: error.message
        });
    }
};

export const getBookingNoti = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const fieldOwner = await FieldOwner.findById(ownerId)
            .select('fields')
            .populate('fields');

        if (!fieldOwner) {
            return res.status(404).json({
                success: false,
                message: 'Field owner not found'
            });
        }

        const fieldIds = fieldOwner.fields.map(field => field._id);

        const bookings = await Booking.find({
            field_id: { $in: fieldIds }
        }).sort({ order_time: -1 });

        const notifications = await Notification.find({
            ownerId: ownerId,
            bookingId: { $in: bookings.map(booking => booking._id) },
            isRead: false
        })
            .populate({
                path: 'bookingId',
                populate: [
                    {
                        path: 'customer_id',
                        select: 'fullname email phone_no'
                    },
                    {
                        path: 'field_id',
                        select: 'name grounds'
                    }
                ]
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications: notifications.map(notification => {
                const booking = notification.bookingId;
                // Tìm ground trong danh sách grounds của field
                const ground = booking.field_id?.grounds?.find(g => 
                    g._id.toString() === booking.ground_id.toString()
                );
                
                // Tạo tên ground dựa trên thông tin có sẵn
                const groundInfo = ground ? 
                    `${ground.name} (Ground ${ground.ground_number})` : 
                    `Ground ${booking.ground_id}`;

                return {
                    id: notification._id,
                    message: notification.message,
                    bookingDetails: {
                        ...booking.toObject(),
                        ground_name: groundInfo,
                        field_name: booking.field_id?.name || 'Unknown Field'
                    },
                    customerDetails: booking.customer_id,
                    createdAt: notification.createdAt
                };
            })
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
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
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

export const acceptBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        // Find booking and verify it exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update booking status to accepted
        booking.status = 'confirmed';

        // Find field and populate grounds
        const field = await Field.findById(booking.field_id);
        if (!field) {
            return res.status(404).json({ success: false, message: 'Field not found' });
        }

        // Find the specific ground
        const ground = field.grounds.find(ground => 
            ground._id.toString() === booking.ground_id.toString()
        );
        
        if (!ground) {
            return res.status(404).json({ 
                success: false, 
                message: 'Ground not found in this field' 
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

        // Save both booking and field
        await Promise.all([
            booking.save(),
            field.save()
        ]);

        // Create notification for customer
        await Notification.create({
            customerId: booking.customer_id,
            bookingId: booking._id,
            message: 'Your booking has been accepted.',
            isRead: false,
            type: 'success'
        });

        res.status(200).json({ 
            success: true, 
            message: 'Booking accepted', 
            booking 
        });

    } catch (error) {
        console.error('Error accepting booking:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error', 
            error: error.message 
        });
    }
};

export const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update booking status to canceled
        booking.status = 'cancelled';
        await booking.save();

        // Create a notification for the customer
        await Notification.create({
            customerId: booking.customer_id,
            bookingId: booking._id,
            message: 'Your booking has been declined.',
            isRead: false,
            type: 'failed'
        });

        res.status(200).json({ success: true, message: 'Booking canceled', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
export const getFieldDetails = async (req, res) => {
    try {
        const fieldOwnerId = req.user.id; // Giả sử ID người dùng có sẵn trong req.user

        // Tìm chủ sân và lấy thông tin chi tiết của các sân
        const fieldOwner = await FieldOwner.findById(fieldOwnerId).populate('fields');
        if (!fieldOwner) {
            return res.status(404).json({ message: 'Không tìm thấy chủ sân' });
        }

        res.json({ fields: fieldOwner.fields });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sân:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin sân' });
    }
};

export const deleteField = async (req, res) => {
    const { fieldId } = req.params;
    const ownerId = req.user.id;
    try {
        if (!mongoose.Types.ObjectId.isValid(fieldId)) {
            return res.status(400).json({ message: "Invalid field ID" });
        }
        // Find the field to ensure it belongs to the owner
        const field = await Field.findOne({ _id: fieldId, owner_id: ownerId });

        if (!field) {
            console.log('Field not found or unauthorized');
            return res.status(404).json({
                success: false,
                message: "Field not found or you don't have permission to delete it"
            });
        }

        // Remove the field
        await Field.findByIdAndDelete(fieldId);

        // Update the FieldOwner to remove the field reference
        await FieldOwner.findByIdAndUpdate(ownerId, { $pull: { fields: fieldId } });

        return res.status(200).json({
            success: true,
            message: "Field deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the field",
            error: error.message
        });
    }
};

export const editFieldAttributes = async (req, res) => {
    const { fieldId } = req.params;
    const { name, description, address, base_price, image_url, total_grounds, operating_hours } = req.body;
    const ownerId = req.user.id;

    try {
        // Kiểm tra xem sân có tồn tại và thuộc về chủ sở hữu không
        const field = await Field.findOne({ _id: fieldId, owner_id: ownerId });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Field not found or you don't have permission to edit it"
            });
        }

        // Cập nhật thông tin sân
        const updatedField = await Field.findByIdAndUpdate(
            fieldId,
            {
                $set: {
                    ...(name && { name }),
                    ...(description && { description }),
                    ...(address && { address }),
                    ...(base_price && { base_price }),
                    ...(image_url && { image_url }),
                    ...(total_grounds && { total_grounds }),
                    ...(operating_hours && { operating_hours })
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Field attributes updated successfully",
            field: updatedField
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating field attributes",
            error: error.message
        });
    }
};

