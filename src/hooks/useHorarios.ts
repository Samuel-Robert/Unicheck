import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { HorarioAula } from '../types/horario';
import { listarPorDisciplina, upsertHorario } from '../database/horariosDao';
import { isOnline } from '../utils/networkUtils';

export function useHorarios(disciplinaId: string) {
  const [horarios, setHorarios] = useState<HorarioAula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (disciplinaId) carregar();
  }, [disciplinaId]);

  async function carregar() {
    setHorarios(listarPorDisciplina(disciplinaId));
    setLoading(false);

    if (!(await isOnline())) return;

    try {
      const { data } = await api.get<HorarioAula[]>(
        `/horarios/disciplina/${disciplinaId}`
      );
    
      data.forEach(h => upsertHorario(h));
      setHorarios(listarPorDisciplina(disciplinaId));
    } catch {}
  }

  return { horarios, loading, refetch: carregar };
}