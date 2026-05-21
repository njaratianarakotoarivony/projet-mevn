import { Router } from 'express';
const router = Router();
import { processPayment } from '../services/payment/controllers/paymentController.js';
import { verifyToken } from '../services/payment/middlewares/paymentMiddleware.js';

router.post('/pay', verifyToken, processPayment);

export default router;
