const express = require('express');
const router = express.Router();
const { processPayment, refundPayment } = require('../controllers/paymentController');
const { verifyToken, validatePayment } = require('../middlewares/paymentMiddleware');

router.post('/pay', verifyToken, validatePayment, processPayment);
router.post('/refund', verifyToken, refundPayment);

module.exports = router;
