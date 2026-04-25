import { api } from './client';
import { HorarioAula, HorarioRequest } from '../types/horario';

// Cria um novo horário para uma disciplina
export async function criarHorarioApi(dados: HorarioRequest): Promise<HorarioAula> {
  const { data } = await api.post<HorarioAula>('/horarios', dados);
  return data;
}

// Atualiza um horário que existe
export async function atualizarHorarioApi(id: string, dados: HorarioRequest): Promise<HorarioAula> {
  const { data } = await api.put<HorarioAula>(`/horarios/${id}`, dados);
  return data;
}

// Remove o horário
export async function deletarHorarioApi(id: string): Promise<void> {
  await api.delete(`/horarios/${id}`);
}