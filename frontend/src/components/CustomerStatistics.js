import React, { useEffect, useState } from 'react';
import '../styles/CustomerStatistics.css';

const CustomerStatistics = () => {
    const [bookedFields, setBookedFields] = useState(0);

    useEffect(() => {
        // Fetch the number of fields booked by the customer
        // This is a placeholder for an actual API call
        const fetchBookedFields = async () => {
            try {
                // Replace with your API endpoint
                const response = await fetch('http://localhost:5000/api/customer/booked-fields');
                const data = await response.json();
                setBookedFields(data.count);
            } catch (error) {
                console.error('Error fetching booked fields:', error);
            }
        };

        fetchBookedFields();
    }, []);

    return (
        <div className="customer-statistics">
            <h2>Thống Kê Khách Hàng</h2>
            <p>Số sân đã đặt: {bookedFields}</p>
        </div>
    );
};

export default CustomerStatistics; 