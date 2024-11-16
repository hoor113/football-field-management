import { Router } from 'express';
import { register, login, getCustomer, logout } from '../controller/authCustomer.js';
import { authenticateToken } from '../controller/verify.js';

const router1 = Router();
router1.post('/register', register);
router1.post('/login', login);
router1.get("/", authenticateToken, getCustomer)
router1.post("/logout", logout)

export default router1;
