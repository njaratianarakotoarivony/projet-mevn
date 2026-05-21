import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import gatewayRoutes from './routes/gateway.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/', gatewayRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
