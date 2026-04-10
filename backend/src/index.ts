import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import router from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Muitas requisições. Tente novamente em 15 minutos.' },
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', router);

// 404
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

// Error handler
app.use(errorHandler as any);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Environment: ${env.NODE_ENV}`);
});

export default app;
