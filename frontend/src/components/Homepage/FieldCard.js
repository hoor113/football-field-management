import React, { useState } from 'react';
import './FieldCard.css';
import { ServiceForm } from './ServiceForm';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import EditFieldForm from './EditFieldForm.js';
import RatingDisplay from './RatingDisplay.js';
import { ServiceTypeForm } from './SerViceTypeForm.js';

export const FieldCard = ({ field, isLoggedIn }) => {
    const navigate = useNavigate();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showServiceTypeForm, setShowServiceTypeForm] = useState(false);
    const handleOrderClick = () => {
        navigate(`/order/${field._id}`, { state: { field } });
    };

    const handleDeleteField = async () => {
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsModalOpen(false);
        try {
            const response = await fetch(`http://localhost:5000/api/field_owner/deleteField/${field._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to delete the field:', errorText);
                return;
            }

            const result = await response.json();
            // removeField(field._id);
            alert(result.message);
            window.location.reload();
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handleEditField = async (updatedFieldData) => {
        try {
            const response = await fetch(`http://localhost:5000/api/field_owner/editField/${field._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedFieldData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to update the field:', errorText);
                alert('Failed to update the field. Please try again.');
                return;
            }

            const result = await response.json();
            alert(result.message);
            window.location.reload();
        } catch (error) {
            console.error('An unexpected error occurred:', error.message);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div className="field-card">
            <div className="field-header">
                <h2>{field.name}</h2>
            </div>

            <img src={field.image_url} alt={field.name} className="field-image" />
            <RatingDisplay fieldId={field._id} />
            <p><strong>Description:</strong> {field.description}</p>
            <p><strong>Address:</strong> {field.address}</p>
            <p><strong>Base Price:</strong>  {field.base_price.toLocaleString()} VND</p>
            <p><strong>Total Grounds:</strong> {field.total_grounds}</p>

            <div className="operating-hours-display">
                <h3>Operating Hours:</h3>
                {field.operating_hours && field.operating_hours.length > 0 ? (
                    <div className="time-ranges">
                        {field.operating_hours
                            .sort((a, b) => a.start_hour - b.start_hour)
                            .map((hours, index) => (
                                <div key={index} className="time-range-item">
                                    <span className="time-badge">
                                        {String(hours.start_hour).padStart(2, '0')}:00
                                        -
                                        {String(hours.end_hour).padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="no-hours">No operating hours set</p>
                )}
            </div>

          =<div className="services-section">
    <h3>Services</h3>
    <div className="service-types-grid">
        {field.service_types && (
            <>
                {field.service_types.sv1 && (
                    <div className="service-type-item">
                        <span className="service-type-label">Type 1:</span>
                        <span className="service-type-value">{field.service_types.sv1}</span>
                    </div>
                )}
                {field.service_types.sv2 && (
                    <div className="service-type-item">
                        <span className="service-type-label">Type 2:</span>
                        <span className="service-type-value">{field.service_types.sv2}</span>
                    </div>
                )}
                {field.service_types.sv3 && (
                    <div className="service-type-item">
                        <span className="service-type-label">Type 3:</span>
                        <span className="service-type-value">{field.service_types.sv3}</span>
                    </div>
                )}
            </>
        )}
    </div>
</div>

            {showServiceForm && (
                <ServiceForm
                    fieldId={field._id}
                    onClose={() => setShowServiceForm(false)}
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmDelete}
            />

            {isLoggedIn === 1 ? (
                <>
                    <button
                        className="add-service-button"
                        onClick={() => setShowServiceForm(true)}
                    >
                        Add Services
                    </button>
                    <button
                        className="edit-field-button"
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        Edit Field
                    </button>
                    <button
                        className="delete-field-button"
                        onClick={handleDeleteField}
                    >
                        Delete Field
                    </button>
                    <button
        className="add-service-type-button"
        onClick={() => setShowServiceTypeForm(true)}
    >
        Add Service Types
    </button>
                </>
            ) : null}
            {isLoggedIn === 2 ? <button
                className="add-service-button"
                onClick={handleOrderClick}
            >
                Order Now
            </button> : null}
            {showServiceTypeForm && (

    <ServiceTypeForm
        fieldId={field._id}
        onClose={() => setShowServiceTypeForm(false)}
    />
)}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <EditFieldForm
                            field={field}
                            onClose={() => setIsEditModalOpen(false)}
                            onSubmit={handleEditField}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 