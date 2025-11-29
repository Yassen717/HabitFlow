// Shared TypeScript type definitions for frontend

export interface User {
    id: string;
    email: string;
    name: string | null;
    points: number;
    createdAt?: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

export interface Habit {
    id: string;
    title: string;
    description: string | null;
    frequency: 'daily' | 'weekly';
    logs: Log[];
    streak?: number;
    createdAt?: string;
}

export interface Log {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
}

export interface GetHabitsResponse {
    habits: Habit[];
    userPoints: number;
    pagination: PaginationMeta;
}

export interface CreateHabitData {
    title: string;
    description: string;
    frequency: string;
}

export interface UpdateHabitData {
    title: string;
    description: string;
    frequency: string;
}

export interface LogHabitResponse {
    log: Log;
    userPoints: number;
    message: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    message: string;
}
