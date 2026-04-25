// Busca estatísticas de presença.
// usa endpoint diferente para GESTOR vs PROFESSOR.
// O gestor quer ver TODOS os professores.
// O professor quer ver só as SUAS disciplinas.


import { useState, useEffect } from 'react';
import { DashboardDisciplina } from '../types/dashboard';
import { getDashboardApi, getDashboardGestorApi } from '../api/presencas';
import { useAuthStore } from '../store/authStore';
import { isOnline } from '../utils/networkUtils';

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardDisciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(s => s.user);

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    setLoading(true);

    // Dashboard não tem dados offline (depende do servidor)
    // Se sem internet: mostra vazio com loading=false
    if (!(await isOnline())) {
      setLoading(false);
      return;
    }

    try {
      let dados: DashboardDisciplina[];

      // Escolhe o endpoint conforme a role
      if (user?.role === 'GESTOR') {
        // Gestor vê todos: GET /presencas/dashboard
        dados = await getDashboardGestorApi();
      } else {
        // Professor vê só as dele: GET /presencas/dashboard/professor/{id}
        dados = await getDashboardApi(user?.id ?? '');
      }

      setDashboard(dados);
    } catch {}

    setLoading(false);
  }

  return { dashboard, loading, refetch: carregar };
}