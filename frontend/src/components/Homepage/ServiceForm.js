import React, { useState } from 'react';
import './ServiceForm.css';

export const ServiceForm = ({ fieldId, onClose }) => {
    const [service, setService] = useState({
        name: '',
        type: '',
        price: '',
        imageUrl: '',
        unit: ''
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
                throw new Error('Lỗi khi thêm dịch vụ');
            }

            alert('Thêm dịch vụ thành công!');
            onClose();
            window.location.reload();
        } catch (error) {
            alert('Lỗi khi thêm dịch vụ: ' + error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="service-form-modal">
                {/* <button className="close-button" onClick={onClose}>×</button> */}

                <div className="modal-header">
                    <h2>Thêm dịch vụ mới</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Tên dịch vụ"
                        value={service.name}
                        onChange={(e) => setService({ ...service, name: e.target.value })}
                        required
                        className="modal-input"
                    />

                    <input
                        type="text"
                        placeholder="Loại dịch vụ"
                        value={service.type}
                        onChange={(e) => setService({ ...service, type: e.target.value })}
                        required
                        className="modal-input"
                    />

                    <div className="price-unit-container">
                        <input
                            type="number"
                            placeholder="Giá"
                            value={service.price}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (value >= 0) {
                                    setService({ ...service, price: value });
                                }
                            }}
                            required
                            className="modal-input price-input"
                        />

                        <input
                            type="text"
                            placeholder="Đơn vị tính(ví dụ: giờ, phiên)"
                            value={service.unit}
                            onChange={(e) => setService({ ...service, unit: e.target.value })}
                            required
                            className="modal-input unit-input"
                        />
                    </div>

                    <input
                        type="url"
                        placeholder="URL hình ảnh"
                        value={service.imageUrl}
                        onChange={(e) => setService({ ...service, imageUrl: e.target.value })}
                        className="modal-input"
                    />

                    <div className="form-buttons">
                        <button type="submit" className="submit-button">
                            Thêm dịch vụ
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 