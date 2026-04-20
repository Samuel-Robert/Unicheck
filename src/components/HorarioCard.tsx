import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HorarioAula } from '../types/horario';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatarDiaSemana, formatarIntervalo } from '../utils/formatters';

interface HorarioCardProps {
  horario: HorarioAula;
}

export function HorarioCard({ horario }: HorarioCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.linha}>
        <Ionicons name="calendar-outline" size={18} color={Colors.primaryMedium} />

        <Text style={styles.dia}>
          {formatarDiaSemana(horario.diaSemana)}
        </Text>

      </View>
      <View style={styles.linha}>
        <Ionicons name="time-outline" size={18} color={Colors.textSecondary} />

        <Text style={styles.horario}>
          {formatarIntervalo(horario.horaInicio, horario.horaFim)}
        </Text>

      </View>
      <Text style={styles.disciplina}>{horario.disciplina.nome}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    ...Shadows.sm,
    gap: 6,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dia: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  horario: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  disciplina: {
    fontSize: Typography.sizes.sm,
    color: Colors.primaryMedium,
    fontWeight: Typography.weights.medium,
    marginTop: 4,
  },
});