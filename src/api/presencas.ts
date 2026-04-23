//Adicionado api de presença e sicronização offline e dashboard
import { api } from './client';
import {
  RegistrarPresencaRequest,
  ConfirmacaoPresenca,
  SincronizacaoPresencaDTO,
} from '../types/presenca';


// Registra presença via QR Code(online) e retorna os dados do aluno.
export async function registrarPresencaApi(
  dados: RegistrarPresencaRequest
): Promise<ConfirmacaoPresenca> {
  const { data } = await api.post<ConfirmacaoPresenca>('/presencas/registrar', dados);
  return data;
}

// Sincroniza em lote as presenças coletadas offline.
export async function sincronizarApi(lista: SincronizacaoPresencaDTO[]): Promise<void> {
  // void = a API não retorna corpo na resposta (204 No Content)
  await api.post('/presencas/sincronizar', lista);
}

// Dashboard do professor com estatísticas da sua disciplina
export async function getDashboardApi(professorId: string) {
  const { data } = await api.get(`/presencas/dashboard/professor/${professorId}`);
  return data;
}

// Dashboard do gestor com todas as disciplinas e professores em geral
export async function getDashboardGestorApi() {
  const { data } = await api.get('/presencas/dashboard');
  return data;
}