import { Router } from 'express';
import { processPayment, refundPayment } from '../controllers/paymentController.js';
import { verifyToken, validatePayment } from '../middlewares/paymentMiddleware.js';

const router = Router();

router.post('/pay', verifyToken, validatePayment, processPayment);
router.post('/refund', verifyToken, refundPayment);

export default router;
