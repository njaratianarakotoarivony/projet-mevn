import { Router } from 'express';
const router = Router();
import { resetPassword } from '../services/reset/controllers/resetController.js';

router.post('/reset-password', resetPassword);

export default router;
