import { Router } from 'express';
const router = Router();
import { verify2FA } from '../services/2fa/controllers/2faController.js';

router.post('/verify-2fa', verify2FA);

export default router;
