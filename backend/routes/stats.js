import { Router } from 'express';
const router = Router();
import { getStats } from '../services/stats/controllers/statsController.js';
import { verifyToken } from '../services/stats/middlewares/statsMiddleware.js';

router.get('/', verifyToken, getStats);

export default router;
