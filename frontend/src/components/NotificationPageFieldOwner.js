import React, { useEffect, useState } from 'react';
import '../styles/NotificationPage.css';

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
                // Update isRead status using the correct endpoint
                await fetch(`/api/field_owner/notification/read/${notificationId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // Remove the notification from the list after accepting
                setNotifications(prevNotifications => 
                    prevNotifications.filter(notif => notif.bookingDetails._id !== bookingId)
                );
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
            }
        } catch (error) {
            console.error('Error declining booking:', error);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const formatPrice = (price) => {
        return parseFloat(price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
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
                            {/* Customer Information */}
                            <div className="customer-info">
                                <h3>Customer Details</h3>
                                <p><strong>Name:</strong> {notification.customerDetails.fullname}</p>
                                <p><strong>Email:</strong> {notification.customerDetails.email}</p>
                                <p><strong>Phone:</strong> {notification.customerDetails.phone_no}</p>
                            </div>

                            {/* Booking Details */}
                            <div className="booking-details">
                                <h3>Booking Details</h3>
                                <p><strong>Booking ID:</strong> {notification.bookingDetails._id}</p>
                                <p><strong>Start Time:</strong> {formatDateTime(notification.bookingDetails.start_time)}</p>
                                <p><strong>End Time:</strong> {formatDateTime(notification.bookingDetails.end_time)}</p>
                                <p><strong>Ground:</strong> Ground {notification.bookingDetails.ground_id}</p>
                                <p><strong>Total Price:</strong> {formatPrice(notification.bookingDetails.price)}</p>
                                
                                {/* Additional Services */}
                                {notification.bookingDetails.services?.length > 0 && (
                                    <div className="services">
                                        <h4>Additional Services:</h4>
                                        <ul>
                                            {notification.bookingDetails.services.map(service => (
                                                <li key={service._id}>
                                                    {service.name} - {formatPrice(service.price)} x {service.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="notification-actions">
                                <button 
                                    onClick={() => handleAcceptClick(notification.bookingDetails._id, notification.id)} 
                                    className="accept-btn"
                                >
                                    Accept Booking
                                </button>
                                <button 
                                    onClick={() => handleDeclineClick(notification.bookingDetails._id, notification.id)} 
                                    className="decline-btn"
                                >
                                    Decline Booking
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
