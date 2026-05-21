import { Router } from 'express';
import { createReservation, getAllReservations, getReservationById, cancelReservation } from '../controllers/reservationController.js';
import { verifyToken, validateReservation } from '../middlewares/reservationMiddleware.js';

const router = Router();

router.post('/', verifyToken, validateReservation, createReservation);
router.get('/', verifyToken, getAllReservations);
router.get('/:id', verifyToken, getReservationById);
router.put('/:id/cancel', verifyToken, cancelReservation);

export default router;
