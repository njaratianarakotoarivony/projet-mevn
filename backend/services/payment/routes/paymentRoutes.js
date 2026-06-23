import { Router } from 'express';
import express from 'express';
import { processPayment, refundPayment, handleWebhook } from '../controllers/paymentController.js';
import { verifyToken, validatePayment } from '../middlewares/paymentMiddleware.js';

const router = Router();

router.post('/pay', verifyToken, validatePayment, processPayment);
router.post('/refund', verifyToken, refundPayment);

// Webhook Stripe : corps brut requis pour la vérification de signature.
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
