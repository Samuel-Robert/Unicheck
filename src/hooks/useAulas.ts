// ele gerencia aulas com suporte completo offline:
// - iniciarAula: chama API se online, cria localmente se offline
// - encerrarAula: atualiza local imediatamente, API em background
// - carregar: SQLite primeiro, API em background

// Precisa de um ID, quando está offline, antes de mandar para a API que gera outro ID
// uuidv4() gera um UUID aleatório localmente: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
// Quando sincronizar com a API, o ID local pode ser substituído.

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// 'as uuidv4' = importa com um apelido (alias), mais legível que só 'v4'

import { Aula } from '../types/aula';
import {
  upsertAula,
  listarPorDisciplina,
  buscarAulaAtiva,
  encerrarAulaLocal,
} from '../database/aulasDao';
import { iniciarAulaApi, encerrarAulaApi, listarAulasApi } from '../api/aulas';
import { upsertDisciplina } from '../database/disciplinasDao';
import { upsertTurma } from '../database/turmasDao';
import { upsertProfessor } from '../database/professoresDao';
import { useOfflineStore } from '../store/offlineStore';
import { isOnline } from '../utils/networkUtils';

export function useAulas(disciplinaId: string) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [aulaAtiva, setAulaAtiva] = useState<Aula | null>(null);
  // aulaAtiva = a aula em andamento (ativa = true), ou null se não tiver
  const [loading, setLoading] = useState(true);

  // Pegamos apenas adicionarNaFila do offlineStore
  const adicionarNaFila = useOfflineStore(s => s.adicionarNaFila);

  useEffect(() => {
    if (disciplinaId) carregar();
  }, [disciplinaId]);

  // ─── Carregar ────────────────────────────────────────────
  async function carregar() {
    // Instantâneo: dados locais
    setAulas(listarPorDisciplina(disciplinaId));
    setAulaAtiva(buscarAulaAtiva(disciplinaId));
    setLoading(false);

    if (!(await isOnline())) return;

    try {
      const dados = await listarAulasApi(disciplinaId);
      dados.forEach(a => {
        // Salva relacionamentos antes da aula
        upsertTurma(a.disciplina.turma);
        upsertProfessor(a.disciplina.professor);
        upsertDisciplina(a.disciplina);
        upsertAula(a);
      });
      // Atualiza com dados frescos
      setAulas(listarPorDisciplina(disciplinaId));
      setAulaAtiva(buscarAulaAtiva(disciplinaId));
    } catch {}
  }

  //  Para iniciar a aula
  async function iniciarAula(titulo: string): Promise<Aula> {
    if (await isOnline()) {
      // ── CAMINHO ONLINE ──
      const aula = await iniciarAulaApi({ disciplinaId, titulo });
      // A API retorna a aula com ID gerado pelo servidor
      upsertAula(aula);         // salva localmente
      setAulaAtiva(aula);       // atualiza a UI imediatamente
      return aula;
    }

    // ── CAMINHO OFFLINE ──
    // Gera um ID local (temporário) para a aula
    const id = uuidv4();

    // Cria a aula localmente com status "pendente"
    const aulaLocal: Aula = {
      id,
      titulo,
      dataHora: new Date().toISOString(),   // hora atual do dispositivo
      ativa: true,
      // Pega a disciplina já salva no banco local
      disciplina: listarPorDisciplina(disciplinaId)[0]?.disciplina as any,
    };

    upsertAula(aulaLocal);
    // Adiciona na fila para sincronizar quando reconectar
    // O payload contém tudo que a API precisa para criar a aula
    adicionarNaFila(id, 'INICIAR_AULA', { disciplinaId, titulo, id });
    setAulaAtiva(aulaLocal);
    return aulaLocal;
  }

  // ─── Encerrar Aula ─────────────────────────────────────────
  async function encerrarAula(aulaId: string): Promise<void> {
    // Atualiza localmente IMEDIATAMENTE (ele não espera a API)
    // Isso garante UX responsiva — o usuário não espera
    encerrarAulaLocal(aulaId);   // UPDATE aulas SET ativa = 0
    setAulaAtiva(null);
    setAulas(listarPorDisciplina(disciplinaId));

    if (await isOnline()) {
      // Se online: confirma com a API em background
      await encerrarAulaApi(aulaId);
    } else {
      // Se offline: adiciona na fila para sincronizar depois
      // uuidv4() como ID do item da fila (não da aula)
      adicionarNaFila(uuidv4(), 'ENCERRAR_AULA', { aulaId });
    }
  }

  return { aulas, aulaAtiva, loading, iniciarAula, encerrarAula, refetch: carregar };
}