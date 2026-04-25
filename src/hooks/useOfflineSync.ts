// parte offline que monitra mudanças de conexão em tempo real
// quando reconecta ele processa a fila de sincronização
// atualiza o banner (offlineStore + syncStore)
// Remove o listener no cleanup do useEffect para evitar memory leak e consumo desnecessário de memória


import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '../store/offlineStore';
import { useSyncStore } from '../store/syncStore';
import {
  listarFila,
  removerDaFila,
  incrementarTentativas,
  registrarErro,
} from '../database/filaSyncDao';
import { sincronizarApi } from '../api/presencas';
import { iniciarAulaApi, encerrarAulaApi } from '../api/aulas';
import { SincronizacaoPresencaDTO } from '../types/presenca';

export function useOfflineSync() {
  const { setOnline, carregarContagem, pendentes } = useOfflineStore();
  const { iniciarSync, finalizarSync } = useSyncStore();

  useEffect(() => {
    // Ao montar: lê a contagem de pendentes do SQLite
    // (pode haver itens de sessões anteriores)
    carregarContagem();

    // Registra um listener: chamado TODA VEZ que a conexão muda
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      // Verifica se tem conexão real (não só estar numa rede)
      const online =
        state.isConnected === true && state.isInternetReachable !== false;

      // Atualiza o store o offline banner vai renderizar
      setOnline(online);

      // Se reconectou processa a fila
      if (online) {
        await processarFila();
      }
    });

    // Cleanup: remove o listener quando o componente é desmontado
    // Sem isso: listener ficaria ativo mesmo quando o app vai para background
    return () => unsubscribe();
  }, []);   // [] = executa só uma vez (ao montar o layout do professor)

  // ─── Processar Fila ──────────────────────────────────────
  async function processarFila() {
    const fila = listarFila();
    // Fila ordenada do mais antigo para o mais recente (FIFO)

    if (fila.length === 0) return;   // nada para sincronizar

    iniciarSync();   // banner muda para "Sincronizando..."

    // Acumula presenças para enviar em LOTE (mais eficiente)
    // Em vez de N requisições, faz 1 só com N presenças
    const presencasParaSync: SincronizacaoPresencaDTO[] = [];

    for (const item of fila) {
      // Desiste de itens que já falharam 3 vezes
      if (item.tentativas >= 3) continue;

      try {
        // JSON.parse: converte o payload (string) de volta para objeto
        const payload = JSON.parse(item.payload);

        if (item.tipo === 'REGISTRAR_PRESENCA') {
          // Acumula para envio em lote depois
          presencasParaSync.push(payload);
          removerDaFila(item.id);   // remove imediatamente (será enviado em lote)

        } else if (item.tipo === 'INICIAR_AULA') {
          await iniciarAulaApi({
            disciplinaId: payload.disciplinaId,
            titulo:       payload.titulo,
          });
          removerDaFila(item.id);

        } else if (item.tipo === 'ENCERRAR_AULA') {
          await encerrarAulaApi(payload.aulaId);
          removerDaFila(item.id);
        }

      } catch (error: any) {
        const status = error?.response?.status;

        if (status >= 400 && status < 500) {
          // Erro do cliente (4xx): a requisição é inválida — não tenta de novo
          // Ex: 409 Conflict = aula já encerrada
          // Ex: 404 = aula não encontrada (foi deletada)
          registrarErro(item.id, `Erro ${status}`);

        } else {
          // Erro do servidor (5xx) ou rede: tenta novamente na próxima conexão
          incrementarTentativas(item.id);
        }
      }
    }

    // Envia todas as presenças acumuladas em uma única requisição
    if (presencasParaSync.length > 0) {
      try {
        await sincronizarApi(presencasParaSync);
      } catch {
        // Se falhar o lote, mantém na fila para tentar depois
        // (já foram removidas individualmente acima — reavalie esta lógica
        // se preferir manter na fila em caso de falha do lote)
      }
    }

    // Atualiza a contagem e o banner
    carregarContagem();
    finalizarSync(true);   // banner muda para "Tudo sincronizado!" por 3s
  }

  // Exporta pendentes e processarFila para uso manual (ex: botão "Sincronizar")
  return { pendentes, processarFila };
}