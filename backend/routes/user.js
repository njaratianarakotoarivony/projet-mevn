import { Router } from 'express';
const router = Router();
import { getUserById } from '../controllers/userController';
import auth from '../middleware/auth';

router.get('/:id', auth, getUserById);

export default router;
