const express = require('express');
const router = express.Router();
const { createReservation, getAllReservations } = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.post('/', auth, createReservation);
router.get('/', auth, getAllReservations);

module.exports = router;
