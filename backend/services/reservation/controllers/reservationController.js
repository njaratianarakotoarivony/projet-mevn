import Reservation from '../models/Reservation.js';
import Room from '../../room/models/Room.js';

// Nombre de nuits entre deux dates (au moins 1).
const nights = (checkIn, checkOut) => {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
};

const createReservation = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;
    // userId provient du token, jamais du corps de la requête.
    const userId = req.user.userId;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chambre non trouvée' });
    }

    if (guests > room.capacity) {
      return res.status(400).json({ message: 'Capacité de la chambre dépassée' });
    }

    // Détection de chevauchement : une réservation active dont les dates
    // croisent l'intervalle demandé bloque la chambre.
    const overlap = await Reservation.findOne({
      roomId,
      status: 'confirmée',
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });
    if (overlap) {
      return res.status(409).json({ message: 'Chambre déjà réservée sur cette période' });
    }

    const totalPrice = room.price * nights(checkIn, checkOut);

    const reservation = new Reservation({
      roomId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'confirmée',
    });

    await reservation.save();

    // La chambre n'est plus disponible tant qu'une réservation active existe.
    await Room.findByIdAndUpdate(roomId, { available: false });

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

    // Libère la chambre s'il n'existe plus de réservation active sur celle-ci.
    const stillBooked = await Reservation.exists({
      roomId: reservation.roomId,
      status: 'confirmée',
    });
    if (!stillBooked) {
      await Room.findByIdAndUpdate(reservation.roomId, { available: true });
    }

    res.json(reservation);
  } catch (error) {
    next(error);
  }
};

export { createReservation, getAllReservations, getReservationById, cancelReservation };
