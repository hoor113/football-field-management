import React, { useState } from 'react';
import './EditFieldForm.css';

const EditFieldForm = ({ field, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: field.name,
        description: field.description,
        address: field.address,
        base_price: field.base_price,
        total_grounds: field.total_grounds,
        image_url: field.image_url || '',
        operating_hours: field.operating_hours || []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'base_price' || name === 'total_grounds') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="edit-field-form">
            <h2>Chỉnh sửa thông tin sân</h2>
            
            <div className="form-group">
                <label>Tên sân:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Địa chỉ:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
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
                    required
                />
            </div>

            <div className="form-group">
                <label>Giá cơ bản:</label>
                <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleChange}
                    required
                    min="0"
                />
            </div>

            <div className="form-group">
                <label>Tổng số sân:</label>
                <input
                    type="number"
                    name="total_grounds"
                    value={formData.total_grounds}
                    onChange={handleChange}
                    required
                    min="1"
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
    );
};

export default EditFieldForm;