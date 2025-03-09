import mongoose from "mongoose"
import { Field } from "#backend/models/field.model.js"
import { FieldOwner } from "#backend/models/field-owner.model.js";
import { Booking } from '#backend/models/booking.model.js';
import { Notification } from '#backend/models/notification.model.js'; // Import the Notification model


//owner/service
export const UploadServiceType = async (req, res) => {
    const { fieldId, sv1, sv2, sv3 } = req.body;
    if (!(fieldId && sv1 && sv2 && sv3)) {
        return res.status(400).json({ 
            success: false, 
            message: "Vui lòng cung cấp đầy đủ thông tin loại dịch vụ" 
        });
    }

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ 
                success: false, 
                message: 'Sân không tồn tại' 
            });
        }

        field.service_types = { sv1, sv2, sv3 };
        await field.save();

        res.status(200).json({ 
            success: true, 
            message: 'Cập nhật loại dịch vụ thành công', 
            field 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Có lỗi xảy ra', 
            error: error.message 
        });
    }
};

export const UploadService = async (req, res) => {
    const { fieldId, name, type, price } = req.body;
    if (!(fieldId || name || type || price)) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp đầy đủ thông tin đặt sân" });
    }

    try {
        const field = await Field.findById(fieldId)
        if (!field) {
            return res.status(404).json({ message: 'Sân không tồn tại' });
        }
        field.services.push({ name, type, price })
        await field.save()
        res.status(200).json({ message: 'Thêm dịch vụ thành công', field });
    } catch (error) {
        res.status(500).json({ message: 'Có lỗi xảy ra', error: error.message });
    }
}

export const updateRecommendedServices = async (req, res) => {
    try {
        const { fieldId } = req.params;
        const { serviceIds } = req.body; // Array of service IDs [id1, id2, id3]
        
        // Validate input
        if (!Array.isArray(serviceIds)) {
            return res.status(400).json({
                success: false,
                message: 'ServiceIds phải là một mảng'
            });
        }

        if (serviceIds.length > 3) {
            return res.status(400).json({
                success: false,
                message: 'Chỉ được phép tối đa 3 dịch vụ được đề xuất'
            });
        }

        // Find the field
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sân'
            });
        }

        // Verify field owner
        if (field.owner_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền chỉnh sửa sân này'
            });
        }

        // Verify that all serviceIds exist in the field's services
        const validServiceIds = serviceIds.every(serviceId => 
            field.services.some(service => service._id.toString() === serviceId)
        );

        if (!validServiceIds) {
            return res.status(400).json({
                success: false,
                message: 'Một hoặc nhiều ID dịch vụ không hợp lệ'
            });
        }

        // Create recommended services array from the selected services
        const recommendedServices = serviceIds.map(serviceId => {
            const service = field.services.find(s => s._id.toString() === serviceId);
            return {
                name: service.name,
                price: service.price,
                type: service.type
            };
        });

        // Update the field
        field.recommended_services = recommendedServices;
        await field.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật dịch vụ đề xuất thành công',
            recommended_services: field.recommended_services
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật dịch vụ đề xuất:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật dịch vụ đề xuất',
            error: error.message
        });
    }
};

export const deleteService = async (req, res) => {
    const { fieldId, serviceId } = req.params;
    const ownerId = req.user.id;

    try {
        const field = await Field.findOne({ _id: fieldId, owner_id: ownerId });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Sân không tồn tại hoặc bạn không có quyền"
            });
        }

        // Remove the service
        field.services = field.services.filter(
            service => service._id.toString() !== serviceId
        );

        // Also remove from recommended services if present
        field.recommended_services = field.recommended_services.filter(
            service => service._id.toString() !== serviceId
        );

        await field.save();

        return res.status(200).json({
            success: true,
            message: "Dịch vụ đã được xóa thành công"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi xóa dịch vụ",
            error: error.message
        });
    }
};

export const editService = async (req, res) => {
    const { fieldId, serviceId } = req.params;
    const { name, type, price, image_url } = req.body;
    const ownerId = req.user.id;

    try {
        const field = await Field.findOne({ _id: fieldId, owner_id: ownerId });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: "Sân không tồn tại hoặc bạn không có quyền"
            });
        }

        const serviceIndex = field.services.findIndex(
            service => service._id.toString() === serviceId
        );

        if (serviceIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Dịch vụ không tồn tại"
            });
        }

        // Update service
        field.services[serviceIndex] = {
            ...field.services[serviceIndex],
            name: name || field.services[serviceIndex].name,
            type: type || field.services[serviceIndex].type,
            price: price || field.services[serviceIndex].price,
            image_url: image_url || field.services[serviceIndex].image_url // Preserve existing image_url if not updated
        };

        await field.save();

        return res.status(200).json({
            success: true,
            message: "Dịch vụ đã được cập nhật thành công",
            service: field.services[serviceIndex]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Có lỗi xảy ra khi cập nhật dịch vụ",
            error: error.message
        });
    }
};