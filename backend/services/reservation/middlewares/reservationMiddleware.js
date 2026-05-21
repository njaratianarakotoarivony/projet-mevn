import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';

const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

const validateReservation = (req, res, next) => {
  const { roomId, userId, checkIn, checkOut, guests } = req.body;
  
  if (!roomId || !userId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
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

export { verifyToken, validateReservation };
