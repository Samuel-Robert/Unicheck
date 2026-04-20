import { useState } from 'react';
import { router } from 'expo-router';
import { loginApi } from '../api/auth';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { decodificarToken } from '../utils/tokenDecoder';
import { isOnline } from '../utils/networkUtils';

export function useAuth() {

  const [loading, setLoading] = useState(false);

  const { login, logout, user } = useAuthStore();

  async function fazerLogin(email: string, senha: string): Promise<void> {
    setLoading(true);
    try {
      const token = await loginApi({ email, senha });

      const payload = decodificarToken(token);

      await login(token, {
        id: '',
        nome: '',
        email: payload.sub,
        role: payload.role as any,
        fotoUrl: null,
      });

      if (payload.role === 'ALUNO')          router.replace('/(aluno)');
      else if (payload.role === 'PROFESSOR') router.replace('/(professor)');
      else if (payload.role === 'GESTOR')    router.replace('/(gestor)');

    } finally {
      setLoading(false);
    }
  }

  async function fazerLogout(): Promise<void> {
    await logout();
    router.replace('/(auth)/login');
  }

  async function atualizarPerfil(dados: { nome?: string; senha?: string }): Promise<void> {

    if (!user?.id) return;

    const endpoint = user.role === 'ALUNO'
      ? `/alunos/${user.id}/perfil`
      : `/professores/${user.id}/perfil`;

    await api.put(endpoint, dados);
  }

  return { fazerLogin, fazerLogout, atualizarPerfil, loading, user };
}