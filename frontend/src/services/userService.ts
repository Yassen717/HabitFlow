import { apiClient, getAuthHeader } from './api';

interface UpdateProfileData {
    name?: string;
    email?: string;
}

interface UpdateProfileResponse {
    user: {
        id: string;
        email: string;
        name: string | null;
        points: number;
        createdAt: string;
    };
    message: string;
}

interface UserPreferences {
    defaultFrequency: 'daily' | 'weekly';
    notificationsEnabled: boolean;
}

export const userService = {
    updateProfile: async (token: string, data: UpdateProfileData): Promise<UpdateProfileResponse> => {
        const response = await apiClient.put<UpdateProfileResponse>('/api/users/profile', data, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },

    changePassword: async (token: string, data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> => {
        const response = await apiClient.put<{ message: string }>('/api/users/password', data, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },

    updatePreferences: async (token: string, preferences: UserPreferences): Promise<{ message: string }> => {
        const response = await apiClient.put<{ message: string }>('/api/users/preferences', preferences, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },

    getPreferences: async (token: string): Promise<UserPreferences> => {
        const response = await apiClient.get<UserPreferences>('/api/users/preferences', {
            headers: getAuthHeader(token),
        });
        return response.data;
    },
};

export default userService;
