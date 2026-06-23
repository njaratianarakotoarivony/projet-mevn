import { Router } from 'express';
import { getAvailableRooms, getAllRooms, getRoomById, createRoom, updateRoom, deleteRoom } from '../controllers/roomController.js';
import { verifyToken } from '../middlewares/roomMiddleware.js';

const router = Router();

router.get('/', getAllRooms);
// Doit précéder '/:id' pour ne pas être capturé comme un id.
router.get('/availability', getAvailableRooms);
router.get('/:id', getRoomById);
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

export default router;
