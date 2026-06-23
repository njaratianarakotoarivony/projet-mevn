export { verifyToken } from '../../../middlewares/auth.js';

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

export { validatePayment };
