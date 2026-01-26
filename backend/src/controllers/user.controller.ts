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

export const changePassword = async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    try {
        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password must be different from current password' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        logger.info(`Password changed for user: ${userId}`);

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
    const { defaultFrequency, notificationsEnabled } = req.body;
    const userId = req.user!.userId;

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                defaultFrequency,
                notificationsEnabled,
            },
        });

        logger.info(`Preferences updated for user: ${userId}`);
        res.json({ message: 'Preferences updated successfully' });
    } catch (error) {
        logger.error('Error updating preferences:', error);
        res.status(500).json({ message: 'Error updating preferences' });
    }
};

export const getPreferences = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                defaultFrequency: true,
                notificationsEnabled: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        logger.error('Error fetching preferences:', error);
        res.status(500).json({ message: 'Error fetching preferences' });
    }
};
