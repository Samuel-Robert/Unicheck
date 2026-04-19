import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '@/constants/typography';

type Variante = "primary" | "success" | "danger" | "outline" | "ghost";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variante?: Variante;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variante = "primary",
  isLoading = false,
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variante],
        (disabled || isLoading) && styles.desabilitado,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading  
        ? <ActivityIndicator 
        color={variante === 'outline' || variante === 'ghost'
          ? Colors.primaryMedium
          : Colors.white
        }
      />
    : <Text style={[styles.texto, estiloTexto(variante)]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}
function estiloTexto(variante: Variante) {
    if (variante === 'outline' || variante === 'ghost') {
        return { color : Colors.primaryMedium };
    }
    return { color: Colors.white };
}  

const styles = StyleSheet.create({
    base: {
        borderRadius: 10,
        paddingVertical: 13,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    primary: {
        backgroundColor: Colors.primaryMedium,
    },
    success: {
        backgroundColor: Colors.success,
    },
    danger: {
        backgroundColor: Colors.error,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.primaryMedium,
    },
    ghost: {
        backgroundColor: 'transparent',
    }, 
    desabilitado: {
        opacity: 0.5,
    },
    texto: {
        fontSize: Typography.sizes.md,
        fontWeight: Typography.weights.semibold,
    },
});