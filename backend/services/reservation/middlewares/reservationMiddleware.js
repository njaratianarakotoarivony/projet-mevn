export { verifyToken } from '../../../middlewares/auth.js';

const validateReservation = (req, res, next) => {
  // userId provient du token (req.user), pas du corps de la requête.
  const { roomId, checkIn, checkOut, guests } = req.body;

  if (!roomId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
    return res.status(400).json({ message: 'Dates invalides' });
  }

  if (checkInDate >= checkOutDate) {
    return res.status(400).json({ message: 'La date de départ doit être après la date d\'arrivée' });
  }

  if (checkInDate < new Date()) {
    return res.status(400).json({ message: 'La date d\'arrivée doit être dans le futur' });
  }

  if (guests < 1) {
    return res.status(400).json({ message: 'Le nombre de guests doit être au moins 1' });
  }

  next();
};

export { validateReservation };
