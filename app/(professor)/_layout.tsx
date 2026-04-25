// Diferente do aluno, o layout do professor ele renderiza o OfflineBanner acima das tabs
// O layout envolve TODAS as telas do professor.

import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OfflineBanner } from '../../src/components/OfflineBanner';
import { useOfflineSync } from '../../src/hooks/useOfflineSync';
import { Colors } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';

export default function ProfessorLayout() {
  // Inicializa o sistema de sync (registra listener do NetInfo)
  // pendentes e processarFila ficam disponíveis se precisar
  useOfflineSync();

  return (
    // View flex:1 para que o banner + tabs ocupem a tela inteira
    <View style={{ flex: 1 }}>
      {/* Banner aparece acima de tudo, incluindo o header */}
      <OfflineBanner />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primaryMedium,
          tabBarInactiveTintColor: Colors.textSecondary,
          tabBarStyle: {
            borderTopColor: Colors.border,
            height: 60,
            paddingBottom: 8,
          },
          tabBarLabelStyle: {
            fontSize: Typography.sizes.xs,
            fontWeight: Typography.weights.medium,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Disciplinas',
            tabBarIcon: ({ color }) => (
              <Ionicons name="book-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="scanner"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ color }) => (
              <Ionicons name="qr-code-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Ionicons name="bar-chart-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="perfil"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
