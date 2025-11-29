// Shared TypeScript types for backend

export interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string | null;
    points: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Habit {
    id: string;
    title: string;
    description: string | null;
    frequency: 'daily' | 'weekly';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Log {
    id: string;
    habitId: string;
    date: Date;
    completed: boolean;
}

export interface HabitWithLogs extends Habit {
    logs: Log[];
}

export interface HabitWithStreak extends HabitWithLogs {
    streak: number;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export interface GetHabitsResponse {
    habits: HabitWithStreak[];
    userPoints: number;
    pagination: PaginationMeta;
}

export interface CreateHabitRequest {
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly';
}

export interface UpdateHabitRequest {
    title: string;
    description?: string;
    frequency: 'daily' | 'weekly';
}

export interface LogHabitResponse {
    log: Log;
    userPoints: number;
    message: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        points: number;
    };
    message: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    name?: string;
    email?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
