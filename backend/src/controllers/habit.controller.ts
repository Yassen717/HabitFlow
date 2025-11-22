import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user?: any;
}

export const getHabits = async (req: AuthRequest, res: Response) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.user.userId },
            include: { logs: true },
        });
        res.json(habits);
    } catch (error) {
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
        await prisma.user.update({
            where: { id: req.user.userId },
            data: { points: { increment: 10 } },
        });

        res.json(log);
    } catch (error) {
        res.status(500).json({ message: 'Error logging habit' });
    }
};
