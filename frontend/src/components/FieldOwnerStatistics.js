import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Paper,
  Divider
} from '@mui/material';
import '#styles/FieldOwnerStatistics.css';

const FieldOwnerStatistics = () => {
    const [postedFields, setPostedFields] = useState(0);
    const [fields, setFields] = useState([]);

    useEffect(() => {
        const fetchPostedFields = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/field_owner/posted_fields');
                const data = await response.json();
                setPostedFields(data.count);
            } catch (error) {
                console.error('Error fetching posted fields:', error);
            }
        };

        const fetchFields = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/field_owner/fields');
                const data = await response.json();
                setFields(data.fields);
            } catch (error) {
                console.error('Error fetching fields:', error);
            }
        };

        fetchPostedFields();
        fetchFields();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom component="h2" align="center" 
                    sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                    Thống Kê Chủ Sân
                </Typography>
                
                <Box sx={{ 
                    bgcolor: '#e3f2fd', 
                    p: 2, 
                    borderRadius: 2,
                    mb: 3,
                    textAlign: 'center'
                }}>
                    <Typography variant="h5" component="p">
                        Số sân đã đăng: {postedFields}
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {fields.map((field, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card sx={{ 
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                height: '100%'
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: { xs: '100%', sm: 200 },
                                        height: { xs: 200, sm: 'auto' },
                                        objectFit: 'cover'
                                    }}
                                    image={field.image_url}
                                    alt={field.name}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography variant="h6" component="h3" gutterBottom>
                                        {field.name}
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        <strong>Địa chỉ:</strong> {field.address}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        <strong>Mô tả:</strong> {field.description}
                                    </Typography>
                                    <Typography variant="body1" color="primary">
                                        <strong>Giá:</strong> {field.base_price.toLocaleString()} VND
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Container>
    );
};

export default FieldOwnerStatistics; 