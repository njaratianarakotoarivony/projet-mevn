import Reservation from '../models/Reservation.js';

const createReservation = async (req, res, next) => {
  try {
    const { roomId, userId, checkIn, checkOut, guests } = req.body;
    
    const reservation = new Reservation({
      roomId,
      userId,
      checkIn,
      checkOut,
      guests,
      status: 'confirmée',
    });
    
    await reservation.save();
    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    next(error);
  }
};

const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'annulée' },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

export { createReservation, getAllReservations, getReservationById, cancelReservation };
