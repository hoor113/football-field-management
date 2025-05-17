import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Xác nhận</h2>
                <p>Bạn có chắc chắn muốn xóa sân này?</p>
                <div className="modal-buttons">
                    <button className="modal-button-ok" onClick={onConfirm}>OK</button>
                    <button className="modal-button-cancel" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default Modal;