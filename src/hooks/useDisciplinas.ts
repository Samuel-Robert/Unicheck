import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Disciplina } from '../types/disciplina';
import {
  listarDisciplinas,
  listarPorTurma,
  upsertDisciplina,
} from '../database/disciplinasDao';
import { upsertTurma } from '../database/turmasDao';
import { upsertProfessor } from '../database/professoresDao';
import { isOnline } from '../utils/networkUtils';

export function useDisciplinas(turmaId?: string) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    carregar();
  }, [turmaId]);

  async function carregar() {
    const local = turmaId
      ? listarPorTurma(turmaId)
      : listarDisciplinas();

    setDisciplinas(local);
    setLoading(false);

    if (!(await isOnline())) return;

    try {
      const { data } = await api.get<Disciplina[]>('/disciplinas');
      data.forEach(d => {
        upsertTurma(d.turma);
        upsertProfessor(d.professor);
        upsertDisciplina(d);
      });

      const atualizado = turmaId ? listarPorTurma(turmaId) : listarDisciplinas();
      setDisciplinas(atualizado);

    } catch {
      
    }
  }

  return { disciplinas, loading, refetch: carregar };
}