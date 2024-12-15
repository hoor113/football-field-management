import React, { useState } from 'react';
import './RecommendedServicesForm.css';

const RecommendedServicesForm = ({ field, onClose, onUpdate }) => {
    const [selectedServices, setSelectedServices] = useState(
        field.recommended_services?.map(service => 
            field.services.find(s => 
                s.name === service.name && 
                s.price === service.price && 
                s.type === service.type
            )?._id
        ).filter(id => id) || []
    );

    const handleServiceSelect = (serviceId) => {
        if (selectedServices.includes(serviceId)) {
            setSelectedServices(prev => prev.filter(id => id !== serviceId));
        } else if (selectedServices.length < 3) {
            setSelectedServices(prev => [...prev, serviceId]);
        } else {
            alert('Bạn chỉ có thể chọn tối đa 3 dịch vụ nổi bật');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://localhost:5000/api/field_owner/fields/${field._id}/recommended-services`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ serviceIds: selectedServices }),
                }
            );

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }

            onUpdate(data.recommended_services);
            onClose();
            alert('Cập nhật dịch vụ nổi bật thành công!');
        } catch (error) {
            console.error('Error updating recommended services:', error);
            alert('Có lỗi xảy ra khi cập nhật dịch vụ nổi bật');
        }
    };

    return (
        <div className="recommended-services-form">
            <h3>Chọn Dịch Vụ Nổi Bật (Tối đa 3)</h3>
            <form onSubmit={handleSubmit}>
                <div className="services-list">
                    {field.services.map((service) => (
                        <div key={service._id} className="service-selection-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service._id)}
                                    onChange={() => handleServiceSelect(service._id)}
                                />
                                <span className="service-name">{service.name}</span>
                                <span className="service-price">
                                    {service.price.toLocaleString()} VND
                                </span>
                                <span className="service-type">{service.type}</span>
                            </label>
                        </div>
                    ))}
                </div>
                <div className="form-buttons">
                    <button type="submit" className="submit-button">
                        Lưu thay đổi
                    </button>
                    <button type="button" className="cancel-button" onClick={onClose}>
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecommendedServicesForm;
