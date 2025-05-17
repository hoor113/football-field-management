//customer/notification
export const sendNotification = async (req, res) => {
    const { recipient_id, message, booking_id, type } = req.body;
    const notification = await Notification.create({
        ownerId: recipient_id,
        message: message,
        bookingId: booking_id,
        type: type
    });
    res.status(200).json({ success: true, notification });
}

export const getResponseNoti = async (req, res) => {
    try {
        // 1. Get the field owner's ID from the authenticated request
        const customerId = req.user.id;

        const notifications = await Notification.find({
            customerId: customerId
        })
            .populate({
                path: 'bookingId',
                select: 'field_id booking_time status',
                populate: {
                    path: 'field_id',
                    select: 'name address'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            notifications: notifications.map(notification => ({
                id: notification._id,
                message: notification.message,
                bookingDetails: notification.bookingId,
                createdAt: notification.createdAt,
                isRead: notification.isRead,
                type: notification.type
            }))
        });

    } catch (error) {
        console.error('Lỗi khi lấy thông báo của khách hàng:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông báo',
            error: error.message
        });
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const customerId = req.user.id;

        await Notification.updateMany(
            { customerId: customerId }, 
            { $set: { isRead: true } }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Đã đánh dấu tất cả thông báo là đã đọc' 
        });
    } catch (error) {
        console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi đánh dấu thông báo đã đọc', 
            error: error.message 
        });
    }
};