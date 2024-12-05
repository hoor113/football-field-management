import { Router } from 'express';
import { register, login, getCustomer, logout, getProfile, updateProfile } from '../controller/authCustomer.js';
import { authenticateToken } from '../controller/verify.js';
import { makeBooking, getBookings } from '../controller/customer.func.js';
import { getResponseNoti, sendNotification, markAllNotificationsAsRead } from '../controller/customer.func.js';
// api/customer/
const router1 = Router();
router1.post('/register', register);
router1.post('/login', login);
router1.get("/", authenticateToken, getCustomer)
router1.post("/logout", logout)
router1.post("/book", authenticateToken, makeBooking)
router1.get("/profile", authenticateToken, getProfile)
router1.put("/profile/update", authenticateToken, updateProfile)
router1.get("/bookings", authenticateToken, getBookings)
router1.get('/noti', authenticateToken, getResponseNoti);
router1.post('/send_notification', authenticateToken, sendNotification);
router1.post('/noti/read_all', authenticateToken, markAllNotificationsAsRead);
export default router1;
