import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';

interface QrCodeDisplayProps {
  base64?: string | null;
  loading?: boolean;
  nome:    string;
  matricula: string;
}

export function QrCodeDisplay({ base64, loading, nome, matricula }: QrCodeDisplayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        {loading ? (
          <View style={styles.placeholder}>
            <ActivityIndicator size="large" color={Colors.primaryMedium} />
          </View>
        ) : base64 ? (
          <Image
            source={{
              uri: `data:image/png;base64,${base64}`,
            }}
            style={styles.qrImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.erroTexto}>QR Code indisponível</Text>
          </View>
        )}
      </View>
      <Text style={styles.nome}>{nome}</Text>
      <Text style={styles.matricula}>Matrícula: {matricula}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 24,
  },
  qrContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...Shadows.md,
    marginBottom: 20,
  },
  qrImage: {
    width: 220,
    height: 220,
  },
  placeholder: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  erroTexto: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  nome: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  matricula: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});