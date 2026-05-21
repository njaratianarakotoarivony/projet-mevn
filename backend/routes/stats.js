import { Router } from 'express';
const router = Router();
import { getStats } from '../controllers/statsController';
import auth from '../middleware/auth';

router.get('/', auth, getStats);

export default router;
