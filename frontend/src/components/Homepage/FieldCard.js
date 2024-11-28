import React, { useState } from 'react';
import './FieldCard.css';
import { ServiceForm } from './ServiceForm';

export const FieldCard = ({ field, isLoggedIn }) => {
    const [showServiceForm, setShowServiceForm] = useState(false);

    return (
        <div className="field-card">
            <div className="field-header">
                <h2>{field.name}</h2>
                {isLoggedIn === 1 ? <button
                    className="add-service-button"
                    onClick={() => setShowServiceForm(true)}
                >
                    Add Services +
                </button> : null}
            </div>

            <img src={field.image_url} alt={field.name} className="field-image" />
            <p><strong>Description:</strong> {field.description}</p>
            <p><strong>Address:</strong> {field.address}</p>
            <p><strong>Base Price:</strong> VND {field.base_price.toLocaleString()}</p>
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
                                    VND {service.price.toLocaleString()}
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

            {isLoggedIn === 2 ? <button
                className="add-service-button"
                // onClick={() => setShowServiceForm(true)}
                // TODO: Add order now functionality
            >
                Order Now
            </button> : null}
        </div>
    );
}; 