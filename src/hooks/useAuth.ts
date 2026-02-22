import { useState, useCallback } from 'react';
import type { User } from '../types';

export const useAuth = () => {
    const [user, setUserState] = useState<User | null>(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserState(null);
        window.location.href = '/login';
    }, []);

    const isAuthenticated = !!localStorage.getItem('token');

    return {
        user,
        isAuthenticated,
        logout,
        role: user?.role || null
    };
};
