import mongoose from "mongoose"
import { Field } from "#backend/models/field.model.js"
import { FieldOwner } from "#backend/models/field-owner.model.js";
import { Booking } from '#backend/models/booking.model.js';
import { Notification } from '#backend/models/notification.model.js'; // Import the Notification model


//owner/field
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
            message: "Vui lòng cung cấp tất cả các thông tin bắt buộc, bao gồm giờ đá"
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

        return res.status(201).json({ success: true, message: "Sân đã được tạo thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Có lỗi xảy ra", error: error.message });
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
                message: "Sân không tồn tại hoặc bạn không có quyền"
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
        //                 message: "Không thể xóa sân đang có lịch đặt"
        //             });
        //         }

        //         updatedField.grounds = groundsToKeep;
        //     }
        //     await updatedField.save();
        // }

        return res.status(200).json({
            success: true,
            message: "Cập nhật sân thành công",
            field: updatedField
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra",
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
                message: "Chủ sân không tồn tại"
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
            message: "Lấy thông tin sân thất bại",
            error: error.message
        });
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
            return res.status(400).json({ message: "ID sân không hợp lệ" });
        }
        // Find the field to ensure it belongs to the owner
        const field = await Field.findOne({ _id: fieldId, owner_id: ownerId });

        if (!field) {
            console.log('Field not found or unauthorized');
            return res.status(404).json({
                success: false,
                message: "Sân không tồn tại hoặc bạn không có quyền xóa sân"
            });
        }

        // Remove the field
        await Field.findByIdAndDelete(fieldId);

        // Update the FieldOwner to remove the field reference
        await FieldOwner.findByIdAndUpdate(ownerId, { $pull: { fields: fieldId } });

        return res.status(200).json({
            success: true,
            message: "Sân đã được xóa thành công"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xóa sân",
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
                message: "Sân không tồn tại hoặc bạn không có quyền sửa đổi sân"
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
            message: "Thông tin sân đã được cập nhật thành công",
            field: updatedField
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi cập nhật thông tin sân",
            error: error.message
        });
    }
};