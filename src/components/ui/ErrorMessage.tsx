import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

interface ErrorMessageProps {
  mensagem: string;
}

export function ErrorMessage({ mensagem }: ErrorMessageProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',  
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',   
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  texto: {
    fontSize: Typography.sizes.sm,
    color: '#991B1B',   
    flex: 1,            
  },
});