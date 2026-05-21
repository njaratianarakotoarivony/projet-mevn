import { Router } from 'express';
import { getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { verifyToken } from '../middlewares/roomMiddleware.js';

const router = Router();

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

export default router;
