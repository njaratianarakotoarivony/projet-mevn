import { Router } from 'express';
const router = Router();
import { getAllRooms, getRoomById } from '../controllers/roomController';

router.get('/', getAllRooms);
router.get('/:id', getRoomById);

export default router;
