import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from './ui/Avatar';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { formatarHora } from '../utils/formatters';

interface AlunoPresencaItemProps {
  nome:       string;
  matricula:  string;
  fotoUrl?:   string | null;
  dataHora:   string;
}

export function AlunoPresencaItem({
  nome,
  matricula,
  fotoUrl,
  dataHora,
}: AlunoPresencaItemProps) {
  return (
    <View style={styles.container}>
      <Avatar
        nome={nome}
        fotoUrl={fotoUrl}
        tamanho={44}
      />

      <View style={styles.info}>

        <Text style={styles.nome} numberOfLines={1}>
          {nome}
        </Text>
        <Text style={styles.matricula}>Mat. {matricula}</Text>
      </View>

      <Text style={styles.hora}>
        {formatarHora(dataHora)}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 10,
    marginBottom: 8,
    ...Shadows.sm,
  },
  info: {
    flex: 1,
  },
  nome: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  matricula: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  hora: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
});