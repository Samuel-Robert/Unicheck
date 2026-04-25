// Mantém em memória:
// - isOnline: se o dispositivo tem internet agora
// - pendentes: quantos itens estão na fila_sync aguardando envio
// Os dados reais ficam no SQLite. Este store é só para a UI reagir
// e mostrar badges, banners, etc.

import { create } from 'zustand';
import { contarPendentes, inserirNaFila } from '../database/filaSyncDao';

interface OfflineState {
  isOnline: boolean;   // true = tem internet, false = não tem internet = offline
  pendentes: number;   // quantidade de itens aguardando sync

  setOnline: (online: boolean) => void;
  adicionarNaFila: (id: string, tipo: string, payload: object) => void;
  carregarContagem: () => void;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: true,    // o NetInfo atualiza logo
  pendentes: 0,

  // ele notifica quando o NetInfo detecta mudança da conexão
  setOnline: (online) => set({ isOnline: online }),

  adicionarNaFila: (id, tipo, payload) => {
    inserirNaFila(id, tipo, payload);   // persiste no banco
    set({ pendentes: get().pendentes + 1 });
    // get().pendentes = lê o valor atual antes de incrementar
    // set() = atualiza o estado e dispara re-render
  },

  // Lê a contagem real do SQLite (chamado ao abrir o app)
  // Necessário porque os pendentes sobrevivem ao app fechar
  carregarContagem: () => {
    set({ pendentes: contarPendentes() });
  },
}));