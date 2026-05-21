import { Router } from 'express';
import { getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/userMiddleware.js';

const router = Router();

router.get('/:id', verifyToken, getUserById);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;
