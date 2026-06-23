import { Router } from 'express';
import { enroll2FA, verify2FA, disable2FA } from '../controllers/2faController.js';
import { verifyToken } from '../../../middlewares/auth.js';

const router = Router();

router.post('/enroll', verifyToken, enroll2FA);
router.post('/verify', verifyToken, verify2FA);
router.post('/disable', verifyToken, disable2FA);

export default router;
