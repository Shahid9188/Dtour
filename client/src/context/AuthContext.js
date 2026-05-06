import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await authAPI.getMe();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to fetch user', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        fetchMe();
    }, []);

    const login = async (data) => {
        try {
            setError(null);
            const res = await authAPI.login(data);
            localStorage.setItem('token', res.token);
            setUser(res);
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (data) => {
        try {
            setError(null);
            const res = await authAPI.register(data);
            localStorage.setItem('token', res.token);
            setUser(res);
            return res;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updatePersonality = (personalityData) => {
        setUser(prev => ({
            ...prev,
            travelPersonality: personalityData.personality,
            personalityQuizAnswers: personalityData.answers
        }));
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePersonality,
        setUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
