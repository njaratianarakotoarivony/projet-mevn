
import { Router } from 'express';
const router = Router();

router.use('/api/auth', (await import('../services/auth/routes/authRoutes.js')).default);
router.use('/api/reservations', (await import('../services/reservation/routes/reservationRoutes.js')).default);
router.use('/api/payment', (await import('../services/payment/routes/paymentRoutes.js')).default);
router.use('/api/rooms', (await import('../services/room/routes/roomRoutes.js')).default);
router.use('/api/users', (await import('../services/user/routes/userRoutes.js')).default);
router.use('/api/stats', (await import('../services/stats/routes/statsRoutes.js')).default);
router.use('/api/2fa', (await import('../services/2fa/routes/2faRoutes.js')).default);
router.use('/api/reset', (await import('../services/reset/routes/resetRoutes.js')).default);

router.get('/', (req, res) => {
  res.send('API de Gestion Hôtelière est en ligne.');
});

export default router;
