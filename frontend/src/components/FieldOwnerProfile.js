import React, { useState, useEffect } from 'react';
import "#styles/FieldOwnerProfile.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Divider,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';

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

					console.log("Thông tin đã cập nhật thành công:", {
						fullname: userInfo.fullname,
						email: userInfo.email,
						phone: userInfo.phone
					});

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
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={4}>
              <Avatar
                sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: 'primary.main',
                  mr: 2 
                }}
              >
                <PersonIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography variant="h4" component="h1">
                Hồ Sơ Cá Nhân
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    name="username"
                    value={userInfo.username}
                    disabled
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullname"
                    value={userInfo.fullname}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.fullname}
                    helperText={errors.fullname}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                  />
                </Grid>

                {isEditing && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Mật khẩu hiện tại"
                        name="currentPassword"
                        type="password"
                        value={userInfo.currentPassword}
                        onChange={handleInputChange}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Mật khẩu mới"
                        name="newPassword"
                        type="password"
                        value={userInfo.newPassword}
                        onChange={handleInputChange}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword}
                        variant="outlined"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Xác nhận mật khẩu mới"
                        name="confirmPassword"
                        type="password"
                        value={userInfo.confirmPassword}
                        onChange={handleInputChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        variant="outlined"
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    {!isEditing ? (
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditClick}
                        color="primary"
                      >
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => {
                            setIsEditing(false);
                            setErrors({});
                          }}
                          color="error"
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                          type="submit"
                          disabled={isLoading}
                          color="primary"
                        >
                          {isLoading ? 'Đang lưu...' : 'Xác nhận'}
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
    );
};

export default Profile; 