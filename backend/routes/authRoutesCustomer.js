import { Router } from 'express';
import { register, login } from '../controller/authCustomer.js';

const router1 = Router();
router1.post('/register', register);
router1.post('/login', login);

export default router1;
