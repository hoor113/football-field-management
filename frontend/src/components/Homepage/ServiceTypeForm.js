// frontend/src/components/Homepage/ServiceTypeForm.js
import React, { useState } from 'react';
import './ServiceTypeForm.css';

export const ServiceTypeForm = ({ fieldId, onClose }) => {
    const [formData, setFormData] = useState({
        sv1: '',
        sv2: '',
        sv3: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/field/servicetype', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    fieldId,
                    ...formData
                })
            });

            if (response.ok) {
                alert('Service types added successfully');
                onClose();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Lỗi khi thêm loại dịch vụ');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="service-type-form-modal">
            <div className="service-type-form-content">
                <h2>Add Service Types</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Service Type 1:</label>
                        <input
                            type="text"
                            name="sv1"
                            value={formData.sv1}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Service Type 2:</label>
                        <input
                            type="text"
                            name="sv2"
                            value={formData.sv2}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Service Type 3:</label>
                        <input
                            type="text"
                            name="sv3"
                            value={formData.sv3}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Save</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};