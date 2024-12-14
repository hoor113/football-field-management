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
import banner from './images/banner.jpg';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Paper,
  TextField,
  IconButton,
  Rating,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import VerifiedIcon from '@mui/icons-material/Verified';

const NewsSection = () => {
    const [displayCount, setDisplayCount] = useState(4);

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

        handleResize();
        window.addEventListener('resize', handleResize);
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

    const displayedNews = newsItems.slice(0, displayCount);

    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography 
                    variant="h4" 
                    component="h2" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        mb: 6,
                        fontWeight: 'bold',
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 60,
                            height: 4,
                            bgcolor: 'primary.main',
                            borderRadius: 2
                        }
                    }}
                >
                    Tin Tức Mới Nhất
                </Typography>
                <Grid container spacing={3}>
                    {displayedNews.map(news => (
                        <Grid item xs={12} sm={6} md={3} key={news.id}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease-in-out',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: (theme) => theme.shadows[8],
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="240"
                                    image={news.image}
                                    alt={news.title}
                                    sx={{
                                        objectFit: 'cover',
                                        objectPosition: 'top',
                                        transition: 'transform 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        }
                                    }}
                                />
                                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                                    <Typography 
                                        variant="subtitle2" 
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {news.date}
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        component="h3" 
                                        gutterBottom
                                        sx={{
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            lineHeight: 1.4,
                                            minHeight: '4.2em',
                                            overflow: 'visible',
                                            display: 'block',
                                            mb: 2
                                        }}
                                    >
                                        {news.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{
                                            mb: 2,
                                            minHeight: '3.6em',
                                            overflow: 'visible',
                                            display: 'block',
                                        }}
                                    >
                                        {news.summary}
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        href={news.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{
                                            mt: 'auto',
                                            textTransform: 'none',
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: 'primary.main',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        Đọc thêm
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const FeaturedFields = () => {
    const featuredFields = [
        { id: 1, name: "Sân A", location: "Hà Nội", rating: 4.5 },
        { id: 2, name: "Sân B", location: "TP. Hồ Chí Minh", rating: 4.7 },
        { id: 3, name: "Sân C", location: "Đà Nẵng", rating: 4.6 },
    ];

    return (
        <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                    Sân Bóng Nổi Bật
                </Typography>
                <Grid container spacing={4}>
                    {featuredFields.map(field => (
                        <Grid item xs={12} sm={6} md={4} key={field.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image="/images/field-placeholder.jpg"
                                    alt={field.name}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h3">
                                        {field.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {field.location}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Rating
                                            value={field.rating}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                        />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            ({field.rating})
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const Statistics = () => (
    <Box sx={{ py: 6, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
                {[
                    { number: '500+', label: 'Sân Bóng' },
                    { number: '10,000+', label: 'Người Dùng' },
                    { number: '50,000+', label: 'Lượt Đặt Sân' }
                ].map((stat, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {stat.number}
                            </Typography>
                            <Typography variant="h6">
                                {stat.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
);

const Testimonials = () => {
    const testimonials = [
        { id: 1, name: "Nguyễn Văn A", feedback: "Dịch vụ tuyệt vời!" },
        { id: 2, name: "Trần Thị B", feedback: "Rất hài lòng với chất lượng sân." },
        { id: 3, name: "Lê Văn C", feedback: "Sẽ giới thiệu cho bạn bè." },
    ];

    return (
        <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
            <Container maxWidth="lg">
                <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                    Khách Hàng Nói Gì Về Chúng Tôi
                </Typography>
                <Grid container spacing={4}>
                    {testimonials.map(testimonial => (
                        <Grid item xs={12} sm={4} key={testimonial.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                                <CardContent>
                                    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
                                        "{testimonial.feedback}"
                                    </Typography>
                                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                                        - {testimonial.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

const HowItWorks = () => (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                Cách Thức Hoạt Động
            </Typography>
            <Grid container spacing={4}>
                {[
                    { number: 1, title: 'Tìm Sân', desc: 'Tìm sân phù hợp theo khu vực' },
                    { number: 2, title: 'Đặt Sân', desc: 'Chọn thời gian và đặt sân' },
                    { number: 3, title: 'Thanh Toán', desc: 'Thanh toán an toàn' }
                ].map((step, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
                            <Box
                                sx={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto',
                                    mb: 2,
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold'
                                }}
                            >
                                {step.number}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {step.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {step.desc}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
);

const Features = () => (
    <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
            <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 4 }}>
                Tại Sao Chọn Chúng Tôi
            </Typography>
            <Grid container spacing={4}>
                {[
                    { icon: <PhoneAndroidIcon sx={{ fontSize: 40 }} />, title: 'Đặt Sân Nhanh Chóng', desc: 'Chỉ với vài thao tác đơn giản' },
                    { icon: <SecurityIcon sx={{ fontSize: 40 }} />, title: 'Thanh Toán An Toàn', desc: 'Bảo mật thông tin thanh toán' },
                    { icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, title: 'Hỗ Trợ 24/7', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng' },
                    { icon: <VerifiedIcon sx={{ fontSize: 40 }} />, title: 'Chất Lượng Đảm Bảo', desc: 'Cam kết chất lượng dịch vụ' }
                ].map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                            <Box sx={{ mb: 2, color: 'primary.main' }}>
                                {feature.icon}
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {feature.desc}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    </Box>
);

// const AppDownload = () => (
//     <Box sx={{ py: 6, bgcolor: 'background.default' }}>
//         <Container maxWidth="lg">
//             <Grid container spacing={4} alignItems="center">
//                 <Grid item xs={12} md={6}>
//                     <Typography variant="h4" component="h2" gutterBottom>
//                         Tải Ứng Dụng Ngay
//                     </Typography>
//                     <Typography variant="body1" paragraph>
//                         Đặt sân dễ dàng hơn với ứng dụng di động
//                     </Typography>
//                     <Box sx={{ display: 'flex', gap: 2 }}>
//                         <Button
//                             variant="contained"
//                             startIcon={<img src="/images/apple-logo.png" alt="Apple" width="20" />}
//                             sx={{ borderRadius: 2 }}
//                         >
//                             App Store
//                         </Button>
//                         <Button
//                             variant="contained"
//                             startIcon={<img src="/images/google-play-logo.png" alt="Google Play" width="20" />}
//                             sx={{ borderRadius: 2 }}
//                         >
//                             Google Play
//                         </Button>
//                     </Box>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                     <Box
//                         component="img"
//                         src="/images/app-preview.png"
//                         alt="App Preview"
//                         sx={{
//                             width: '100%',
//                             maxWidth: 400,
//                             height: 'auto',
//                             display: 'block',
//                             margin: '0 auto'
//                         }}
//                     />
//                 </Grid>
//             </Grid>
//         </Container>
//     </Box>
// );

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
            {/* <AppDownload /> */}
            <NewsSection />
        </>
    );
};

export default HomePage; 