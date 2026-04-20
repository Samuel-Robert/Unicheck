import { View, SectionList, Text, StyleSheet } from 'react-native';
// SectionList: como FlatList mas com seções/grupos
// Perfeito para agrupar horários por dia da semana

import { useAuthStore } from '../../src/store/authStore';
import { useDisciplinas } from '../../src/hooks/useDisciplinas';
import { useHorarios } from '../../src/hooks/useHorarios';
import { HorarioCard } from '../../src/components/HorarioCard';
import { LoadingSpinner } from '../../src/components/ui/LoadingSpinner';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { formatarDiaSemana } from '../../src/utils/formatters';
import { DiaSemana } from '../../src/types/horario';

const ORDEM_DIAS: DiaSemana[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function HorariosTela() {
  const user = useAuthStore(s => s.user);
  const { disciplinas, loading } = useDisciplinas(user?.id);

  const primeiraDisc = disciplinas[0];
  const { horarios } = useHorarios(primeiraDisc?.id ?? '');

  if (loading) return <LoadingSpinner />;

  const sections = ORDEM_DIAS
    .map(dia => ({
      title: formatarDiaSemana(dia),
      data: horarios.filter(h => h.diaSemana === dia),
    }))
    .filter(s => s.data.length > 0);

  if (sections.length === 0) {
    return (
      <EmptyState
        icone="calendar-outline"
        titulo="Nenhum horário cadastrado"
        descricao="Os horários das aulas aparecerão aqui."
      />
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HorarioCard horario={item} />}
        renderSectionHeader={({ section }) => (
          <Text style={styles.headerDia}>{section.title}</Text>
        )}
        contentContainerStyle={styles.lista}
        stickySectionHeadersEnabled={false}
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
  headerDia: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
});