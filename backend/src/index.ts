import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import logger from './lib/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting configuration
// Strict rate limiter for authentication endpoints to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      message: 'Too many authentication attempts. Please try again later.',
    });
  },
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    message: 'Too many requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

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
import userRoutes from './routes/user.routes';
import achievementRoutes from './routes/achievement.routes';

// Configure CORS with environment-based origins
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable (comma-separated)
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
      : ['http://localhost:5173', 'http://localhost:5174']; // Default for development

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestTimeout);

// Apply rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', apiLimiter); // Apply to all API routes

app.use('/api/habits', habitRoutes);
app.use('/api/users', userRoutes);
app.use('/api/achievements', achievementRoutes);

app.get('/', (req, res) => {
  res.send('Smart Habit Tracker API is running!');
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
