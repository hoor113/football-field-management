import React, { useState } from 'react';
import './EditServiceForm.css';

const EditServiceForm = ({ service, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: service.name,
        type: service.type,
        price: service.price,
        image_url: service.image_url || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="edit-service-form">
            <h3>Chỉnh sửa dịch vụ</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên dịch vụ:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Loại dịch vụ:</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Giá:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>URL Hình ảnh:</label>
                    <input
                        type="url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        Cập nhật
                    </button>
                    <button type="button" onClick={onClose} className="cancel-btn">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditServiceForm;