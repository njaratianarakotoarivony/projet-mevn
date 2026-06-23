// Réexporte les middlewares d'authentification/autorisation partagés.
// (checkAdmin conservé comme alias de requireAdmin pour les routes existantes.)
export { verifyToken, requireAdmin as checkAdmin } from '../../../middlewares/auth.js';
