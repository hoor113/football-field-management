import React, { useState, useEffect } from 'react';
import { FieldList } from './FieldList';
import { FieldForm } from './FieldForm';
import { ServiceForm } from './ServiceForm';
import { useField } from './hooks/useField';
import { handleAddField } from './functions/fieldOperations';
import './Homepage.css';
import { SearchSection } from './SearchSection';
import ZirkzeeImage from './images/zirkzee.jpg';
import AntonyImage from './images/antony.jpg';
import NicholasJacksonImage from './images/jackson.jpg';
import MykhayloMudrykImage from './images/mudryk.jpg';
import { useNavigate } from 'react-router-dom';

const NewsSection = () => {
    const [displayCount, setDisplayCount] = useState(4); // Default to 4 items

    // Update display count based on window width
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width > 1200) {
                setDisplayCount(4);
            } else if (width > 900) {
                setDisplayCount(3);
            } else if (width > 600) {
                setDisplayCount(2);
            } else {
                setDisplayCount(1);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const newsItems = [
        {
            id: 1,
            image: ZirkzeeImage,
            title: "NHM MU vui mừng với hình ảnh mới nhất của Joshua Zirkzee",
            summary: "Joshua Zirkzee chưa chính thức hội quân cùng MU, dù đang trong thời gian...",
            date: "28/11/2024",
            link: "https://bongda24h.vn/bong-da-anh/nhm-mu-vui-mung-voi-hinh-anh-moi-nhat-cua-joshua-zirkzee-172-394712.html"
        },
        {
            id: 2,
            image: AntonyImage,
            title: "Antony gia nhập MU, phá cột mốc chuyển nhượng của Ronaldo",
            summary: "Manchester United đã công bố trên trang chủ họ đã hoàn tất vụ chuyển nhượng ...",
            date: "28/11/2024",
            link: "https://www.24h.com.vn/bong-da/antony-100-trieu-euro-da-kiem-tra-y-te-o-mu-ferdinand-lo-vet-xe-do-nhu-grealish-c48a1391592.html"
        },
        {
            id: 3,
            image: NicholasJacksonImage,
            title: "'Phượng hoàng' Jackson",
            summary: "Ít ai ngờ rằng Nicolas Jackson lại có thể vươn lên trở thành trụ cột của Chelsea...",
            date: "28/11/2024",
            link: "https://znews.vn/phuong-hoang-jackson-post1513288.html"
        },
        {
            id: 4,
            image: MykhayloMudrykImage,
            title: "Mudryk thách đấu CĐV Chelsea",
            summary: "Bị chê đá kém, tiền vệ trị giá 119 triệu USD Mykhailo Mudryk thách đấu CĐV Chelsea...",
            date: "28/11/2024",
            link: "https://vnexpress.net/mudryk-thach-dau-cdv-chelsea-4709172.html"
        }
    ];

    // Only display the number of items based on screen size
    const displayedNews = newsItems.slice(0, displayCount);

    return (
        <div className="news-section">
            <h2 className="news-section-title">Tin Tức Mới Nhất</h2>
            <div className="news-grid">
                {displayedNews.map(news => (
                    <div key={news.id} className="news-card">
                        <div className="news-image">
                            <img src={news.image} alt={news.title} />
                        </div>
                        <div className="news-content">
                            <h3>{news.title}</h3>
                            <p className="news-date">{news.date}</p>
                            <p className="news-summary">{news.summary}</p>
                            <a href={news.link} target="_blank" rel="noopener noreferrer" className="read-more-btn">
                                Đọc thêm
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const FeaturedFields = () => {
    const featuredFields = [
        { id: 1, name: "Sân A", location: "Hà Nội", rating: 4.5 },
        { id: 2, name: "Sân B", location: "TP. Hồ Chí Minh", rating: 4.7 },
        { id: 3, name: "Sân C", location: "Đà Nẵng", rating: 4.6 },
    ];

    return (
        <div className="featured-fields">
            <h2>Sân Bóng Nổi Bật</h2>
            <div className="fields-grid">
                {featuredFields.map(field => (
                    <div key={field.id} className="field-card">
                        <h3>{field.name}</h3>
                        <p>{field.location}</p>
                        <p>Rating: {field.rating}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Statistics = () => (
    <div className="statistics-section">
        <div className="stat-item">
            <h3>500+</h3>
            <p>Sân Bóng</p>
        </div>
        <div className="stat-item">
            <h3>10,000+</h3>
            <p>Người Dùng</p>
        </div>
        <div className="stat-item">
            <h3>50,000+</h3>
            <p>Lượt Đặt Sân</p>
        </div>
    </div>
);

const Testimonials = () => {
    const testimonials = [
        { id: 1, name: "Nguyễn Văn A", feedback: "Dịch vụ tuyệt vời!" },
        { id: 2, name: "Trần Thị B", feedback: "Rất hài lòng với chất lượng sân." },
        { id: 3, name: "Lê Văn C", feedback: "Sẽ giới thiệu cho bạn bè." },
    ];

    return (
        <div className="testimonials-section">
            <h2>Khách Hàng Nói Gì Về Chúng Tôi</h2>
            <div className="testimonials-slider">
                {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="testimonial-card">
                        <p>"{testimonial.feedback}"</p>
                        <h4>- {testimonial.name}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HowItWorks = () => (
    <div className="how-it-works">
        <h2>Cách Thức Hoạt Động</h2>
        <div className="steps">
            <div className="step">
                <div className="step-number">1</div>
                <h3>Tìm Sân</h3>
                <p>Tìm sân phù hợp theo khu vực</p>
            </div>
            <div className="step">
                <div className="step-number">2</div>
                <h3>Đặt Sân</h3>
                <p>Chọn thời gian và đặt sân</p>
            </div>
            <div className="step">
                <div className="step-number">3</div>
                <h3>Thanh Toán</h3>
                <p>Thanh toán an toàn</p>
            </div>
        </div>
    </div>
);

const Features = () => (
    <div className="features-section">
        <h2>Tại Sao Chọn Chúng Tôi</h2>
        <div className="features-grid">
            <div className="feature">
                <i className="icon-fast"></i>
                <h3>Đặt Sân Nhanh Chóng</h3>
                <p>Chỉ với vài thao tác đơn giản</p>
            </div>
            <div className="feature">
                <i className="icon-secure"></i>
                <h3>Thanh Toán An Toàn</h3>
                <p>Bảo mật thông tin thanh toán</p>
            </div>
            <div className="feature">
                <i className="icon-support"></i>
                <h3>Hỗ Trợ 24/7</h3>
                <p>Đội ngũ hỗ trợ luôn sẵn sàng</p>
            </div>
            <div className="feature">
                <i className="icon-quality"></i>
                <h3>Chất Lượng Đảm Bảo</h3>
                <p>Cam kết chất lượng dịch vụ</p>
            </div>
        </div>
    </div>
);

const AppDownload = () => (
    <div className="app-download">
        <div className="app-content">
            <h2>Tải Ứng Dụng Ngay</h2>
            <p>Đặt sân dễ dàng hơn với ứng dụng di động</p>
            <div className="download-buttons">
                <button className="app-store">App Store</button>
                <button className="play-store">Google Play</button>
            </div>
        </div>
        <div className="app-image">
            <img src="/images/app-preview.png" alt="App Preview" />
        </div>
    </div>
);

export const HomePage = ({ isLoggedIn, fullname }) => {
    const navigate = useNavigate();
    const { fields, setFields } = useField(isLoggedIn);
    const [showFieldForm, setShowFieldForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [selectedField, setSelectedField] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const fieldsPerPage = 3;
    const [searchName, setSearchName] = useState('');
    const [searchAddress, setSearchAddress] = useState('');
    const [filteredFields, setFilteredFields] = useState([]);

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

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/field/fields/search?name=${searchName}&address=${searchAddress}`);
            const data = await response.json();
            setFilteredFields(data.fields);
            // Redirect to the search results page
            navigate('/search-results', { state: { fields: data.fields } });
        } catch (error) {
            console.error('Error fetching search results:', error);
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
                    title="Nhấn vào để thêm sân"
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
                    <h1 style={{ color: '#ffffff' }}>TRANG CHỦ HỖ TRỢ TÌM KIẾM SÂN BÃI NHANH</h1>
                    <p>Dữ liệu được cập nhật thường xuyên giúp cho người dùng tìm được sân một cách nhanh nhất</p>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Nhập tên sân"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ"
                            value={searchAddress}
                            onChange={(e) => setSearchAddress(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}>Tìm kiếm</button>
                    </div>
                </div>
            </div>
            {/* <div className="search-results">
                {filteredFields.length > 0 ? (
                    filteredFields.map(field => (
                        <div key={field.id} className="field-card">
                            <h3>{field.name}</h3>
                            <p>{field.location}</p>
                            <p>Rating: {field.rating}</p>
                        </div>
                    ))
                ) : (
                    <p>No fields found</p>
                )}
            </div> */}
            <HowItWorks />
            <FeaturedFields />
            <Statistics />
            <Features />
            <Testimonials />
            <AppDownload />
            <NewsSection />
        </>
    );
};

export default HomePage; 