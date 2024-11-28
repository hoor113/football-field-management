import React, { useState } from 'react';
import './ServiceForm.css';

export const ServiceForm = ({ fieldId, onClose }) => {
    const [service, setService] = useState({
        name: '',
        type: '',
        price: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/field/service', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    fieldId,
                    ...service
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add service');
            }

            alert('Service added successfully!');
            onClose();
        } catch (error) {
            alert('Error adding service: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="service-form-modal">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="modal-header">
                    <h2>Add New Service</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => setService({...service, name: e.target.value})}
                        required
                        className="modal-input"
                    />
                    
                    <input
                        type="text"
                        placeholder="Service Type"
                        value={service.type}
                        onChange={(e) => setService({...service, type: e.target.value})}
                        required
                        className="modal-input"
                    />
                    
                    <input
                        type="number"
                        placeholder="Price"
                        value={service.price}
                        onChange={(e) => setService({...service, price: e.target.value})}
                        required
                        className="modal-input"
                    />
                    
                    <div className="form-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancel
                        </button>
                        <button type="submit" className="submit-button">
                            Add Service
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 