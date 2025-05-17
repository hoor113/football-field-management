import { Router } from 'express';
import { register, login, getFieldOwner, logout, getPostedFieldsCount } from '#backend/controller/authFieldOwner.js';
import { getFieldDetails } from '#backend/controller/field-owner.func.js';
import { authenticateToken } from '#backend/controller/verify.js';
import { getProfile, updateProfile } from '#backend/controller/authFieldOwner.js';
// import { getFieldOwnerById } from '../controller/authFieldOwner.js';
import { acceptBooking, cancelBooking, getBookingNoti, markNotificationAsRead, deleteField, editFieldAttributes } from '#backend/controller/field-owner.func.js';
import { updateRecommendedServices } from '#backend/controller/field-owner.func.js';
import { deleteService, editService } from '#backend/controller/field-owner.func.js';

// api/field_owner/
const ownerRouter = Router();
//
ownerRouter.post('/register', register);
ownerRouter.post('/login', login);
ownerRouter.post("/logout", logout)
//
ownerRouter.get("/", authenticateToken, getFieldOwner)
ownerRouter.get("/profile", authenticateToken, getProfile)
ownerRouter.put("/profile/update", authenticateToken, updateProfile)
ownerRouter.get("/posted_fields", authenticateToken, getPostedFieldsCount)
//
ownerRouter.post('/accept/:bookingId', acceptBooking);
ownerRouter.post('/cancel/:bookingId', cancelBooking);
//
ownerRouter.get('/noti', authenticateToken, getBookingNoti);
ownerRouter.put('/notification/read/:notificationId', authenticateToken, markNotificationAsRead);
//
ownerRouter.get("/fields", authenticateToken, getFieldDetails)
ownerRouter.delete('/deleteField/:fieldId', authenticateToken, deleteField);
ownerRouter.put('/editField/:fieldId', authenticateToken, editFieldAttributes);
//
ownerRouter.put('/fields/:fieldId/recommended-services', authenticateToken, updateRecommendedServices);
ownerRouter.delete('/fields/:fieldId/services/:serviceId', authenticateToken, deleteService);
ownerRouter.put('/fields/:fieldId/services/:serviceId', authenticateToken, editService);
export default ownerRouter;
