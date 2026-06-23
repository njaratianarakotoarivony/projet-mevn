import jwt from 'jsonwebtoken';
import User from '../services/user/models/User.js';

// Secret lu à l'usage (pas de fallback en dur) — la présence est validée au
// démarrage par config/env.js.
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET non défini dans l’environnement.');
  }
  return secret;
};

// Signe un token applicatif. Centralise la durée de vie et le secret.
const signToken = (payload, options = { expiresIn: '1h' }) =>
  jwt.sign(payload, getSecret(), options);

// Middleware d'authentification partagé par tous les services.
const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    req.user = jwt.verify(token, getSecret());
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Autorise uniquement les comptes admin. À utiliser après verifyToken.
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Admin requis.' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export { verifyToken, requireAdmin, signToken };
