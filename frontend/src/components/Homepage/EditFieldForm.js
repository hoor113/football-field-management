import React, { useState } from 'react';
import './EditFieldForm.css';

const EditFieldForm = ({ field, onClose, onSubmit }) => {
    const [editData, setEditData] = useState({
        name: field.name,
        description: field.description,
        address: field.address,
        base_price: field.base_price,
        total_grounds: field.total_grounds,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onSubmit(editData);
    };

    return (
        <div>
            <h2>Chỉnh sửa sân</h2>
            <form className="edit-field-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Tên sân</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={editData.name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên sân mới"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        id="description"
                        name="description"
                        value={editData.description}
                        onChange={handleInputChange}
                        placeholder="Nhập mô tả sân"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={editData.address}
                        onChange={handleInputChange}
                        placeholder="Nhập địa chỉ sân"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="base_price">Giá cơ bản</label>
                    <input
                        type="number"
                        id="base_price"
                        name="base_price"
                        value={editData.base_price}
                        onChange={handleInputChange}
                        placeholder="Nhập giá cơ bản"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="total_grounds">Tổng số sân</label>
                    <input
                        type="number"
                        id="total_grounds"
                        name="total_grounds"
                        value={editData.total_grounds}
                        onChange={handleInputChange}
                        placeholder="Nhập tổng số sân"
                    />
                </div>
                <div className="button-group">
                    <button type="submit" className="save-button">Lưu</button><br />
                    <button type="button" className="cancel-button" onClick={onClose}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditFieldForm;