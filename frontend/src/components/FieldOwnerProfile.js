import React, { useState, useEffect } from 'react';
import "../styles/FieldOwnerProfile.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Profile = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({
        fullname: '',
        username: '',
        email: '',
        phone: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchUserInfo();
        }
    }, [navigate]);

    const handleEditClick = () => {
        console.log('Chuyển sang chế độ chỉnh sửa');
        setIsEditing(true);
    };


    const fetchUserInfo = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/api/field_owner/profile`, {
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!response.ok) throw new Error('Failed to fetch user info');
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
            navigate('/login');
            toast.error('Không thể tải thông tin chủ sân');
        } finally {
            setIsLoading(false);
        }
    };

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
			e.preventDefault();
			
			// Chuyển validateForm vào đây
			const newErrors = {};
			if (!userInfo.fullname.trim()) {
					newErrors.fullname = 'Họ tên không được để trống';
			}
			if (!userInfo.email.trim()) {
					newErrors.email = 'Email không được để trống';
			}
			else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
					newErrors.email = 'Email không hợp lệ';
			}
			if (!userInfo.phone.trim()) {
					newErrors.phone = 'Số điện thoại không được để trống';
			}
			else if (!/^[0-9]{10}$/.test(userInfo.phone)) {
					newErrors.phone = 'Số điện thoại không hợp lệ';
			}
	
			if (userInfo.currentPassword) {
					if (!userInfo.newPassword) {
							newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
					}
					else if (userInfo.newPassword.length < 6) {
							newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
					}
					if (userInfo.newPassword !== userInfo.confirmPassword) {
							newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
					}
			}
	
			setErrors(newErrors);
			if (Object.keys(newErrors).length > 0) {
					return; // Dừng lại nếu có lỗi
			}
	
			setIsLoading(true);
			try {
					const response = await fetch(`http://localhost:5000/api/field_owner/profile/update`, {
							method: 'PUT',
							credentials: 'include',
							headers: {
									'Content-Type': 'application/json',
							},
							body: JSON.stringify(userInfo)
					});
	
					if (!response.ok) throw new Error('Update failed');
	
					toast.success('Cập nhật thông tin thành công');
					setIsEditing(false);
					// Reset password fields
					setUserInfo(prev => ({
							...prev,
							currentPassword: '',
							newPassword: '',
							confirmPassword: ''
					}));
					// Fetch lại thông tin mới
					await fetchUserInfo();
			} catch (error) {
					console.error('Error updating profile:', error);
					toast.error('Không thể cập nhật thông tin');
			} finally {
					setIsLoading(false);
			}
	};

    return (
        <div className="profile-container">
            <h2>Hồ Sơ Cá Nhân</h2>
            
            <div className="profile-content">
                {/* <div className="profile-avatar">
                    <img
                        src={userInfo.avatar || '/default-avatar.png'}
                        alt="Avatar"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            className="avatar-input"
                        />
                    )}
                </div> */}

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Tên đăng nhập:</label>
                        <input
                            type="text"
                            name="username"
                            value={userInfo.username}
                            disabled={true}
                            className="disabled-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input
                            type="text"
                            name="fullname"
                            value={userInfo.fullname}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={errors.fullname ? 'error' : ''}
                        />
                        {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input
                            type="tel"
                            name="phone"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={errors.phone ? 'error' : ''}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>

                    {isEditing && (
                        <>
                            <div className="form-group">
                                <label>Mật khẩu hiện tại:</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={userInfo.currentPassword}
                                    onChange={handleInputChange}
                                    className={errors.currentPassword ? 'error' : ''}
                                />
                                {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                            </div>

                            <div className="form-group">
                                <label>Mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={userInfo.newPassword}
                                    onChange={handleInputChange}
                                    className={errors.newPassword ? 'error' : ''}
                                />
                                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                            </div>

                            <div className="form-group">
                                <label>Xác nhận mật khẩu mới:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={userInfo.confirmPassword}
                                    onChange={handleInputChange}
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>
                        </>
                    )}

                    {isEditing && (
                        <div className="profile-actions">
                            <button 
                                type="submit" 
                                className="save-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang lưu...' : 'Xác nhận'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setIsEditing(false);
                                    setErrors({});
                                }}
                                className="cancel-btn"
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </form>

                {!isEditing && (
                    <div className="profile-actions">
                        <button 
                            type="button" 
                            onClick={handleEditClick}
                            className="edit-btn"
                        >
                            Chỉnh sửa
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 