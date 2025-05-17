import React from 'react';
import { Link } from 'react-router-dom';
import '#styles/Footer.css';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>GIỚI THIỆU</h3>
                    <p>Trang Web của chúng tôi cung cấp các tiện ích thông minh giúp cho bạn tìm sân bãi và đặt sân một cách hiệu quả nhất.</p>
                </div>

                <div className="footer-section">
                    <h3>THÔNG TIN</h3>
                    <div className="company-info">
                        <p>Nhóm 11 Lớp 154020 Học phần IT3180</p>
                        <p>Mail: nguyenlekhoi2004113@gmail.com</p>
                        <p>Điện thoại: 0919271298</p>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>LIÊN HỆ</h3>
                    <div className="contact-info">
                        <p>Chăm sóc khách hàng:</p>
                        <a href="tel:0919271298" className="phone-number">0919271298</a>
                        {/* <button className="call-button">Gọi ngay</button> */}
                    </div>
                    <div className="social-links">
                        <h4>TÌM CHÚNG TÔI</h4>
                        <div className="social-icons">
                            <a href="https://www.facebook.com/profile.php?id=100009091555432" target="_blank" rel="noopener noreferrer">
                                <FaFacebook />
                            </a>
                            <a href="https://www.instagram.com/nlk041103/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 