import { Router } from 'express';
const router = Router();
import { resetPassword } from '../controllers/resetController';

router.post('/reset-password', resetPassword);

export default router;
