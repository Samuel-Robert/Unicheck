import { View, Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useQrCode } from '../../src/hooks/useQrCode';
import { QrCodeDisplay } from '../../src/components/QrCodeDisplay';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function QrCodeTela() {
  const user = useAuthStore(s => s.user);
  const { qrCodeUri, loading } = useQrCode(user?.id ?? '');

  return (
    <View style={styles.container}>
      <Text style={styles.instrucao}>
        Mostre este código ao professor para registrar sua presença
      </Text>

      <QrCodeDisplay
        uri={qrCodeUri}
        loading={loading}
        nome={user?.nome ?? ''}
        matricula={''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 32,
    padding: 20,
  },
  instrucao: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
});