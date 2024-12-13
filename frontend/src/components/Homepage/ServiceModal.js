import React, { useState } from 'react';
import './ServiceModal.css';

const ServiceModal = ({ services, onClose }) => {
    // State to keep track of selected service type
    const [selectedType, setSelectedType] = useState(null);

    // Get unique service types
    const uniqueTypes = [...new Set(services.map(service => service.type))];

    // Handle click on service type to toggle visibility of services for that type
    const handleTypeClick = (type) => {
        setSelectedType(selectedType === type ? null : type); // Toggle between showing and hiding the services
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="modal-title">Services</h3>
                <div className="service-types">
                    {uniqueTypes.map((type, index) => (
                        <div key={index}>
                            <button 
                                className="service-type-btn" 
                                onClick={() => handleTypeClick(type)}
                            >
                                {type}
                            </button>
                            
                            {/* Display services for the selected type */}
                            {selectedType === type && (
                                <ul className="service-list">
                                    {services
                                        .filter(service => service.type === type)
                                        .map((service, index) => (
                                            <li key={index} className="service-item">
                                                <span className="service-name">{service.name}</span>
                                                <span className="service-price">
                                                    {service.price.toLocaleString()} VND
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                <button className="modal-close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ServiceModal;
