import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import './SearchResult.css';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fields } = location.state || { fields: [] };

    const handleBookingClick = () => {
        navigate('/customer/login');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                Kết quả tìm kiếm
            </Typography>
            
            {fields.length > 0 ? (
                <Grid container spacing={3}>
                    {fields.map(field => (
                        <Grid item xs={12} sm={6} md={4} key={field.id}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: '0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={field.image_url}
                                    alt={field.name}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h3">
                                        {field.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {field.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {field.address}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {field.base_price} VND
                                        </Typography>
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ p: 2 }}>
                                    <Button 
                                        variant="contained" 
                                        fullWidth 
                                        onClick={handleBookingClick}
                                        sx={{
                                            bgcolor: 'primary.main',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                            }
                                        }}
                                    >
                                        Đặt sân ngay
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        Không tìm thấy sân
                    </Typography>
                </Box>
            )}
        </Container>
    );
};

export default SearchResults; 