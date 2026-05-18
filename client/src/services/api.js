import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    register: (data) => api.post('/auth/register', data).then(res => res.data),
    login: (data) => api.post('/auth/login', data).then(res => res.data),
    getMe: () => api.get('/auth/me').then(res => res.data),
    submitQuiz: (data) => api.post('/auth/quiz', data).then(res => res.data),
    updateProfile: (data) => api.put('/auth/profile', data).then(res => res.data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data).then(res => res.data),
    verifyOtp: (data) => api.post('/auth/verify-otp', data).then(res => res.data),
    resetPassword: (data) => api.post('/auth/reset-password', data).then(res => res.data),
};

export const tripAPI = {
    create: (data) => api.post('/trips', data).then(res => res.data),
    getAll: () => api.get('/trips').then(res => res.data),
    getById: (id) => api.get(`/trips/${id}`).then(res => res.data),
    update: (id, data) => api.put(`/trips/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/trips/${id}`).then(res => res.data),
    invite: (id, data) => api.post(`/trips/${id}/invite`, data).then(res => res.data),
    removeMember: (id, memberId) => api.delete(`/trips/${id}/members/${memberId}`).then(res => res.data),
    respondInvite: (token) => api.put(`/trips/invite/${token}`).then(res => res.data),
};

export const itineraryAPI = {
    getByTrip: (tripId) => api.get(`/itineraries/trip/${tripId}`).then(res => res.data),
    getById: (id) => api.get(`/itineraries/${id}`).then(res => res.data),
    updateDay: (id, data) => api.put(`/itineraries/${id}`, data).then(res => res.data),
    addActivity: (id, data) => api.post(`/itineraries/${id}/activity`, data).then(res => res.data),
    deleteActivity: (id, actId) => api.delete(`/itineraries/${id}/activity/${actId}`).then(res => res.data),
    toggleComplete: (id, actId) => api.put(`/itineraries/${id}/activity/${actId}/complete`).then(res => res.data),
};

export const expenseAPI = {
    add: (tripId, data) => api.post(`/expenses/trip/${tripId}`, data).then(res => res.data),
    getAll: (tripId) => api.get(`/expenses/trip/${tripId}`).then(res => res.data),
    getBalances: (tripId) => api.get(`/expenses/trip/${tripId}/balances`).then(res => res.data),
    settle: (expenseId) => api.put(`/expenses/${expenseId}/settle`).then(res => res.data),
    update: (expenseId, data) => api.put(`/expenses/${expenseId}`, data).then(res => res.data),
    delete: (expenseId) => api.delete(`/expenses/${expenseId}`).then(res => res.data),
};

export const aiAPI = {
    getQuizQuestions: () => api.get('/ai/quiz-questions').then(res => res.data),
    generateItinerary: (tripId) => api.post(`/ai/generate-itinerary/${tripId}`).then(res => res.data),
    replanDay: (itineraryId, data) => api.post(`/ai/replan/${itineraryId}`, data).then(res => res.data),
    chat: (tripId, data) => api.post(`/ai/chat/${tripId}`, data).then(res => res.data),
    budgetOptimize: (tripId) => api.get(`/ai/budget-optimize/${tripId}`).then(res => res.data),
};

export default api;
