import { Router } from 'express';
import { register, login } from '../controller/authFieldOwner.js';

const router2 = Router();
router2.post('/register', register);
router2.post('/login', login);

export default router2;
