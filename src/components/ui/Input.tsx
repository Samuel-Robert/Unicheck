import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
interface InputProps extends TextInputProps {
  label: string;
  erro?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}
export function Input({ label, erro, icon, style, ...props }: InputProps) {
    return (
    <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}

    <View style={[styles.inputWrapper, erro ? styles.inputErro : null]}>
      {icon && (
        <Ionicons 
        name={icon} 
        size={20} 
        color={Colors.textSecondary} 
        style={styles.icone} 
      />
    )} 
      <TextInput
      style={[styles.input, icon && styles.inputComIcone, style as any]}
      placeholderTextColor={Colors.textSecondary}
          {...props}
           />
    </View> 
    {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',   // ícone e input lado a lado
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  inputErro: {
    borderColor: Colors.error,   // borda vermelha quando tem erro
  },
  icone: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,           // ocupa todo espaço disponível na linha
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: Typography.sizes.md,
    color: Colors.textPrimary,
  },
  inputComIcone: {
    paddingLeft: 8,   // espaço menor à esquerda quando tem ícone
  },
  textoErro: {
    fontSize: Typography.sizes.xs,
    color: Colors.error,
    marginTop: 4,
  },
});