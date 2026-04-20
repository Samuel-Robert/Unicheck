import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { usePresencas } from '../../src/hooks/usePresencas';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { formatarData, formatarHora } from '../../src/utils/formatters';

export default function PresencasTela() {
  const user = useAuthStore(s => s.user);
  const { presencas, loading, refetch } = usePresencas(user?.id ?? '');

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={presencas}
        keyExtractor={item => item.id}
        onRefresh={refetch}
        refreshing={loading}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          <Text style={styles.titulo}>
            {presencas.length} presença{presencas.length !== 1 ? 's' : ''} registrada{presencas.length !== 1 ? 's' : ''}
          </Text>
        }
        ListEmptyComponent={
          <EmptyState
            icone="checkmark-circle-outline"
            titulo="Nenhuma presença"
            descricao="Suas presenças aparecerão aqui após o professor registrá-las."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.checkContainer}>
              <Text style={styles.checkIcon}>✓</Text>
            </View>

            <View style={styles.info}>
              <Text style={styles.data}>
                {formatarData(item.dataHora)}
              </Text>
              <Text style={styles.hora}>
                {formatarHora(item.dataHora)}
              </Text>
              {!item.sincronizado && (
                <Text style={styles.pendente}>Pendente de sincronização</Text>
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
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
  },
  titulo: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  checkContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: Typography.weights.bold,
  },
  info: {
    flex: 1,
  },
  data: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
  },
  hora: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pendente: {
    fontSize: Typography.sizes.xs,
    color: Colors.warning,
    marginTop: 2,
  },
  separador: {
    height: 1,
    backgroundColor: Colors.border,
  },
});