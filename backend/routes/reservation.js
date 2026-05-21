import { Router } from 'express';
const router = Router();
import { createReservation, getAllReservations } from '../controllers/reservationController';
import auth from '../middleware/auth';

router.post('/', auth, createReservation);
router.get('/', auth, getAllReservations);

export default router;
