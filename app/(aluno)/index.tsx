import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useDisciplinas } from '../../src/hooks/useDisciplinas';
import { DisciplinaCard } from '../../src/components/DisciplinaCard';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function AlunoHome() {
    
  const user = useAuthStore(s => s.user);

  const { disciplinas, loading, refetch } = useDisciplinas(user?.id);

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

          <View style={styles.cabecalho}>
            <Text style={styles.saudacao}>
              Olá, {user?.nome?.split(' ')[0] ?? 'Aluno'} 👋
            </Text>
            <Text style={styles.subtitulo}>Suas disciplinas</Text>
          </View>
        }

        ListEmptyComponent={
          <EmptyState
            icone="book-outline"
            titulo="Nenhuma disciplina"
            descricao="Suas disciplinas aparecerão aqui quando a sincronização ocorrer."
          />
        }

        renderItem={({ item }) => (
          <DisciplinaCard
            disciplina={item}
            onPress={() => console.log('Clicou na disciplina', item.nome)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  lista: {
    padding: 16,
    paddingBottom: 40,
  },
  cabecalho: {
    marginBottom: 20,
  },
  saudacao: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  subtitulo: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});