import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { validateSignup, validateLogin, verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);
router.get('/me', verifyToken, me);

export default router;
