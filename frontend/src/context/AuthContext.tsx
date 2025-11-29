import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../services/authService';

interface User {
    id: string;
    email: string;
    name: string | null;
    points: number;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, refreshToken: string, user: User) => void;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => void;
    isAuthenticated: boolean;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    useEffect(() => {
        if (token) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, [token]);

    // Set up axios interceptor for automatic token refresh on 401
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If 401 and we haven't tried to refresh yet
                if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
                    originalRequest._retry = true;

                    const success = await refreshAccessToken();
                    if (success) {
                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
                        return axios(originalRequest);
                    }
                }

                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [refreshToken]);

    const refreshAccessToken = async (): Promise<boolean> => {
        const currentRefreshToken = localStorage.getItem('refreshToken');
        if (!currentRefreshToken) {
            return false;
        }

        try {
            const { token: newToken, refreshToken: newRefreshToken, user: userData } =
                await authService.refreshToken(currentRefreshToken);

            setToken(newToken);
            setRefreshToken(newRefreshToken);
            setUser(userData);

            localStorage.setItem('token', newToken);
            localStorage.setItem('refreshToken', newRefreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, log out the user
            await logout();
            return false;
        }
    };

    const login = (newToken: string, newRefreshToken: string, newUser: User) => {
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = async () => {
        const currentRefreshToken = localStorage.getItem('refreshToken');

        // Revoke refresh token on server
        if (currentRefreshToken) {
            try {
                await authService.logout(currentRefreshToken);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        setToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser,
                refreshAccessToken,
                isAuthenticated: !!token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
