import { Router } from 'express';
const router = Router();
import { verify2FA } from '../controllers/2faController';

router.post('/verify-2fa', verify2FA);

export default router;
