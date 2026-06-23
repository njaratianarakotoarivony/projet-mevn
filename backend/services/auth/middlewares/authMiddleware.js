export { verifyToken } from '../../../middlewares/auth.js';

const validateSignup = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }

  next();
};

export { validateSignup, validateLogin };
