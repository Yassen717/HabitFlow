import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { JwtPayload, Log } from '../types';
import { checkAchievements } from '../lib/achievement.service';

interface AuthRequest extends Request {
    user?: JwtPayload; // Set by authenticateToken middleware
}

// Helper function to calculate streak
const calculateStreak = (logs: Log[]): number => {
    if (logs.length === 0) return 0;

    // Sort logs by date descending
    const sortedLogs = logs
        .map(log => new Date(log.date))
        .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's a log for today or yesterday
    const lastLogDate = new Date(sortedLogs[0]);
    lastLogDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today.getTime() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24));

    // If last log is more than 1 day ago, streak is broken
    if (diffDays > 1) return 0;

    // Calculate streak by checking consecutive days
    let expectedDate = new Date(lastLogDate);
    for (const logDate of sortedLogs) {
        const currentDate = new Date(logDate);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate.getTime() === expectedDate.getTime()) {
            streak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else if (currentDate.getTime() < expectedDate.getTime()) {
            break;
        }
    }

    return streak;
};


export const getHabits = async (req: AuthRequest, res: Response) => {
    try {
        // Pagination constants
        const MAX_LIMIT = 50; // Maximum items per page
        const DEFAULT_LIMIT = 10;
        const MIN_PAGE = 1;

        // Parse pagination parameters with validation
        const requestedLimit = parseInt(req.query.limit as string) || DEFAULT_LIMIT;
        const limit = Math.min(Math.max(requestedLimit, 1), MAX_LIMIT); // Cap at MAX_LIMIT
        const requestedPage = parseInt(req.query.page as string) || MIN_PAGE;
        const page = Math.max(requestedPage, MIN_PAGE); // Ensure page is at least 1
        const skip = (page - 1) * limit;

        const [habits, totalCount, user] = await Promise.all([
            prisma.habit.findMany({
                where: { userId: req.user!.userId },
                include: { logs: true },
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.habit.count({
                where: { userId: req.user!.userId },
            }),
            prisma.user.findUnique({
                where: { id: req.user!.userId },
                select: { points: true },
            }),
        ]);

        // Add streak calculation to each habit
        const habitsWithStreak = habits.map(habit => ({
            ...habit,
            streak: calculateStreak(habit.logs),
        }));

        res.json({
            habits: habitsWithStreak,
            userPoints: user?.points || 0,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        logger.error('Error fetching habits:', error);
        res.status(500).json({ message: 'Error fetching habits' });
    }
};

export const createHabit = async (req: AuthRequest, res: Response) => {
    const { title, description, frequency } = req.body;
    try {
        const habit = await prisma.habit.create({
            data: {
                title,
                description,
                frequency,
                userId: req.user!.userId,
            },
        });

        // Check for habit creation achievements
        const habitCount = await prisma.habit.count({
            where: { userId: req.user!.userId },
        });

        const newAchievements = await checkAchievements(req.user!.userId, {
            totalHabits: habitCount,
        });

        res.status(201).json({
            habit,
            newAchievements,
        });
    } catch (error) {
        logger.error('Error creating habit:', error);
        res.status(500).json({ message: 'Error creating habit' });
    }
};

export const updateHabit = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, frequency } = req.body;
    try {
        // Check if habit exists and belongs to user
        const habit = await prisma.habit.findUnique({
            where: { id },
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.userId !== req.user!.userId) {
            return res.status(403).json({ message: 'You do not have permission to update this habit' });
        }

        // Update the habit
        const updatedHabit = await prisma.habit.update({
            where: { id },
            data: {
                title,
                description,
                frequency,
            },
            include: { logs: true },
        });

        // Add streak calculation
        const habitWithStreak = {
            ...updatedHabit,
            streak: calculateStreak(updatedHabit.logs),
        };

        res.json(habitWithStreak);
    } catch (error) {
        logger.error('Error updating habit:', error);
        res.status(500).json({ message: 'Error updating habit' });
    }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        // Check if habit exists and belongs to user
        const habit = await prisma.habit.findUnique({
            where: { id },
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.userId !== req.user!.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this habit' });
        }

        await prisma.habit.delete({
            where: { id },
        });

        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        logger.error('Error deleting habit:', error);
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

export const logHabit = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { note } = req.body; // Extract optional note
    try {
        // Check if habit exists and belongs to user
        const habit = await prisma.habit.findUnique({
            where: { id },
            include: { logs: true },
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.userId !== req.user!.userId) {
            return res.status(403).json({ message: 'You do not have permission to log this habit' });
        }

        // Check if habit was already logged today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const alreadyLoggedToday = habit.logs.some(log => {
            const logDate = new Date(log.date);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === today.getTime();
        });

        if (alreadyLoggedToday) {
            return res.status(400).json({ message: 'Habit already logged for today' });
        }

        const log = await prisma.log.create({
            data: {
                habitId: id,
                completed: true,
                note: note || null, // Store the optional note
            },
        });

        // Update user points for habit completion
        const updatedUser = await prisma.user.update({
            where: { id: req.user!.userId },
            data: { points: { increment: 10 } },
            select: { points: true },
        });

        // Calculate current streak for this habit
        const updatedHabit = await prisma.habit.findUnique({
            where: { id },
            include: { logs: true },
        });
        const currentStreak = updatedHabit ? calculateStreak(updatedHabit.logs) : 0;

        // Get total completions
        const totalCompletions = await prisma.log.count({
            where: { habit: { userId: req.user!.userId } },
        });

        // Check for achievements
        const newAchievements = await checkAchievements(req.user!.userId, {
            currentStreak,
            totalPoints: updatedUser.points,
            totalCompletions,
        });

        // Calculate final points including achievement bonuses
        const achievementPoints = newAchievements.reduce((sum, a) => sum + a.pointsAwarded, 0);
        const finalPoints = updatedUser.points + achievementPoints;

        res.json({
            log,
            userPoints: finalPoints,
            message: 'Habit logged successfully! +10 points',
            newAchievements,
        });
    } catch (error) {
        logger.error('Error logging habit:', error);
        res.status(500).json({ message: 'Error logging habit' });
    }
};
