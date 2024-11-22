import React, { useState } from 'react';
import './ServiceForm.css';

export const ServiceForm = ({ fieldId, onSubmit, onCancel }) => {
    const [newService, setNewService] = useState({
        serviceName: '',
        serviceType: '',
        price: ''
    });

    const handleSubmit = () => {
        onSubmit({
            fieldId,
            name: newService.serviceName,
            type: newService.serviceType,
            price: Number(newService.price)
        });
    };

    return (
        <div className="modal service-form-modal">
            <h2>Add Service to Field</h2>
            <input
                type="text"
                placeholder="Service Name"
                value={newService.serviceName}
                onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                className="modal-input"
            />
            <input
                type="text"
                placeholder="Service Type"
                value={newService.serviceType}
                onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                className="modal-input"
            />
            <input
                type="number"
                placeholder="Price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                className="modal-input"
            />
            <div className="modal-buttons">
                <button onClick={onCancel} className="cancel-button">Cancel</button>
                <button onClick={handleSubmit} className="submit-button">Add Service</button>
            </div>
        </div>
    );
}; 