import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterRequest, LoginRequest } from '../types';
import crypto from 'crypto';

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '15m', // Short-lived access token
        });

        const refreshToken = generateRefreshToken();
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        res.status(201).json({
            token,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, points: user.points },
            message: 'Registration successful'
        });
    } catch (error) {
        logger.error('Error during registration:', error);
        res.status(500).json({ message: 'Error creating account. Please try again.' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '15m', // Short-lived access token
        });

        const refreshToken = generateRefreshToken();
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        res.status(200).json({
            token,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, points: user.points },
            message: 'Login successful'
        });
    } catch (error) {
        logger.error('Error during login:', error);
        res.status(500).json({ message: 'Error logging in. Please try again.' });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }

    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken || storedToken.revoked) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        if (storedToken.expiresAt < new Date()) {
            return res.status(401).json({ message: 'Refresh token expired' });
        }

        // Generate new access token
        const newToken = jwt.sign({ userId: storedToken.userId }, process.env.JWT_SECRET as string, {
            expiresIn: '15m',
        });

        // Rotate refresh token
        const newRefreshToken = generateRefreshToken();

        // Revoke old token
        await prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });

        // Create new token
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: storedToken.userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });

        res.json({
            token: newToken,
            refreshToken: newRefreshToken,
            user: {
                id: storedToken.user.id,
                email: storedToken.user.email,
                name: storedToken.user.name,
                points: storedToken.user.points
            }
        });

    } catch (error) {
        logger.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Error refreshing token' });
    }
};

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        try {
            await prisma.refreshToken.update({
                where: { token: refreshToken },
                data: { revoked: true },
            });
        } catch (error) {
            // Ignore error if token not found
            logger.warn('Error revoking token during logout:', error);
        }
    }

    res.json({ message: 'Logged out successfully' });
};
