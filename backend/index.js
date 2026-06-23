// Charge les variables d'environnement AVANT tout autre import : certains
// modules (cors, gateway → controllers) lisent process.env au chargement.
import 'dotenv/config';

import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import validateEnv from './config/env.js';
import connectDB from './config/db.js';
import corsMiddleware from './middlewares/cors.js';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import gatewayRoutes from './routes/gateway.js';

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(corsMiddleware);
// Le webhook Stripe a besoin du corps brut : on l'exempte du parser JSON global.
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') return next();
  express.json()(req, res, next);
});
app.use(logger);

// Limiteur global de débit.
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Limiteur strict pour l'authentification (login/register/reset).
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives, réessayez plus tard.' },
});
app.use('/api/auth', authLimiter);
app.use('/api/reset', authLimiter);

app.use('/', gatewayRoutes);

// Gestionnaire d'erreurs — toujours après les routes.
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
