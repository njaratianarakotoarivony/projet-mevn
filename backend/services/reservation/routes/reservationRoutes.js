const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations, getReservationById, cancelReservation } = require('../controllers/reservationController');
const { verifyToken, validateReservation } = require('../middlewares/reservationMiddleware');

router.post('/', verifyToken, validateReservation, createReservation);
router.get('/', verifyToken, getAllReservations);
router.get('/:id', verifyToken, getReservationById);
router.put('/:id/cancel', verifyToken, cancelReservation);

module.exports = router;
