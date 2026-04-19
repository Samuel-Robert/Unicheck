import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Shadows } from '../../constants/colors';
interface CardProps {
  children:  React.ReactNode;
  onPress?:  () => void;
  style?:    ViewStyle;
}
export function Card({ children, onPress, style }: CardProps) {
    if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.card, style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {children}
        </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
},
});