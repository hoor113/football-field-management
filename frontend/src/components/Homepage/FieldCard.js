import React, { useState, useEffect } from 'react';
import './FieldCard.css';
import { ServiceForm } from './ServiceForm';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import EditFieldForm from './EditFieldForm.js';


export const FieldCard = ({ field, isLoggedIn }) => {
    const navigate = useNavigate();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);  // Track current image index
    const [autoChangeImage, setAutoChangeImage] = useState(true); // Control auto-change feature
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
    // Go to the previous image
    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? field.image_url.length - 1 : prevIndex - 1
        );
        resetAutoChangeImage();
    };

    // Go to the next image
    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === field.image_url.length - 1 ? 0 : prevIndex + 1
        );
        resetAutoChangeImage();
    };

    // Change image every 3 seconds automatically if autoChangeImage is true
    useEffect(() => {
        if (field.image_url.length <= 1) return;  // Only auto-change if more than 1 image
        let interval;

        if (autoChangeImage) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === field.image_url.length - 1 ? 0 : prevIndex + 1
                );
            }, 3000); // Change image every 3 seconds
        }

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, [autoChangeImage, field.image_url.length]);

    // Reset the automatic image change when the user clicks the image
    const resetAutoChangeImage = () => {
        setAutoChangeImage(false);
        setTimeout(() => {
            setAutoChangeImage(true);
        }, 3000); // Restart auto-change after 3 seconds
    };

    return (
        <div className="field-card">
            <div className="field-header">
                <h2>{field.name}</h2>
            </div>

           {/* Check if there's more than one image */}
           {field.image_url && field.image_url.length > 1 ? (
                <>
                    {/* Image navigation buttons */}
                    <div className="image-navigation">
                        <button onClick={handlePrevImage} className="prev-button">
                            &lt;
                        </button>
                        <img
                            src={field.image_url[currentImageIndex]}
                            alt={field.name}
                            className="field-image"
                            onClick={resetAutoChangeImage} // Reset auto change when clicked
                        />
                        <button onClick={handleNextImage} className="next-button">
                            &gt;
                        </button>
                    </div>
                </>
            ) : (
                <img
                    src={field.image_url[0]} // Always show the only image
                    alt={field.name}
                    className="field-image"
                />
            )}

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

            <div className="services-section">
                <h3>Services</h3>
                {field.services && field.services.length > 0 ? (
                    <div className="services-grid">
                        {field.services.map((service, index) => (
                            <div key={index} className="service-item">
                                <div className="service-name">{service.name}</div>
                                <div className="service-type">{service.type}</div>
                                <div className="service-price">
                                    {service.price.toLocaleString()} VND 
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-services">No services available</p>
                )}
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