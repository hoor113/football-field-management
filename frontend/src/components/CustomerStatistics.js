import React, { useEffect, useState } from 'react';
import '#styles/CustomerStatistics.css';

const CustomerStatistics = () => {
    const [bookingsCount, setBookingsCount] = useState(0);
    const [bookingsList, setBookingsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const bookingsPerPage = 15;

    useEffect(() => {
        fetchBookingsCount();
    }, []);

    const fetchBookingsCount = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/customer/bookings', {
                credentials: 'include'
            });
            const data = await response.json();
            const sortedBookings = data.bookings.sort((a, b) => 
                new Date(b.order_time) - new Date(a.order_time)
            );
            setBookingsCount(data.bookings.length);
            setBookingsList(sortedBookings);
        } catch (error) {
            console.error('Error fetching booked fields:', error);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours());
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'confirmed': return 'status-confirmed';
            case 'cancelled': return 'status-cancelled';
            case 'pending': return 'status-pending';
            default: return '';
        }
    };

    // Get current bookings
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookingsList.slice(indexOfFirstBooking, indexOfLastBooking);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages (minimum 1 page)
    const totalPages = Math.max(1, Math.ceil(bookingsList.length / bookingsPerPage));

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="customer-statistics">
            <h2>Lịch Sử Đặt Sân</h2>
            <p>Tổng số lần đặt sân từ lúc lập tài khoản: {bookingsCount}</p>
            
            <div className="booking-history">
                {currentBookings.length > 0 ? (
                    currentBookings.map((booking) => (
                        <div key={booking._id} className={`booking-card ${getStatusClass(booking.status)}`}>
                            <div className="booking-time">
                                <strong>Thời gian thực hiện đặt sân:</strong> {formatDateTime(booking.order_time)}
                            </div>
                            <div className="booking-time">
                                <strong>Thời gian bạn đã đặt:</strong> {formatDateTime(booking.start_time)}
                            </div>
                            <div className="booking-status">
                                <strong>Trạng thái:</strong> {
                                    booking.status === 'confirmed' ? 'Đã xác nhận' :
                                    booking.status === 'cancelled' ? 'Đã hủy' :
                                    booking.status === 'pending' ? 'Đang chờ' : booking.status
                                }
                            </div>
                            <div className="booking-price">
                                <strong>Giá:</strong> {booking.price.toLocaleString('vi-VN')} VNĐ
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-bookings">Chưa có lịch sử đặt sân</div>
                )}
            </div>

            <div className="pagination">
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Trước
                </button>
                
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    >
                        {number}
                    </button>
                ))}
                
                <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Sau
                </button>
            </div>
        </div>
    );
};

export default CustomerStatistics; 