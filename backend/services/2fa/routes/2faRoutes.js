import { Router } from 'express';
import { verify2FA } from '../controllers/2faController.js';

const router = Router();

router.post('/verify-2fa', verify2FA);

export default router;
