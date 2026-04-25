
// tela incial do professor que tem as disciplinas do professor. Ao tocar, vai para o detalhe da aula

import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { useDisciplinas } from '../../src/hooks/useDisciplinas';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { Ionicons } from '@expo/vector-icons';

export default function ProfessorHome() {
  const router = useRouter();
  // useRouter() = hook do expo-router para navegar programaticamente
  const user = useAuthStore(s => s.user);
  const { disciplinas, loading, refetch } = useDisciplinas();

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={disciplinas}
        keyExtractor={item => item.id}
        onRefresh={refetch}
        refreshing={loading}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.titulo}>
              Olá, {user?.nome?.split(' ')[0]} 👋
            </Text>
            <Text style={styles.subtitulo}>Suas disciplinas</Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icone="book-outline"
            titulo="Nenhuma disciplina"
            descricao="Você não tem disciplinas atribuídas."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(professor)/aulas/${item.id}`)}
            // router.push(`/(professor)/aulas/${item.id}`)
            // Navega para app/(professor)/aulas/[id].tsx com id = item.id
            activeOpacity={0.85}
          >
            <View style={styles.cardConteudo}>
              <Text style={styles.nomeDisciplina}>{item.nome}</Text>
              <Text style={styles.turma}>
                {item.turma.identificacao} · {item.turma.curso}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  lista: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  titulo: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  cardConteudo: { flex: 1 },
  nomeDisciplina: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  turma: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});