import { Router } from 'express';
const router = Router();
import { processPayment } from '../controllers/paymentController';
import auth from '../middleware/auth';

router.post('/pay', auth, processPayment);

export default router;
