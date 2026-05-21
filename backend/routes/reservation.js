import { Router } from 'express';
const router = Router();
import { createReservation, getAllReservations } from '../services/reservation/controllers/reservationController.js';
import { verifyToken } from '../services/reservation/middlewares/reservationMiddleware.js';

router.post('/', verifyToken, createReservation);
router.get('/', verifyToken, getAllReservations);

export default router;
