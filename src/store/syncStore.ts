// Controla o status visual da sincronização.
// - sincronizando fica "Sincronizando..."
// - quando dá certo aparece: sucesso "Tudo sincronizado!" 
// - erro implícito: o item fica na fila com erro registrado

import { create } from 'zustand';

interface SyncState {
  sincronizando: boolean;           // está sincronizando agora?
  ultimaSincronizacao: Date | null; // quando foi a última vez (ou null = nunca)
  sucesso: boolean | null;          // null = nunca sincronizou, true = ok, false = erro

  iniciarSync: () => void;
  finalizarSync: (sucesso: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  sincronizando: false,
  ultimaSincronizacao: null,
  sucesso: null,

  // Chamado ao INICIAR o processamento da fila
  iniciarSync: () => set({
    sincronizando: true,
    sucesso: null,   // reset do resultado anterior
  }),

  // Chamado ao TERMINAR o processamento (com ou sem sucesso)
  finalizarSync: (sucesso) => set({
    sincronizando: false,
    ultimaSincronizacao: new Date(),   // registra o momento
    sucesso,
  }),
}));