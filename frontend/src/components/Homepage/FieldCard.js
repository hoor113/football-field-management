import React, { useState } from 'react';
import './FieldCard.css';
import { ServiceForm } from './ServiceForm';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import EditFieldForm from './EditFieldForm';
import ServiceModal from './ServiceModal'; 

export const FieldCard = ({ field, isLoggedIn }) => {
    const navigate = useNavigate();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
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
                <h2 style={{ textAlign: 'center' }}>{field.name}</h2> {/* Center title */}
            </div>

            {/* Hình ảnh sân */}
            <img 
                src={field.image_url || ""} 
                alt={field.name} 
                className="field-image" 
                style={{ height: '30%', width: '100%' }} 
            />

            <p><strong>Description:</strong> {field.description}</p>
            <p><strong>Address:</strong> {field.address}</p>
            <p><strong>Base Price:</strong>  {field.base_price.toLocaleString()} VND</p>
            <p><strong>Total Grounds:</strong> {field.total_grounds}</p>

            <div className="operating-hours-display">
                <h3 style={{ fontSize: '80%' }}>Operating Hours:</h3>
                {field.operating_hours && field.operating_hours.length > 0 ? (
                    <div className="time-ranges" style={{ display: 'flex', fontSize: '80%' }}>
                        {field.operating_hours
                            .sort((a, b) => a.start_hour - b.start_hour)
                            .map((hours, index) => (
                                <div key={index} className="time-range-item" style={{ marginRight: '10px' }}>
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

            <div className="services-section">
                <h3>Services</h3>
                {field.services && field.services.length > 0 ? (
                    <div className="services-grid" style={{ maxHeight: '200px' }}>
                        {Array.from(
                            new Set(field.services.map(service => service.type)) 
                        )
                        .slice(0, 2) // Only display up to 2 types
                        .map((serviceType, index) => (
                            <div key={index} className="service-item">
                                <div className="service-type">{serviceType}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-services">No services available</p>
                )}

                {field.services.length > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => {
                                setShowAllServices(!showAllServices);  // Toggle state
                                if (!showAllServices) {
                                    setIsModalVisible(true);  
                                }
                            }}
                            className="add-service-button"
                        >
                            {showAllServices ? "..." : "..."}  {/* Change to "..." */}
                        </button>
                    </div>
                )}
            </div>

            {isModalVisible && (
                <ServiceModal
                    services={field.services}
                    onClose={() => setIsModalVisible(false)} // Close modal when "Close" is clicked
                />
            )}

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
                </>
            ) : null}
            {isLoggedIn === 2 ? <button
                className="add-service-button"
                onClick={handleOrderClick}
            >
                Order Now
            </button> : null}

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
