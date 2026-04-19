import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

type Tipo = 'success' | 'info' | 'warning' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  tipo?: Tipo;
}
export function Badge({ label, tipo = 'info' }: BadgeProps) {
  return (
    <View style={[styles.badge, estiloFundo(tipo)]}>
      <Text style={[styles.texto, estiloTexto(tipo)]}>{label}</Text>
    </View>
  );
}
const fundos: Record<Tipo, string> = {
  success: '#DCFCE7',
  info: '#DBEAFE',
  warning: '#FEF3C7',
  error: '#FEE2E2',
  neutral: '#F3F4F6',
};
const textos: Record<Tipo, string> = {
  success: Colors.successDark,
  info: Colors.primaryMedium,
  warning: '#92400E',
  error: '#991B1B',
  neutral: Colors.textSecondary,
};
function estiloFundo(tipo: Tipo) { return { backgroundColor: fundos[tipo] }; }
function estiloTexto(tipo: Tipo) { return { color: textos[tipo] }; }

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',   // não estica — fica do tamanho do conteúdo
  },
  texto: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
});