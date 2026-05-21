import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';
import { verifyToken, checkAdmin } from '../middlewares/statsMiddleware.js';

const router = Router();

router.get('/', verifyToken, checkAdmin, getStats);

export default router;
