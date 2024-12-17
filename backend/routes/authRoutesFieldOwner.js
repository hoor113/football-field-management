import { Router } from 'express';
import { register, login, getFieldOwner, logout, getPostedFieldsCount } from '../controller/authFieldOwner.js';
import { getFieldDetails } from '../controller/field-owner.func.js';
import { authenticateToken } from '../controller/verify.js';
import { getProfile, updateProfile } from '../controller/authFieldOwner.js';
// import { getFieldOwnerById } from '../controller/authFieldOwner.js';
import { acceptBooking, cancelBooking, getBookingNoti, markNotificationAsRead, deleteField, editFieldAttributes } from '../controller/field-owner.func.js';
import { updateRecommendedServices } from '../controller/field-owner.func.js';
import { deleteService, editService } from '../controller/field-owner.func.js';
// api/field_owner/
const router2 = Router();
router2.post('/register', register);
router2.post('/login', login);
router2.get("/", authenticateToken, getFieldOwner)
// router2.get("/:ownerId", getFieldOwnerById)
router2.post("/logout", logout)
router2.get("/fields", authenticateToken, getFieldDetails)
router2.get("/profile", authenticateToken, getProfile)
router2.put("/profile/update", authenticateToken, updateProfile)

router2.post('/accept/:bookingId', acceptBooking);
router2.post('/cancel/:bookingId', cancelBooking);

router2.get('/noti', authenticateToken, getBookingNoti);
router2.put('/notification/read/:notificationId', authenticateToken, markNotificationAsRead);

router2.get("/posted_fields", authenticateToken, getPostedFieldsCount)
router2.delete('/deleteField/:fieldId', authenticateToken, deleteField);
router2.put('/editField/:fieldId', authenticateToken, editFieldAttributes);
router2.put('/fields/:fieldId/recommended-services', authenticateToken, updateRecommendedServices);
router2.delete('/fields/:fieldId/services/:serviceId', authenticateToken, deleteService);
router2.put('/fields/:fieldId/services/:serviceId', authenticateToken, editService);
export default router2;
