import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import logger from '../lib/logger';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterRequest, LoginRequest } from '../types';
import crypto from 'crypto';

const generateRefreshToken = () => {
    return crypto.randomBytes(40).toString('hex');
};

const sleep = (ms: number) => new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
});

const isLocalDatabaseUrl = () => {
    const dbUrl = (process.env.DATABASE_URL || '').toLowerCase();
    return dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
};

const isLocalDevelopmentDb = () => {
    return process.env.NODE_ENV !== 'production' && isLocalDatabaseUrl();
};

const isTransientDbError = (error: unknown): boolean => {
    if (error instanceof Prisma.PrismaClientInitializationError) {
        return true;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return ['P1001', 'P1002', 'P1017', 'P2024'].includes(error.code);
    }

    return false;
};

const executeWithDbRetry = async <T>(
    operation: () => Promise<T>,
    context: string,
    maxRetries = 2,
): Promise<T> => {
    let attempt = 0;
    const effectiveMaxRetries = isLocalDevelopmentDb() ? 0 : maxRetries;

    while (true) {
        try {
            return await operation();
        } catch (error) {
            if (!isTransientDbError(error) || attempt >= effectiveMaxRetries) {
                throw error;
            }

            const delayMs = 1000 * (attempt + 1);
            logger.warn(`${context} failed due to transient database error. Retrying...`, {
                attempt: attempt + 1,
                maxRetries: effectiveMaxRetries,
                delayMs,
                error: error instanceof Error ? error.message : String(error),
            });

            await sleep(delayMs);
            attempt += 1;
        }
    }
};

const getAuthErrorResponse = (error: unknown, defaultMessage: string): { statusCode: number; message: string } => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { statusCode: 400, message: 'User already exists' };
        }

        if (error.code === 'P1001' || error.code === 'P1002' || error.code === 'P1017' || error.code === 'P2024') {
            if (isLocalDevelopmentDb()) {
                return {
                    statusCode: 503,
                    message: 'Local PostgreSQL is not running on localhost:5432. Start PostgreSQL or update DATABASE_URL in backend/.env.',
                };
            }

            return {
                statusCode: 503,
                message: 'Database is waking up. Please retry in a few seconds.',
            };
        }

        if (error.code === 'P2021' || error.code === 'P2022') {
            return {
                statusCode: 500,
                message: 'Database schema is out of date. Please run migrations and try again.',
            };
        }
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        if (isLocalDevelopmentDb()) {
            return {
                statusCode: 503,
                message: 'Local PostgreSQL is not running on localhost:5432. Start PostgreSQL or update DATABASE_URL in backend/.env.',
            };
        }

        return {
            statusCode: 503,
            message: 'Database is waking up. Please retry in a few seconds.',
        };
    }

    return { statusCode: 500, message: defaultMessage };
};

const logAuthError = (context: string, error: unknown) => {
    if (error instanceof Error) {
        logger.error(`${context}: ${error.message}`, {
            name: error.name,
            stack: error.stack,
        });
        return;
    }

    logger.error(`${context}: Unknown error`, { error });
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const refreshToken = generateRefreshToken();

        const user = await executeWithDbRetry(async () => {
            return prisma.$transaction(async (tx) => {
                const createdUser = await tx.user.create({
                    data: {
                        email: normalizedEmail,
                        password: hashedPassword,
                        name,
                    },
                });

                await tx.refreshToken.create({
                    data: {
                        token: refreshToken,
                        userId: createdUser.id,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    },
                });

                return createdUser;
            });
        }, 'register');

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '15m', // Short-lived access token
        });

        res.status(201).json({
            token,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, points: user.points },
            message: 'Registration successful'
        });
    } catch (error) {
        logAuthError('Error during registration', error);
        const { statusCode, message } = getAuthErrorResponse(error, 'Error creating account. Please try again.');
        res.status(statusCode).json({ message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const normalizedEmail = String(email).trim().toLowerCase();

    try {
        const user = await executeWithDbRetry(
            () => prisma.user.findUnique({ where: { email: normalizedEmail } }),
            'login:user lookup',
        );

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
            expiresIn: '15m', // Short-lived access token
        });

        const refreshToken = generateRefreshToken();
        await executeWithDbRetry(async () => {
            await prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: user.id,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                },
            });
        }, 'login:create refresh token');

        res.status(200).json({
            token,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, points: user.points },
            message: 'Login successful'
        });
    } catch (error) {
        logAuthError('Error during login', error);
        const { statusCode, message } = getAuthErrorResponse(error, 'Error logging in. Please try again.');
        res.status(statusCode).json({ message });
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
        const newToken = jwt.sign({ userId: storedToken.userId }, process.env.JWT_SECRET!, {
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
        logAuthError('Error refreshing token', error);
        const { statusCode, message } = getAuthErrorResponse(error, 'Error refreshing token');
        res.status(statusCode).json({ message });
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
