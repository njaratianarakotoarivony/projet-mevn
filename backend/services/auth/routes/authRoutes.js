import { Router } from 'express';
const router = Router();
import _default from '../controllers/authController';
const { register, login } = _default;
import _default from '../middlewares/authMiddleware';
const { validateSignup, validateLogin } = _default;

router.post('/register', validateSignup, register);
router.post('/login', validateLogin, login);

export default router;
