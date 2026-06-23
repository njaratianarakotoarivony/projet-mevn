import crypto from 'crypto';
import { hash } from 'bcryptjs';
import User from '../../user/models/User.js';
import { sendEmail } from '../../email/emailService.js';

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure

// Hash du token stocké en base (on ne stocke jamais le token en clair).
const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// POST /api/reset/request-reset
// Génère un token, l'enregistre haché avec expiration, et envoie le lien par email.
const requestReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // On répond toujours de façon générique pour ne pas révéler les comptes existants.
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + TOKEN_TTL_MS);
      await user.save();

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
      const resetLink = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

      await sendEmail({
        to: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        text: `Pour réinitialiser votre mot de passe, ouvrez ce lien (valable 1 heure) : ${resetLink}`,
        html: `<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien (valable 1 heure) :</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      });
    }

    res.json({
      success: true,
      message: 'Si un compte existe pour cet email, un lien de réinitialisation a été envoyé.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/reset/reset-password
// Vérifie le token et met effectivement à jour le mot de passe.
const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Email, token et nouveau mot de passe requis' });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+resetPasswordToken +resetPasswordExpires'
    );

    if (
      !user ||
      !user.resetPasswordToken ||
      user.resetPasswordToken !== hashToken(token) ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    user.password = await hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    next(error);
  }
};

export { resetPassword, requestReset };
