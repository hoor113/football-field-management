import React from 'react';
import '#styles/Policy.css';

const Policy = () => {
    return (
        <div className="chinh-sach-container">
            <h1>Chính Sách Sử Dụng Dịch Vụ</h1>

            <section>
                <h2>1. Mục Đích Sử Dụng</h2>
                <p>Trang web của chúng tôi được xây dựng nhằm mục đích hỗ trợ người dùng:</p>
                <ul>
                    <li>Tìm kiếm, đặt sân bóng đá phù hợp với nhu cầu.</li>
                    <li>Quản lý thông tin đặt sân một cách nhanh chóng, tiện lợi và minh bạch.</li>
                    <li>Kết nối người chơi với các sân bóng trong khu vực.</li>
                </ul>
            </section>

            <section>
                <h2>2. Điều Kiện Sử Dụng</h2>
                <ul>
                    <li>Người dùng cần đăng ký tài khoản để sử dụng đầy đủ các tính năng của trang web.</li>
                    <li>Khi sử dụng dịch vụ, người dùng cam kết cung cấp thông tin chính xác, đầy đủ và chịu trách nhiệm về thông tin mình cung cấp.</li>
                    <li>Chúng tôi có quyền từ chối cung cấp dịch vụ trong trường hợp phát hiện hành vi vi phạm pháp luật hoặc gây ảnh hưởng xấu đến trang web và cộng đồng.</li>
                </ul>
            </section>

            <section>
                <h2>3. Chính Sách Đặt Sân</h2>
                <h3>Xác nhận đặt sân:</h3>
                <p>Đơn đặt sân chỉ được coi là hợp lệ khi nhận được xác nhận qua email hoặc tin nhắn từ hệ thống.</p>
                
                <h3>Thay đổi lịch đặt sân:</h3>
                <p>Người dùng có thể thay đổi lịch đặt sân trước giờ đã đặt ít nhất 24 giờ, tùy thuộc vào chính sách cụ thể của từng sân.</p>
                
                <h3>Hủy đặt sân:</h3>
                <ul>
                    <li>Hủy đặt trước 24 giờ: Hoàn tiền 100% (nếu đã thanh toán trước).</li>
                    <li>Hủy đặt trong vòng 12 - 24 giờ: Hoàn tiền 50%.</li>
                    <li>Hủy đặt trong vòng 12 giờ: Không được hoàn tiền.</li>
                </ul>
            </section>

            <section>
                <h2>4. Chính Sách Thanh Toán</h2>
                <ul>
                    <li><strong>Phương thức thanh toán:</strong> Người dùng có thể thanh toán bằng tiền mặt khi đến sân hoặc thông qua cổng thanh toán trực tuyến.</li>
                    <li><strong>Thanh toán trực tuyến:</strong> Tất cả giao dịch trực tuyến đều được bảo mật theo tiêu chuẩn hiện hành.</li>
                    <li><strong>Hoàn tiền:</strong> Thời gian hoàn tiền (nếu có) sẽ diễn ra trong vòng 7 - 14 ngày làm việc, tùy thuộc vào phương thức thanh toán.</li>
                </ul>
            </section>

            {/* Các section còn lại tương tự */}
            
            <section>
                <h2>5. Thay Đổi Chính Sách</h2>
                <p>Chính sách này có thể được điều chỉnh, cập nhật bất kỳ lúc nào. Người dùng vui lòng theo dõi và cập nhật thông tin thường xuyên trên hệ thống.</p>
            </section>
        </div>
    );
};

export default Policy; 