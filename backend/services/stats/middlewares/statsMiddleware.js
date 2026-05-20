const jwt = require('jsonwebtoken');
const User = require('../user/models/User');

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

const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Admin requis.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification des droits' });
  }
};

module.exports = { verifyToken, checkAdmin };
