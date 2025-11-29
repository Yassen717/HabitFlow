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

export const userService = {
    updateProfile: async (token: string, data: UpdateProfileData): Promise<UpdateProfileResponse> => {
        const response = await apiClient.put<UpdateProfileResponse>('/api/users/profile', data, {
            headers: getAuthHeader(token),
        });
        return response.data;
    },
};

export default userService;
