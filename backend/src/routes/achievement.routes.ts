import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { getAchievements, getUserAchievements } from '../controllers/achievement.controller';

const router = express.Router();

// Get all available achievements (public)
router.get('/', getAchievements);

// Get user's unlocked achievements (protected)
router.get('/user', authenticateToken, getUserAchievements);

export default router;
