
// tela de detalhes com asfuncionalidades:
// Lista aulas da disciplina
// Botão para iniciar nova aula
// Botão para abrir o scanner de QR Code
// Botão para encerrar a aula ativa

import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAulas } from '../../../src/hooks/useAulas';
import { useOfflineStore } from '../../../src/store/offlineStore';
import { AulaCard } from '../../../src/components/AulaCard';
import { Button } from '../../../src/components/ui/Button';
import { LoadingSpinner } from '../../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Colors } from '../../../src/constants/colors';
import { Typography } from '../../../src/constants/typography';

export default function DetalheAula() {
  // useLocalSearchParams lê o [id] da URL
  const { id } = useLocalSearchParams<{ id: string }>();
  // O <{ id: string }> é o generic: TypeScript sabe que 'id' é string

  const router = useRouter();
  const { aulas, aulaAtiva, loading, iniciarAula, encerrarAula } = useAulas(id);
  const isOnline = useOfflineStore(s => s.isOnline);
  const [salvando, setSalvando] = useState(false);

  // ─── Iniciar Aula ──────────────────────────────────────────
  const handleIniciar = () => {
    // Alert.prompt (iOS) ou Alert.alert com input customizado
    // Simplificando: usa um título fixo (em produção, use um Input modal)
    Alert.alert(
      'Iniciar Aula',
      `Iniciar nova aula?${!isOnline ? '\n(Será salva localmente)' : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Iniciar',
          onPress: async () => {
            setSalvando(true);
            try {
              await iniciarAula(`Aula ${new Date().toLocaleDateString('pt-BR')}`);
            } catch {
              Alert.alert('Erro', 'Não foi possível iniciar a aula.');
            } finally {
              setSalvando(false);
            }
          },
        },
      ]
    );
  };

  // ─── Encerrar Aula ────────────────────────────────────────
  const handleEncerrar = () => {
    if (!aulaAtiva) return;
    Alert.alert(
      'Encerrar Aula',
      'Deseja encerrar a aula atual?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Encerrar',
          style: 'destructive',
          onPress: () => encerrarAula(aulaAtiva.id),
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      {/* Botões de ação no topo */}
      <View style={styles.acoes}>
        {aulaAtiva ? (
          // Se tem aula ativa: mostra botão de scanner e encerrar
          <>
            <Button
              label="Escanear QR"
              onPress={() => router.push(`/(professor)/scanner?aulaId=${aulaAtiva.id}`)}
              variante="primary"
              style={styles.botao}
            />
            <Button
              label="Encerrar Aula"
              onPress={handleEncerrar}
              variante="danger"
              style={styles.botao}
            />
          </>
        ) : (
          // Se não tem aula ativa: mostra botão de iniciar
          <Button
            label="Iniciar Nova Aula"
            onPress={handleIniciar}
            isLoading={salvando}
            variante="success"
          />
        )}
      </View>

      {/* Lista de aulas anteriores */}
      <FlatList
        data={aulas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AulaCard aula={item} />}
        ListEmptyComponent={
          <EmptyState
            icone="calendar-outline"
            titulo="Nenhuma aula registrada"
            descricao="Inicie a primeira aula desta disciplina."
          />
        }
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <Text style={styles.secaoTitulo}>Histórico de Aulas</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  acoes: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  botao: { flex: 1 },
  lista: { padding: 16 },
  secaoTitulo: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});