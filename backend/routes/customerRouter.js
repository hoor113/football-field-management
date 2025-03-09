import { Router } from 'express';

import {
    register,
    login,
    logout
} from '#customer/auth.js'

import {
    
    makeBooking,
    getBookings
} from '#customer/booking.js'

import {
    getCustomer,
    getProfile,
    updateProfile
} from '#customer/profile.js'

import { 
    getResponseNoti, 
    sendNotification, 
    markAllNotificationsAsRead 
} from '#customer/notification.js';

import {
    submitRating, 
    getFieldRatings, 
    getAverageRating
} from '#customer/rating.js'

import { authenticateToken } from '#backend/controller/verify.js';
// api/customer/
const customerRouter = Router();
//
customerRouter.post('/register', register);
customerRouter.post('/login', login);
customerRouter.post("/logout", logout)
//
customerRouter.post("/book", authenticateToken, makeBooking)
customerRouter.get("/bookings", authenticateToken, getBookings)
//
customerRouter.get("/", authenticateToken, getCustomer)
customerRouter.get("/profile", authenticateToken, getProfile)
customerRouter.put("/profile/update", authenticateToken, updateProfile)
//
customerRouter.get('/noti', authenticateToken, getResponseNoti);
customerRouter.post('/send_notification', authenticateToken, sendNotification);
customerRouter.put('/noti/read_all', authenticateToken, markAllNotificationsAsRead);
//
customerRouter.post('/rating', authenticateToken, submitRating);
customerRouter.get('/rating/:fieldId', authenticateToken, getFieldRatings);
customerRouter.get('/rating/:fieldId/average', authenticateToken, getAverageRating);
export default customerRouter;

