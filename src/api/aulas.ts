import { api } from './client';
import { Aula, IniciarAulaRequest } from '../types/aula';


export async function iniciarAulaApi(dados: IniciarAulaRequest): Promise<Aula> {
    // Função que inicia a aula
    const { data } = await api.post<Aula>('/aulas/iniciar', dados);
  return data;

  // Encerramento da aula
  export async function encerrarAulaApi(aulaId: string): Promise<Aula> {

    const { data } = await api.patch<Aula>(`/aulas/${aulaId}/encerrar`);
  return data;

  // Lista de aulas de uma disciplina
 export async function listarAulasApi(disciplinaId: string): Promise<Aula[]> {
  const { data } = await api.get<Aula[]>(`/aulas/disciplina/${disciplinaId}`);
  return data;
}