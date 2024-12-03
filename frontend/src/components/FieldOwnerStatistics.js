import React, { useEffect, useState } from 'react';
import '../styles/FieldOwnerStatistics.css'; // Import file CSS

const FieldOwnerStatistics = () => {
    const [postedFields, setPostedFields] = useState(0);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        const fetchPostedFields = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/field_owner/posted-fields');
                const data = await response.json();
                setPostedFields(data.count);
            } catch (error) {
                console.error('Error fetching posted fields:', error);
            }
        };

        const fetchFields = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/field_owner/fields');
                const data = await response.json();
                setFields(data.fields);
            } catch (error) {
                console.error('Error fetching fields:', error);
            }
        };

        fetchPostedFields();
        fetchFields();
    }, []);

    return (
        <div className="field-owner-statistics">
            <h2>Thống Kê Chủ Sân</h2>
            <p>Số sân đã đăng: {postedFields}</p>
            <div className="field-details">
                {fields.map((field, index) => (
                    <div key={index} className="field-item">
                        <img src={field.image_url} alt={field.name} className="field-image" />
                        <div className="field-info">
                            <h3>{field.name}</h3>
                            <p>Địa chỉ: {field.address}</p>
                            <p>Mô tả: {field.description}</p>
                            <p>Giá: {field.base_price} VND</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FieldOwnerStatistics; 