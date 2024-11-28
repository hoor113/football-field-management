import React, { useState } from 'react';
import { FieldList } from './FieldList';
import { FieldForm } from './FieldForm';
import { ServiceForm } from './ServiceForm';
import { useField } from './hooks/useField';
import { handleAddField } from './functions/fieldOperations';
import './Homepage.css';
import { SearchSection } from './SearchSection';

const NewsSection = () => {
    const newsItems = [
        {
            id: 1,
            image: "path_to_image_1.jpg",
            title: "Tin tức bóng đá 1",
            summary: "Tóm tắt nội dung bài báo 1 ở đây. Có thể là một số thông tin về giải đấu hoặc sự kiện bóng đá...",
            date: "20/03/2024"
        },
        {
            id: 2,
            image: "path_to_image_2.jpg",
            title: "Tin tức bóng đá 2",
            summary: "Tóm tắt nội dung bài báo 2 ở đây. Thông tin về các trận đấu hoặc cập nhật mới...",
            date: "19/03/2024"
        },
        {
            id: 3,
            image: "path_to_image_3.jpg",
            title: "Tin tức bóng đá 3",
            summary: "Tóm tắt nội dung bài báo 3 ở đây. Có thể là thông tin về các cầu thủ...",
            date: "18/03/2024"
        },
        {
            id: 4,
            image: "path_to_image_4.jpg",
            title: "Tin tức bóng đá 4",
            summary: "Tóm tắt nội dung bài báo 4 ở đây. Thông tin về các sự kiện sắp diễn ra...",
            date: "17/03/2024"
        }
    ];

    return (
        <div className="news-section">
            <h2 className="news-section-title">Tin Tức Mới Nhất</h2>
            <div className="news-grid">
                {newsItems.map(news => (
                    <div key={news.id} className="news-card">
                        <div className="news-image">
                            <img src={news.image} alt={news.title} />
                        </div>
                        <div className="news-content">
                            <h3>{news.title}</h3>
                            <p className="news-date">{news.date}</p>
                            <p className="news-summary">{news.summary}</p>
                            <button className="read-more-btn">Đọc thêm</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const HomePage = ({ isLoggedIn, fullname }) => {
    const { fields, setFields } = useField(isLoggedIn);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const fieldsPerPage = 3;

    const handleServiceSubmit = async (serviceData) => {
        try {
            const response = await fetch("http://localhost:5000/api/field/service", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceData),
            });

            if (response.ok) {
                alert('Service added successfully!');
                setShowServiceForm(false);
                // Refresh fields to show new service
                const fieldsResponse = await fetch("http://localhost:5000/api/field_owner/fields", {
                    credentials: "include",
                });
                const fieldsData = await fieldsResponse.json();
                if (fieldsData.fields) {
                    setFields(fieldsData.fields);
                }
            } else {
                throw new Error('Failed to add service');
            }
        } catch (error) {
            console.error('Error adding service:', error);
            alert(error.message);
        }
    };

    if (isLoggedIn === 1) {
        return (
            <div className="container">
                <h1 className="welcome-header">Welcome Field Owner {fullname}!</h1>

                <FieldList
                    fields={fields}
                    currentPage={currentPage}
                    fieldsPerPage={fieldsPerPage}
                    onPageChange={setCurrentPage}
                />

                <button
                    className="floating-add-button"
                    onClick={() => setShowFieldForm(true)}
                >
                    +
                </button>

                {showFieldForm && (
                    <FieldForm
                        onSubmit={(fieldData) => handleAddField(fieldData, setShowFieldForm, setFields)}
                        onCancel={() => setShowFieldForm(false)}
                    />
                )}

                {showServiceForm && (
                    <ServiceForm
                        fieldId={selectedField}
                        onSubmit={handleServiceSubmit}
                        onCancel={() => setShowServiceForm(false)}
                    />
                )}
            </div>
        );
    }

    // Customer Homepage
    else if (isLoggedIn === 2) {
        return (
            <div className="container">
                <h1 className="welcome-header">
                    {`Welcome Customer ${fullname}!`}
                </h1>
                <SearchSection />
            </div>
        );
    }
    return (
        <>
            <div className="banner">
                <div className="banner-content">
                    <h1 style={{ color: '#ffffff' }}>HỆ THỐNG HỖ TRỢ TÌM KIẾM SÂN BÃI NHANH</h1>
                    <p>Dữ liệu được cập nhật thường xuyên giúp cho người dùng tìm được sân một cách nhanh nhất</p>
                    <div className="search-bar">
                        {/* <select>
                            <option>Lọc theo loại sân</option>
                            <option>Sân cỏ nhân tạo</option>
                            <option>Sân cỏ tự nhiên</option>
                        </select> */}
                        <input type="text" placeholder="Nhập tên sân hoặc địa chỉ..." />
                        <input type="text" placeholder="Nhập khu vực" />
                        <button className="search-button">Tìm kiếm</button>
                    </div>
                </div>
                
            </div>
            <NewsSection />
        </>
    );
};

export default HomePage; 