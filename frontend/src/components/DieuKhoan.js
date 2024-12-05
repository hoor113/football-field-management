import React from 'react';
import '../styles/DieuKhoan.css';

const DieuKhoan = () => {
    return (
        <div className="dieu-khoan-container">
            <h1>ĐIỀU KHOẢN SỬ DỤNG</h1>

            <section>
                <h2>1. Giới Thiệu</h2>
                <p>
                    Chào mừng bạn đến với trang web đặt sân bóng đá của chúng tôi. Bằng việc truy cập và sử dụng các dịch vụ trên trang web, 
                    bạn đồng ý tuân thủ và chịu ràng buộc bởi các điều khoản sử dụng dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, 
                    vui lòng ngừng sử dụng trang web ngay lập tức.
                </p>
            </section>

            <section>
                <h2>2. Điều Kiện Sử Dụng</h2>
                <ul>
                    <li>Người dùng phải đủ 18 tuổi hoặc được sự đồng ý từ người giám hộ hợp pháp để đăng ký tài khoản và sử dụng dịch vụ.</li>
                    <li>Người dùng chịu trách nhiệm về tính chính xác và hợp pháp của thông tin cá nhân được cung cấp.</li>
                    <li>Người dùng cam kết sử dụng dịch vụ đúng mục đích và không thực hiện các hành vi gian lận, vi phạm pháp luật hoặc gây tổn hại đến hệ thống.</li>
                </ul>
            </section>

            <section>
                <h2>3. Đăng Ký Tài Khoản</h2>
                <ul>
                    <li>Để sử dụng các tính năng đặt sân, người dùng cần tạo tài khoản bằng cách cung cấp đầy đủ thông tin cá nhân như: tên, số điện thoại, email...</li>
                    <li>Tài khoản là duy nhất và không được chia sẻ với người khác. Người dùng có trách nhiệm bảo mật thông tin tài khoản và chịu mọi trách nhiệm phát sinh từ việc sử dụng tài khoản của mình.</li>
                </ul>
            </section>

            <section>
                <h2>4. Quyền và Trách Nhiệm Của Người Dùng</h2>
                <h3>Quyền:</h3>
                <ul>
                    <li>Truy cập vào các thông tin sân bóng và dịch vụ được cung cấp trên hệ thống.</li>
                    <li>Thực hiện đặt sân, thanh toán trực tuyến và nhận hỗ trợ từ bộ phận chăm sóc khách hàng.</li>
                </ul>
                <h3>Trách nhiệm:</h3>
                <ul>
                    <li>Tuân thủ các quy định về thời gian, chính sách đặt sân và hủy sân.</li>
                    <li>Không sử dụng dịch vụ để phát tán thông tin sai lệch, gây ảnh hưởng đến người dùng khác hoặc chủ sân.</li>
                    <li>Bồi thường thiệt hại (nếu có) do vi phạm điều khoản sử dụng.</li>
                </ul>
            </section>

            {/* Thêm các section còn lại tương tự */}

            <section>
                <h2>5. Giải Quyết Tranh Chấp</h2>
                <ul>
                    <li>Mọi tranh chấp phát sinh liên quan đến dịch vụ sẽ được giải quyết thông qua thương lượng giữa các bên.</li>
                    <li>Nếu không thể giải quyết bằng thương lượng, tranh chấp sẽ được đưa ra giải quyết tại cơ quan có thẩm quyền.</li>
                </ul>
            </section>
        </div>
    );
};

export default DieuKhoan; 