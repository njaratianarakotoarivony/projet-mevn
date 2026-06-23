import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import User from '../../user/models/User.js';

const ISSUER = 'Gestion Hôtelière';

// POST /api/2fa/enroll  (authentifié)
// Génère un secret TOTP, le stocke (2FA pas encore activé) et renvoie
// l'URL otpauth + un QR code à scanner dans une app type Google Authenticator.
const enroll2FA = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const secret = authenticator.generateSecret();
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false; // activé seulement après une vérification réussie
    await user.save();

    const otpauth = authenticator.keyuri(user.email, ISSUER, secret);
    const qrCode = await QRCode.toDataURL(otpauth);

    res.json({ otpauth, qrCode });
  } catch (error) {
    next(error);
  }
};

// POST /api/2fa/verify  (authentifié)  body: { code }
// Vérifie le code TOTP. Active la 2FA si ce n'était pas déjà fait.
const verify2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'Code requis' });
    }

    const user = await User.findById(req.user.userId).select('+twoFactorSecret');
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA non initialisée' });
    }

    const isValid = authenticator.verify({
      token: String(code),
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Code invalide' });
    }

    if (!user.twoFactorEnabled) {
      user.twoFactorEnabled = true;
      await user.save();
    }

    res.json({ success: true, message: '2FA vérifiée' });
  } catch (error) {
    next(error);
  }
};

// POST /api/2fa/disable  (authentifié)  body: { code }
// Désactive la 2FA après vérification d'un dernier code valide.
const disable2FA = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.userId).select('+twoFactorSecret');
    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA non activée' });
    }

    const isValid = authenticator.verify({
      token: String(code),
      secret: user.twoFactorSecret,
    });
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Code invalide' });
    }

    user.twoFactorSecret = undefined;
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ success: true, message: '2FA désactivée' });
  } catch (error) {
    next(error);
  }
};

export { enroll2FA, verify2FA, disable2FA };
