import { Router } from 'express';
import { register, login, getFieldOwner, logout } from '../controller/authFieldOwner.js';
import { GetFields } from '../controller/field-owner.func.js';
import { authenticateToken } from '../controller/verify.js';
import { getProfile, updateProfile } from '../controller/authFieldOwner.js';
import { acceptBooking, cancelBooking, getBookingNoti, markNotificationAsRead } from '../controller/field-owner.func.js';
// import { getNotificationsByOwnerId, markNotificationAsRead } from '../controller/notification.func.js';
// api/field_owner/
const router2 = Router();
router2.post('/register', register);
router2.post('/login', login);
router2.get("/", authenticateToken, getFieldOwner)
router2.post("/logout", logout)
router2.get("/fields", authenticateToken, GetFields)
router2.get("/profile", authenticateToken, getProfile)
router2.put("/profile/update", authenticateToken, updateProfile)
router2.post('/accept/:bookingId', acceptBooking);
router2.post('/cancel/:bookingId', cancelBooking);
router2.get('/noti', authenticateToken, getBookingNoti);
router2.put('/notification/:notificationId/read', authenticateToken, markNotificationAsRead);

export default router2;
