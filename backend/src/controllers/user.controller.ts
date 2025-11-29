import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import { JwtPayload } from '../types';

interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { name, email } = req.body;
    const userId = req.user!.userId;

    try {
        // Validate at least one field is provided
        if (!name && !email) {
            return res.status(400).json({ message: 'At least one field (name or email) must be provided' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If email is being updated, check for conflicts
        if (email && email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email },
            });

            if (emailInUse) {
                return res.status(409).json({ message: 'Email already in use' });
            }
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                points: true,
                createdAt: true,
            },
        });

        logger.info(`User profile updated: ${userId}`);

        res.json({
            user: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        logger.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
