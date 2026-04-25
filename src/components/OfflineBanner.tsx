// - offlineStore: para saber se está online e quantos pendentes
// - syncStore: para saber se está sincronizando e se teve sucesso
// useEffect para efeitos temporários
// Quando a sync termina com sucesso, mostramos "Tudo sincronizado!" por alguns segundos.
// Usado useEffect para detectar quando 'sucesso' muda para true,


import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOfflineStore } from '../store/offlineStore';
import { useSyncStore } from '../store/syncStore';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

export function OfflineBanner() {
  // Lê o estado dos stores
  const { isOnline, pendentes } = useOfflineStore();
  const { sincronizando, sucesso } = useSyncStore();

  // Estado local que controla se mostra o banner de sucesso temporário
  const [mostrarSucesso, setMostrarSucesso] = useState(false);

  // Quando sucesso mudar para 'true': mostra o banner verde por 3 segundos
  useEffect(() => {
    if (sucesso === true) {
      setMostrarSucesso(true);
      // setTimeout: agenda uma função para executar depois de N ms
      const t = setTimeout(() => setMostrarSucesso(false), 3000);
      // Cleanup: cancela o timer se o componente desmontar antes dos 3s
      return () => clearTimeout(t);
    }
  }, [sucesso]);   // [sucesso] = só roda quando 'sucesso' mudar

  // Não renderiza nada se estiver tudo bem e online
  if (isOnline && pendentes === 0 && !sincronizando && !mostrarSucesso) {
    return null;   // 'return null' = componente não renderiza nada
  }

  // Define as configurações visuais de acordo com o estado que estiver
  // Prioridade: sucesso > sincronizando > pendentes > offline
  let config = {
    cor:   '#6B7280',                          // cinza = offline
    icone: 'cloud-offline-outline' as const,
    texto: 'Sem conexão — usando dados locais',
  };

  if (mostrarSucesso) {
    config = {
      cor:   Colors.success,
      icone: 'checkmark-circle-outline' as const,
      texto: 'Tudo sincronizado!',
    };
  } else if (sincronizando) {
    config = {
      cor:   Colors.primaryLight,
      icone: 'sync-outline' as const,
      texto: 'Sincronizando...',
    };
  } else if (pendentes > 0) {
    config = {
      cor:   Colors.warning,
      icone: 'time-outline' as const,
      // Template literal com plural condicional:
      texto: `${pendentes} ${pendentes === 1 ? 'item pendente' : 'itens pendentes'}`,
    };
  }

  return (
    <View style={[styles.banner, { backgroundColor: config.cor }]}>
      {/* { backgroundColor: config.cor } é um estilo inline dinâmico */}
      <Ionicons name={config.icone} size={14} color={Colors.white} />
      <Text style={styles.texto}>{config.texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    // ocupa toda a largura como uma faixa
  },
  texto: {
    fontSize: Typography.sizes.xs,
    color: Colors.white,
    fontWeight: Typography.weights.medium,
  },
});