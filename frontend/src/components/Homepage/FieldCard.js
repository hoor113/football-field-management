import React, { useState } from 'react';
import './FieldCard.css';
import { ServiceForm } from './ServiceForm';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import EditFieldForm from './EditFieldForm.js';
import RatingDisplay from './RatingDisplay.js';
import { ServiceTypeForm } from './SerViceTypeForm.js';
import RecommendedServicesForm from './RecommendedServicesForm';
import { Button } from '@mui/material';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import StadiumIcon from '@mui/icons-material/Stadium';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import EditServiceForm from './EditServiceForm';

export const FieldCard = ({ field, isLoggedIn }) => {
    const navigate = useNavigate();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showServiceTypeForm, setShowServiceTypeForm] = useState(false);
    const [showAllServices, setShowAllServices] = useState(false);
    const [showRecommendedServicesForm, setShowRecommendedServicesForm] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [showFieldDropdown, setShowFieldDropdown] = useState(false);
    const [showServiceManagement, setShowServiceManagement] = useState(false);
    const [editingService, setEditingService] = useState(null);

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
                console.error('Lỗi khi xóa sân:', errorText);
                return;
            }

            const result = await response.json();
            // removeField(field._id);
            alert(result.message);
            window.location.reload();
        } catch (error) {
            console.error('Lỗi không xác định:', error.message);
            alert('Lỗi không xác định. Vui lòng thử lại sau.');
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
                console.error('Lỗi khi cập nhật sân:', errorText);
                alert('Lỗi khi cập nhật sân. Vui lòng thử lại.');
                return;
            }

            const result = await response.json();
            alert(result.message);
            window.location.reload();
        } catch (error) {
            console.error('Lỗi không xác định:', error.message);
            alert('Lỗi không xác định. Vui lòng thử lại sau.');
        }
    };

    const handleRecommendedServicesUpdate = (updatedServices) => {
        field.recommended_services = updatedServices;
        // If you need to refresh the whole component or update the parent
        // window.location.reload();
    };

    // Group services by type
    const groupedServices = field.services.reduce((acc, service) => {
        if (!acc[service.type]) {
            acc[service.type] = [];
        }
        acc[service.type].push(service);
        return acc;
    }, {});

    const handleDeleteService = async (serviceId) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/field_owner/fields/${field._id}/services/${serviceId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete service');
            }

            alert('Xóa dịch vụ thành công');
            window.location.reload();
        } catch (error) {
            console.error('Error deleting service:', error);
            alert('Có lỗi xảy ra khi xóa dịch vụ');
        }
    };

    const handleEditService = async (service) => {
        setEditingService(service);
    };

    const handleUpdateService = async (updatedData) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/field_owner/fields/${field._id}/services/${editingService._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update service');
            }

            alert('Cập nhật dịch vụ thành công');
            setEditingService(null);
            window.location.reload();
        } catch (error) {
            console.error('Error updating service:', error);
            alert('Có lỗi xảy ra khi cập nhật dịch vụ');
        }
    };

    return (
        <div className="field-card">
            <div className="field-header">
                <h2>{field.name}</h2>
            </div>

            <img src={field.image_url} alt={field.name} className="field-image" />
            <RatingDisplay fieldId={field._id} />
            <p><strong>Mô tả:</strong> {field.description}</p>
            <p><strong>Địa chỉ:</strong> {field.address}</p>
            <p><strong>Giá cơ bản:</strong>  {field.base_price.toLocaleString()} VND</p>
            <p><strong>Tổng số sân:</strong> {field.total_grounds}</p>

            <div className="operating-hours-display">
                <h3>Giờ hoạt động:</h3>
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
                    <p className="no-hours">Không có giờ hoạt động</p>
                )}
            </div>

            {/* <div className="services-section">
                <h3>Services</h3>
                <div className="services-grid">
                        {field.services.map((service, index) => (
                            <div key={index} className="service-item">
                                <div className="service-header">
                                    <span className="service-name">{service.name}</span>
                                    <span className="service-type">{service.type}</span>
                                </div>
                                <div className="service-price">
                                    {service.price.toLocaleString()} VND 
                                </div>
                            </div>
                        ))}
                </div>
                
            </div> */}

            <div className="recommended-services">
                <h3>Dịch vụ nổi bật</h3>
                <div className="recommended-services-grid">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="recommended-service-slot">
                            {field.recommended_services && field.recommended_services[index] ? (
                                <div key={index} className="service-item">
                                    <div className="service-header">
                                        <span className="service-name">{field.recommended_services[index].name}</span>
                                        <span className="service-type">{field.recommended_services[index].type}</span>
                                    </div>
                                    <div className="service-price">
                                        {field.recommended_services[index].price.toLocaleString()} VND
                                    </div>
                                </div>
                            ) : (
                                <span className="empty-service">Không có dịch vụ ở đây</span>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    className="view-all-services-btn"
                    onClick={() => setShowAllServices(true)}
                >
                    Xem các dịch vụ
                </button>
            </div>

            {showAllServices && (
                <div className="modal-overlay">
                    <div className="all-services-modal">
                        <h3>Tất cả dịch vụ</h3>
                        {Object.entries(groupedServices).map(([type, services]) => (
                            <div key={type}>
                                <h4 className="service-type-header">{type}</h4>
                                <div className="services-grid">
                                    {services.map((service, index) => (
                                        <div key={index} className="service-item">
                                            <div className="service-header">
                                                <span className="service-name">{service.name}</span>
                                            </div>
                                            <div className="service-price">
                                                {service.price.toLocaleString()} VND
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <button
                            className="view-all-services-btn"
                            onClick={() => setShowAllServices(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

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
                <div className="field-action-buttons">
                    <div className="field-dropdown">
                        <Button 
                            className="field-dropdown-button"
                            variant="outlined"
                            startIcon={<RoomServiceIcon />}
                            onClick={() => {
                                setShowServiceDropdown(!showServiceDropdown);
                                setShowFieldDropdown(false);
                            }}
                            sx={{
                                color: '#1976d2',
                                borderColor: '#1976d2',
                                backgroundColor: 'white',
                                width: '100%',
                                '&:hover': {
                                    borderColor: '#1976d2',
                                    backgroundColor: 'rgba(25, 118, 210, 0.04)'
                                }
                            }}
                        >
                            DỊCH VỤ
                        </Button>
                        {showServiceDropdown && (
                            <div className="field-dropdown-content">
                                <button onClick={() => setShowServiceForm(true)}>
                                    Thêm dịch vụ
                                </button>
                                <button onClick={() => setShowServiceManagement(true)}>
                                    Quản lý dịch vụ
                                </button>
                                <button onClick={() => setShowRecommendedServicesForm(true)}>
                                    Chọn dịch vụ nổi bật
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="field-dropdown">
                        <Button 
                            className="field-dropdown-button"
                            variant="outlined"
                            startIcon={<StadiumIcon />}
                            onClick={() => {
                                setShowFieldDropdown(!showFieldDropdown);
                                setShowServiceDropdown(false);
                            }}
                            sx={{
                                color: '#2e7d32',
                                borderColor: '#2e7d32',
                                backgroundColor: 'white',
                                width: '100%',
                                '&:hover': {
                                    borderColor: '#2e7d32',
                                    backgroundColor: 'rgba(46, 125, 50, 0.04)'
                                }
                            }}
                        >
                            SÂN
                        </Button>
                        {showFieldDropdown && (
                            <div className="field-dropdown-content">
                                <button onClick={() => setIsEditModalOpen(true)}>
                                    Chỉnh sửa sân
                                </button>
                                <button onClick={handleDeleteField}>
                                    Xóa sân
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
            {isLoggedIn === 2 ? (
                <Button
                    variant="outlined"
                    startIcon={<TouchAppIcon />}
                    onClick={handleOrderClick}
                    sx={{
                        color: '#1976d2',
                        borderColor: '#1976d2',
                        backgroundColor: 'white',
                        width: '100%',
                        marginTop: '10px',
                        '&:hover': {
                            borderColor: '#1976d2',
                            backgroundColor: 'rgba(25, 118, 210, 0.04)'
                        }
                    }}
                >
                    ĐẶT SÂN NGAY
                </Button>
            ) : null}
            {showServiceTypeForm && (

                <ServiceTypeForm
                    fieldId={field._id}
                    onClose={() => setShowServiceTypeForm(false)}
                />
            )}
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
            {showRecommendedServicesForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <RecommendedServicesForm
                            field={field}
                            onClose={() => setShowRecommendedServicesForm(false)}
                            onUpdate={handleRecommendedServicesUpdate}
                        />
                    </div>
                </div>
            )}
            {showServiceManagement && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Quản lý dịch vụ</h3>
                        <div className="services-management-list">
                            {field.services.map((service) => (
                                <div key={service._id} className="service-management-item">
                                    <div className="service-info">
                                        <span>{service.name}</span>
                                        <span>{service.type}</span>
                                        <span>{service.price.toLocaleString()} VND</span>
                                    </div>
                                    <div className="service-actions">
                                        <button 
                                            onClick={() => {
                                                setEditingService(service);
                                                setShowServiceManagement(false);
                                            }}
                                        >
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDeleteService(service._id)}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="close-btn"
                            onClick={() => setShowServiceManagement(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {editingService && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <EditServiceForm
                            service={editingService}
                            onClose={() => setEditingService(null)}
                            onSubmit={handleUpdateService}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}; 