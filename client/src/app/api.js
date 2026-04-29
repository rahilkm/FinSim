import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('finsim_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 globally (skip auth endpoints — login failures are expected 401s)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register');
        if (error.response?.status === 401 && !isAuthRoute) {
            localStorage.removeItem('finsim_token');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;
