import axios from 'axios';
import { BASE_URL } from '@/constants/endpoints';
import { lerToken, removerToken } from '@/utils/storage';
import { router } from 'expo-router';

export const api = axios.create({
    baseURL: BASE_URL,

    timeout: 10000,

    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await lerToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await removerToken();
            router.replace('/(auth)/login');
        }
        return Promise.reject(error);
    }
);