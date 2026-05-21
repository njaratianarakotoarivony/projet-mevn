const verify2FA = (req, res, next) => {
  try {
    const { code, userId } = req.body;
    
    if (!code || !userId) {
      return res.status(400).json({ message: 'Code et userId requis' });
    }
    
    // Logique de vérification 2FA simplifiée
    // En production, utiliser une vraie implémentation 2FA (ex: Google Authenticator)
    if (code === '123456') {
      res.json({ success: true, message: '2FA vérifié' });
    } else {
      res.status(401).json({ success: false, message: 'Code invalide' });
    }
  } catch (error) {
    next(error);
  }
};

export { verify2FA };
