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

const validatePayment = (req, res, next) => {
  const { amount, currency } = req.body;
  
  if (!amount || !currency) {
    return res.status(400).json({ message: 'Montant et devise requis' });
  }
  
  if (amount <= 0) {
    return res.status(400).json({ message: 'Le montant doit être positif' });
  }
  
  const validCurrencies = ['eur', 'usd', 'gbp'];
  if (!validCurrencies.includes(currency.toLowerCase())) {
    return res.status(400).json({ message: 'Devise invalide' });
  }
  
  next();
};

export { verifyToken, validatePayment };
