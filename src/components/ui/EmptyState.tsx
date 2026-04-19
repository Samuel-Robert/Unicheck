import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface EmptyStateProps {
  icone?:     keyof typeof Ionicons.glyphMap;
  titulo:     string;
  descricao?: string;
}
export function EmptyState({
  icone = 'folder-open-outline',   
  titulo,
  descricao,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icone} size={56} color={Colors.border} />
      <Text style={styles.titulo}>{titulo}</Text>
      {descricao && <Text style={styles.descricao}>{descricao}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    gap: 12,   
  },
  titulo: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  descricao: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});