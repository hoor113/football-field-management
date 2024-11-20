import { Router } from 'express';
import { register, login, getFieldOwner, logout } from '../controller/authFieldOwner.js';
import { GetFields } from '../controller/field-owner.func.js';
import { authenticateToken } from '../controller/verify.js';


const router2 = Router();
router2.post('/register', register);
router2.post('/login', login);
router2.get("/", authenticateToken, getFieldOwner)
router2.post("/logout", logout)
router2.get("/fields", authenticateToken, GetFields)

export default router2;
