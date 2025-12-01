import { apiClient, getAuthHeader } from './api';
import type { Habit, CreateHabitData, UpdateHabitData, GetHabitsResponse, LogHabitResponse, CreateHabitResponse } from '../types';

export const habitService = {
    getHabits: async (token: string, page: number = 1, limit: number = 10): Promise<GetHabitsResponse> => {
        const response = await apiClient.get<GetHabitsResponse>('/api/habits', {
            headers: getAuthHeader(token),
            params: { page, limit },
        });
        return response.data;
    },

    createHabit: async (token: string, data: CreateHabitData): Promise<CreateHabitResponse> => {
        const response = await apiClient.post<CreateHabitResponse>('/api/habits', data, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },

    updateHabit: async (token: string, id: string, data: UpdateHabitData): Promise<Habit> => {
        const response = await apiClient.put<Habit>(`/api/habits/${id}`, data, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },

    deleteHabit: async (token: string, id: string): Promise<void> => {
        await apiClient.delete(`/api/habits/${id}`, {
            headers: getAuthHeader(token),
        });
    },

    logHabit: async (token: string, id: string): Promise<LogHabitResponse> => {
        const response = await apiClient.post<LogHabitResponse>(`/api/habits/${id}/log`, {}, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },
};

export default habitService;
