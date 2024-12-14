import React, { useState } from 'react';
import './ServiceSelectionBoard.css';

export const ServiceSelectionBoard = ({ services, onAddService, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Get unique service types
  const serviceTypes = ['all', ...new Set(services.map(service => service.type))];

  // Filter services based on active tab
  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(service => service.type === activeTab);

  return (
    <div className="service-board-overlay">
      <div className="service-board">
        <div className="service-board-header">
          <h2>Chọn Dịch Vụ</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="service-tabs">
          {serviceTypes.map(type => (
            <button
              key={type}
              className={`tab-button ${activeTab === type ? 'active' : ''}`}
              onClick={() => setActiveTab(type)}
            >
              {type === 'all' ? 'Tất cả' : type}
            </button>
          ))}
        </div>

        <div className="service-cards-container">
          {filteredServices.map(service => (
            <div key={service._id} className="service-card">
              {/* Ensure that the correct property name is used for imageUrl */}
              <img 
                src={service.imageUrl}  // Corrected to imageUrl
                alt={service.name} 
                className="service-image"
              />
              <div className="service-info">
                <h3>{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <p className="service-price">
                  {service.price.toLocaleString()} VNĐ/{service.unit}
                </p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddService(service)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
