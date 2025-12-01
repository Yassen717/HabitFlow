import api from './api';
import type { Achievement, UserAchievement } from '../types';

export const achievementService = {
    /**
     * Get all available achievements
     */
    getAchievements: async (): Promise<Achievement[]> => {
        const response = await api.get('/achievements');
        return response.data;
    },

    /**
     * Get user's unlocked achievements
     */
    getUserAchievements: async (token: string): Promise<UserAchievement[]> => {
        const response = await api.get('/achievements/user', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};
