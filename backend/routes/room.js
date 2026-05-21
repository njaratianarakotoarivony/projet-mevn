import { Router } from 'express';
const router = Router();
import { getAllRooms, getRoomById } from '../services/room/controllers/roomController.js';

router.get('/', getAllRooms);
router.get('/:id', getRoomById);

export default router;
