
// Exibe estatísticas de presença de todas as disciplinas.


import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useDashboard } from '../../src/hooks/useDashboard';
import { DashboardCard } from '../../src/components/DashboardCard';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ErrorMessage } from '../../src/components/ui/ErrorMessage';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function DashboardProfessor() {
  const { dashboard, loading, refetch } = useDashboard();

  if (loading) return <LoadingSpinner />;

  // Média geral de todas as disciplinas
  const mediaGeral = dashboard.length > 0
    ? dashboard.reduce((acc, d) => acc + d.percentualPresenca, 0) / dashboard.length
    : 0;
  // .reduce: acumula a soma dos percentuais, depois divide pela quantidade

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      // RefreshControl: componente que adiciona o pull-to-refresh ao ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    >
      <Text style={styles.titulo}>Dashboard</Text>

      {/* Card de média geral */}
      <View style={styles.cardMedia}>
        <Text style={styles.labelMedia}>Média geral de presença</Text>
        <Text style={styles.valorMedia}>{mediaGeral.toFixed(1)}%</Text>
      </View>

      {dashboard.length === 0 ? (
        <EmptyState
          icone="bar-chart-outline"
          titulo="Sem dados disponíveis"
          descricao="Os dados do dashboard requerem conexão com a internet."
        />
      ) : (
        dashboard.map(item => (
          // .map() em JSX: para cada item, retorna um componente
          // Cada item precisa de 'key' único (para React otimizar re-renders)
          <DashboardCard key={item.disciplina.id} item={item} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  titulo: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  cardMedia: {
    backgroundColor: Colors.primaryMedium,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  labelMedia: {
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  valorMedia: {
    fontSize: 48,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
});