import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from './lib/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Request timeout middleware (30 seconds)
const requestTimeout = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      logger.warn(`Request timeout: ${req.method} ${req.url}`);
      res.status(408).json({ message: 'Request timeout' });
    }
  }, 30000); // 30 seconds

  res.on('finish', () => clearTimeout(timeout));
  next();
};

import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';

app.use(cors());
app.use(express.json());
app.use(requestTimeout);

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.get('/', (req, res) => {
  res.send('Smart Habit Tracker API is running!');
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
