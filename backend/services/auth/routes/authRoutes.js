import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);

export default router;
