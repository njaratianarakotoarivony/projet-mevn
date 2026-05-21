import cors from 'cors';

const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
});

export default corsMiddleware;
