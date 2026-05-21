import { Router } from 'express';
const router = Router();
import { getUserById } from '../services/user/controllers/userController.js';
import { verifyToken } from '../services/user/middlewares/userMiddleware.js';

router.get('/:id', verifyToken, getUserById);

export default router;
