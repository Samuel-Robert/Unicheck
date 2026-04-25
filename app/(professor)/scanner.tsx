// Câmera para escanear QR Codes dos alunos.
// Funciona offline se não tiver internet ele salva na fila_sync.


import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { QrCodeScanner } from '../../src/components/QrCodeScanner';
import { PresencaConfirmModal } from '../../src/components/PresencaConfirmModal';
import { registrarPresencaApi } from '../../src/api/presencas';
import { inserirPresenca, existePresenca } from '../../src/database/presencasDao';
import { useOfflineStore } from '../../src/store/offlineStore';
import { isOnline } from '../../src/utils/networkUtils';
import { ConfirmacaoPresenca } from '../../src/types/presenca';

export default function ScannerTela() {
  // Lê o aulaId da query string: /scanner?aulaId=abc
  const { aulaId } = useLocalSearchParams<{ aulaId: string }>();
  const router = useRouter();
  const adicionarNaFila = useOfflineStore(s => s.adicionarNaFila);

  const [confirmacao, setConfirmacao] = useState<ConfirmacaoPresenca | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);

  // ─── Processar QR Code escaneado ───────────────────────────
  const handleScan = async (qrCode: string) => {
    // qrCode = UUID do aluno (lido do QR Code)

    // Verifica se já tem presença para este aluno nesta aula (evita dupla)
    if (existePresenca(qrCode, aulaId)) {
      return;   // ignora silenciosamente
    }

    if (await isOnline()) {
      // ── ONLINE: registra via API ──
      try {
        const resultado = await registrarPresencaApi({ qrCode, aulaId });
        // resultado = { nome, matricula, fotoUrl } do aluno

        // Salva localmente também (para histórico offline)
        inserirPresenca({
          id:           uuidv4(),
          alunoId:      qrCode,   // o qrCode é o UUID do aluno
          aulaId,
          dataHora:     new Date().toISOString(),
          sincronizado: true,
        });

        // Mostra o modal de confirmação com o nome do aluno
        setConfirmacao(resultado);
        setModalVisivel(true);

      } catch {
        // API falhou — salva offline como fallback
        salvarOffline(qrCode);
      }

    } else {
      // ── OFFLINE: salva localmente ──
      salvarOffline(qrCode);
    }
  };

  const salvarOffline = (alunoId: string) => {
    const id = uuidv4();
    // Salva na tabela presencas como não sincronizada
    inserirPresenca({
      id,
      alunoId,
      aulaId,
      dataHora: new Date().toISOString(),
      sincronizado: false,
    });
    // Adiciona na fila para enviar quando reconectar
    adicionarNaFila(id, 'REGISTRAR_PRESENCA', {
      alunoId,
      aulaId,
      dataHoraLocal: new Date().toISOString(),
    });
    // Mostra confirmação visual mesmo offline
    setConfirmacao({ nome: 'Presença salva offline', matricula: '', fotoUrl: null });
    setModalVisivel(true);
  };

  return (
    <View style={styles.container}>
      <QrCodeScanner
        onScan={handleScan}
        onClose={() => router.back()}   // router.back() volta para a tela anterior
      />

      {/* Modal de confirmação (aparece por 2s após cada scan) */}
      <PresencaConfirmModal
        visivel={modalVisivel}
        confirmacao={confirmacao}
        onFechar={() => setModalVisivel(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});