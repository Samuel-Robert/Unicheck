import { create } from 'zustand';
import { AuthUser, Role } from '../types/auth';
import { salvarToken, lerToken, removerToken } from '../utils/storage';
import { decodificarToken, tokenExpirado } from '@/utils/tokenDecoder';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
    isAuthenticated: boolean;

    login: (token: string, userData: AuthUser) => Promise<void>;
    logout: () => Promise<void>;
    loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    login: async (token, userData) => {
        await salvarToken(token);
        set({ token, user: userData, isAuthenticated: true });
    },

    logout: async () => {
        await removerToken();
        set({ token: null, user: null, isAuthenticated: false });
    },

    loadFromStorage: async () => {
        const token = await lerToken();

        if (!token || tokenExpirado(token)) {
            await removerToken();
            set({ token: null, user: null, isAuthenticated: false });
            return;
        }

        const payload = decodificarToken(token);

        set({
            token,
            isAuthenticated: true,

            user: {
                id: '',
                nome: '',
                email: payload.sub,
                role: payload.role as Role,
                fotoUrl: null,
            },
        });
    },
}));