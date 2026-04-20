import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { Presenca } from '../types/presenca';
import { listarPorAluno, inserirPresenca } from '../database/presencasDao';
import { isOnline } from '../utils/networkUtils';

export function usePresencas(alunoId: string) {
  const [presencas, setPresencas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (alunoId) carregar();
  }, [alunoId]);

  async function carregar() {
    const local = listarPorAluno(alunoId);
    setPresencas(local);
    setLoading(false);

    if (!(await isOnline())) return;

    try {
      const { data } = await api.get<Presenca[]>(`/presencas/aluno/${alunoId}`);
      data.forEach(p => {
        inserirPresenca({
          id:           p.id,
          alunoId:      p.aluno.id,
          aulaId:       p.aula.id,
          dataHora:     p.dataHora,
          sincronizado: true,
        });
      });

      setPresencas(listarPorAluno(alunoId));
    } catch {}
  }

  return { presencas, loading, refetch: carregar };
}