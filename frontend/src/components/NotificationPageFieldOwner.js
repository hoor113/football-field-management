import React, { useEffect, useState } from 'react';
import '../styles/NotificationPageFieldOwner.css';

const NotificationPageFieldOwner = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/field_owner/noti');
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            const data = await response.json();
            setNotifications(data.notifications);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (bookingId, notificationId) => {
        try {
            const response = await fetch(`/api/field_owner/accept/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                // Update isRead status for the accepted notification
                await fetch(`/api/field_owner/notification/read/${notificationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Remove all notifications for the same time slot (both accepted and rejected)
                setNotifications(prevNotifications => {
                    const acceptedBooking = prevNotifications.find(
                        notif => notif.bookingDetails._id === bookingId
                    );
                    
                    if (!acceptedBooking) return prevNotifications;

                    return prevNotifications.filter(notif => 
                        // Keep notifications that don't match the time slot
                        notif.bookingDetails.start_time !== acceptedBooking.bookingDetails.start_time ||
                        // Or are for a different ground
                        notif.bookingDetails.ground_id !== acceptedBooking.bookingDetails.ground_id
                    );
                });

                // Optionally refresh all notifications to ensure consistency
                fetchNotifications();
                window.location.reload();
            }
        } catch (error) {
            console.error('Error accepting booking:', error);
        }
    };

    const handleDecline = async (bookingId, notificationId) => {
        try {
            const response = await fetch(`/api/field_owner/cancel/${bookingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (data.success) {
                // Update isRead status using the correct endpoint
                await fetch(`/api/field_owner/notification/read/${notificationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Remove the notification from the list after declining
                setNotifications(prevNotifications => 
                    prevNotifications.filter(notif => notif.bookingDetails._id !== bookingId)
                );
                window.location.reload();
            }
        } catch (error) {
            console.error('Error declining booking:', error);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatPrice = (price) => {
        // Kiểm tra nếu price là Decimal128 từ MongoDB
        if (price && price.$numberDecimal) {
            price = parseFloat(price.$numberDecimal);
        }
        return parseFloat(price).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
        });
    };

    const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Confirm Booking</h2>
                    <p>Are you sure you want to accept this booking?</p>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="confirm-btn">Yes, Accept</button>
                        <button onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleAcceptClick = (booking, notificationId) => {
        setSelectedBooking({ bookingId: booking, notificationId });
        setShowConfirmModal(true);
    };

    const handleConfirmAccept = async () => {
        if (selectedBooking) {
            await handleAccept(selectedBooking.bookingId, selectedBooking.notificationId);
            setShowConfirmModal(false);
            setSelectedBooking(null);
        }
    };

    const handleDeclineClick = (booking, notificationId) => {
        setSelectedBooking({ bookingId: booking, notificationId });
        setShowDeclineModal(true);
    };

    const handleConfirmDecline = async () => {
        if (selectedBooking) {
            await handleDecline(selectedBooking.bookingId, selectedBooking.notificationId);
            setShowDeclineModal(false);
            setSelectedBooking(null);
        }
    };

    const DeclineModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Confirm Decline</h2>
                    <p>Are you sure you want to decline this booking?</p>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="confirm-btn">Yes, Decline</button>
                        <button onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <div className="loading">Loading notifications...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="notification-page">
            <h1>Pending Booking Requests</h1>
            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <p className="no-notifications">No pending bookings</p>
                ) : (
                    notifications.map(notification => (
                        <div key={notification._id} className="notification-box">
                            <div className="notification-grid">
                                {/* Customer Information */}
                                <div className="customer-info">
                                    <h3>Customer Details</h3>
                                    <div className="info-content">
                                        <p><i className="fas fa-user"></i> <strong>Name:</strong> {notification.customerDetails.fullname}</p>
                                        <p><i className="fas fa-envelope"></i> <strong>Email:</strong> {notification.customerDetails.email}</p>
                                        <p><i className="fas fa-phone"></i> <strong>Phone:</strong> {notification.customerDetails.phone_no}</p>
                                    </div>
                                </div>

                                {/* Booking Details */}
                                <div className="booking-details">
                                    <h3>Booking Details</h3>
                                    <div className="info-content">
                                        <p><i className="fas fa-bookmark"></i> <strong>Booking ID:</strong> {notification.bookingDetails._id}</p>
                                        <p><i className="fas fa-clock"></i> <strong>Start Time:</strong> {formatDateTime(notification.bookingDetails.start_time)}</p>
                                        <p><i className="fas fa-clock"></i> <strong>End Time:</strong> {formatDateTime(notification.bookingDetails.end_time)}</p>
                                        <p>
                                            <i className="fas fa-map-marker-alt"></i> 
                                            <strong>Ground:</strong> 
                                            {notification.bookingDetails.ground ? 
                                                `${notification.bookingDetails.field_name} - ${notification.bookingDetails.ground.name} (Sân ${notification.bookingDetails.ground.number})` : 
                                                `${notification.bookingDetails.field_name} - Unknown Ground`
                                            }
                                        </p>
                                        <p><i className="fas fa-money-bill-wave"></i> <strong>Total Price:</strong> {formatPrice(notification.bookingDetails.price)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Services */}
                            {notification.bookingDetails.services?.length > 0 && (
                                <div className="services-section">
                                    <h4><i className="fas fa-concierge-bell"></i> Additional Services:</h4>
                                    <div className="services-grid">
                                        {notification.bookingDetails.services.map(service => (
                                            <div key={service._id} className="service-item">
                                                <span className="service-name">{service.name}</span>
                                                <span className="service-price">
                                                    {formatPrice(service.price)} x {service.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="notification-actions">
                                <button 
                                    onClick={() => handleAcceptClick(notification.bookingDetails._id, notification.id)} 
                                    className="accept-btn"
                                >
                                    <i className="fas fa-check"></i> Accept Booking
                                </button>
                                <button 
                                    onClick={() => handleDeclineClick(notification.bookingDetails._id, notification.id)} 
                                    className="decline-btn"
                                >
                                    <i className="fas fa-times"></i> Decline Booking
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmAccept}
            />
            
            <DeclineModal 
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                onConfirm={handleConfirmDecline}
            />
        </div>
    );
};

export default NotificationPageFieldOwner;
