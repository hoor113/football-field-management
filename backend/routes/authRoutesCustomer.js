import { Router } from 'express';
import { register, login, getCustomer, logout, getProfile, updateProfile } from '../controller/authCustomer.js';
import { authenticateToken } from '../controller/verify.js';
import { makeBooking } from '../controller/customer.func.js';
import { getBookedFieldsCount } from '../controller/authCustomer.js';

// api/customer/
const router1 = Router();
router1.post('/register', register);
router1.post('/login', login);
router1.get("/", authenticateToken, getCustomer)
router1.post("/logout", logout)
router1.post("/book", authenticateToken, makeBooking)
router1.get("/profile", authenticateToken, getProfile)
router1.put("/profile/update", authenticateToken, updateProfile)
router1.get("/booked-fields", authenticateToken, getBookedFieldsCount)

export default router1;
