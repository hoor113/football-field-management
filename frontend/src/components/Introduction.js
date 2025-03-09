import React from 'react';
import '#styles/GioiThieu.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCustomer } from '#login/AuthCustomer';
import { AuthFieldOwner } from '#login/AuthFieldOwner';

const GioiThieu = () => {
    const navigate = useNavigate();
    const customerAuth = AuthCustomer();
    const fieldOwnerAuth = AuthFieldOwner();
    const isLoggedIn = customerAuth.isLoggedIn || fieldOwnerAuth.isLoggedIn;

    const handleBookingClick = () => {
        if (!isLoggedIn) {
            navigate('/customer/login');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="gioi-thieu-container">
            <h1>Đặt Sân Bóng Dễ Dàng </h1>
            <h2>Trải Nghiệm Chơi Bóng Không Giới Hạn</h2>
            
            <p className="intro-text">
                Chúng tôi hiểu đam mê bóng đá của bạn - những giờ phút sảng khoái trên sân cỏ, 
                niềm vui chiến đấu cùng đồng đội, và không khí náo nhiệt của những trận cầu đầy kịch tính. 
                Trang Web của chúng tôi ra đời để biến những giấc mơ sân cỏ của bạn thành hiện thực một cách 
                dễ dàng và thuận tiện nhất.
            </p>

            <section className="why-choose-us">
                <h2>Tại Sao Chọn Chúng Tôi?</h2>
                <ul>
                    <li>Hệ Thống Sân Rộng Khắp: Mạng lưới sân bóng chất lượng trải rộng, đáp ứng mọi nhu cầu từ tập luyện đến thi đấu giải.</li>
                    <li>Đặt Sân Nhanh Chóng: Chỉ với vài thao tác đơn giản, bạn có thể chọn ngay sân phù hợp với nhóm mình.</li>
                    <li>Giá Cả Minh Bạch: Không lo về chi phí ẩn, mức giá rõ ràng và cạnh tranh.</li>
                    <li>Hỗ Trợ Chuyên Nghiệp: Đội ngũ hỗ trợ nhiệt tình, sẵn sàng giải đáp mọi thắc mắc của bạn.</li>
                </ul>
            </section>

            <section className="unique-experience">
                <h2>Trải Nghiệm Độc Đáo</h2>
                <p>Cho dù bạn là:</p>
                <ul>
                    <li>Đội bóng phong trào</li>
                    <li>Nhóm bạn thích vui chơi cuối tuần</li>
                    <li>Cá nhân đam mê bóng đá</li>
                    <li>Học sinh, sinh viên muốn rèn luyện thể thao</li>
                </ul>
                <p>Trang Web của chúng tôi đều mang đến cho bạn những sân chơi chất lượng, an toàn và đầy hứng khởi.</p>
            </section>

            <section className="call-to-action">
                <h2>Hãy Cùng Bắt Đầu Ngay!</h2>
                <p>Đừng để đam mê của bạn phải chờ đợi.</p>
                <button onClick={handleBookingClick} className="cta-button">
                    Đặt Sân Ngay
                </button>
            </section>
        </div>
    );
};

export default GioiThieu; 