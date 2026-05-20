const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/rooms', require('./routes/room'));
app.use('/api/reservations', require('./routes/reservation'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/2fa', require('./routes/2fa'));
app.use('/api/reset', require('./routes/reset'));

app.get('/', (req, res) => {
  res.send('API de Gestion Hôtelière est en ligne.');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
