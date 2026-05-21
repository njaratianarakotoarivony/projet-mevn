import { Router } from 'express';
import { resetPassword, requestReset } from '../controllers/resetController.js';

const router = Router();

router.post('/reset-password', resetPassword);
router.post('/request-reset', requestReset);

export default router;
