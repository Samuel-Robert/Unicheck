
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Aula } from '../types/aula';
import { formatarData, formatarHora } from '../utils/formatters';

interface AulaCardProps {
  aula:      Aula;
  onPress?:  () => void;   // opcional, se passado, card é clicável
}

export function AulaCard({ aula, onPress }: AulaCardProps) {
  return (
    // Card da Pessoa 2: se tem onPress → TouchableOpacity, senão → View
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.titulo}>{aula.titulo}</Text>
          <Text style={styles.data}>
            {formatarData(aula.dataHora)} às {formatarHora(aula.dataHora)}
          </Text>
        </View>

        {/* Badge muda conforme o status da aula */}
        <Badge
          label={aula.ativa ? 'Em andamento' : 'Encerrada'}
          tipo={aula.ativa ? 'success' : 'neutral'}
          // 'success' = badge verde, 'neutral' = badge cinza
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,   // ocupa o máximo, deixa o badge no restante
  },
  titulo: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  data: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});