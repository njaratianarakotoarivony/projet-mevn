const express = require('express');
const router = express.Router();

router.use('/api/auth', require('../services/auth/routes/authRoutes'));
router.use('/api/reservations', require('../services/reservation/routes/reservationRoutes'));
router.use('/api/payment', require('../services/payment/routes/paymentRoutes'));
router.use('/api/rooms', require('../services/room/routes/roomRoutes'));
router.use('/api/users', require('../services/user/routes/userRoutes'));
router.use('/api/stats', require('../services/stats/routes/statsRoutes'));
router.use('/api/2fa', require('../services/2fa/routes/2faRoutes'));
router.use('/api/reset', require('../services/reset/routes/resetRoutes'));

router.get('/', (req, res) => {
  res.send('API de Gestion Hôtelière est en ligne.');
});

module.exports = router;
