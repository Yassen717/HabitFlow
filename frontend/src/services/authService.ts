import { apiClient } from './api';

interface LoginResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        points: number;
    };
    message: string;
}

interface RegisterResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        points: number;
    };
    message: string;
}

interface RefreshTokenResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        points: number;
    };
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/api/auth/login', {
            email,
            password,
        });
        return response.data;
    },

    register: async (email: string, password: string, name?: string): Promise<RegisterResponse> => {
        const response = await apiClient.post<RegisterResponse>('/api/auth/register', {
            email,
            password,
            name,
        });
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
        const response = await apiClient.post<RefreshTokenResponse>('/api/auth/refresh', {
            refreshToken,
        });
        return response.data;
    },

    logout: async (refreshToken: string): Promise<void> => {
        await apiClient.post('/api/auth/logout', {
            refreshToken,
        });
    },
};

export default authService;
