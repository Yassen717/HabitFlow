import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

export const getHabits = async (req: AuthRequest, res: Response) => {
    try {
        // Parse pagination parameters with defaults
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [habits, totalCount, user] = await Promise.all([
            prisma.habit.findMany({
                where: { userId: req.user.userId },
                include: { logs: true },
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.habit.count({
                where: { userId: req.user.userId },
            }),
            prisma.user.findUnique({
                where: { id: req.user.userId },
                select: { points: true },
            }),
        ]);

        res.json({
            habits,
            userPoints: user?.points || 0,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching habits:', error);
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
                userId: req.user.userId,
            },
        });
        res.status(201).json(habit);
    } catch (error) {
        console.error('Error creating habit:', error);
        res.status(500).json({ message: 'Error creating habit' });
    }
};

export const deleteHabit = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.habit.delete({
            where: { id },
        });
        res.json({ message: 'Habit deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

export const logHabit = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    try {
        const log = await prisma.log.create({
            data: {
                habitId: id,
                completed: true,
            },
        });

        // Update user points
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { points: { increment: 10 } },
            select: { points: true },
        });

        res.json({ log, userPoints: updatedUser.points });
    } catch (error) {
        res.status(500).json({ message: 'Error logging habit' });
    }
};
