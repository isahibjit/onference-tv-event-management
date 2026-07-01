import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import eventRoutes from './routes/event.routes';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';

const app = express();

app.use(cors({
  origin: [env.FRONTEND_URL, 'https://onference-tv-event-management.onrender.com'],
}));
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
