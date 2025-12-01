import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { JwtPayload } from '../types';
import { ACHIEVEMENTS, seedAchievements } from '../lib/achievement.service';

interface AuthRequest extends Request {
    user?: JwtPayload;
}

/**
 * GET /api/achievements
 * Get all available achievements
 */
export const getAchievements = async (req: Request, res: Response) => {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: [
                { category: 'asc' },
                { tier: 'asc' },
            ],
        });

        // If no achievements exist, seed them
        if (achievements.length === 0) {
            await seedAchievements();
            const seededAchievements = await prisma.achievement.findMany({
                orderBy: [
                    { category: 'asc' },
                    { tier: 'asc' },
                ],
            });

            // Add emoji icons from definitions
            const achievementsWithIcons = seededAchievements.map(ach => {
                const definition = ACHIEVEMENTS.find(a => a.key === ach.key);
                return {
                    ...ach,
                    icon: definition?.icon || '🏆',
                };
            });

            return res.json(achievementsWithIcons);
        }

        // Add emoji icons from definitions
        const achievementsWithIcons = achievements.map(ach => {
            const definition = ACHIEVEMENTS.find(a => a.key === ach.key);
            return {
                ...ach,
                icon: definition?.icon || '🏆',
            };
        });

        res.json(achievementsWithIcons);
    } catch (error) {
        logger.error('Error fetching achievements:', error);
        res.status(500).json({ message: 'Error fetching achievements' });
    }
};

/**
 * GET /api/achievements/user
 * Get user's unlocked achievements with metadata
 */
export const getUserAchievements = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.userId;

        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId },
            include: {
                achievement: true,
            },
            orderBy: { unlockedAt: 'desc' },
        });

        // Add emoji icons from definitions
        const achievementsWithIcons = userAchievements.map(ua => {
            const definition = ACHIEVEMENTS.find(a => a.key === ua.achievementKey);
            return {
                ...ua,
                achievement: {
                    ...ua.achievement,
                    icon: definition?.icon || '🏆',
                },
            };
        });

        res.json(achievementsWithIcons);
    } catch (error) {
        logger.error('Error fetching user achievements:', error);
        res.status(500).json({ message: 'Error fetching user achievements' });
    }
};
