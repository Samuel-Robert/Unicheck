import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';
import { useAuth } from '../../src/hooks/useAuth';
import { Avatar } from '../../src/components/ui/Avatar';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { Colors, Shadows } from '../../src/constants/colors';
import { Typography } from '../../src/constants/typography';
import { router } from 'expo-router';

export default function PerfilAluno() {
  const user = useAuthStore(s => s.user);
  const { fazerLogout, atualizarPerfil, loading } = useAuth();

  const [nome, setNome] = useState(user?.nome ?? '');
  const [senha, setSenha] = useState('');
  const [editando, setEditando] = useState(false);


  const handleSalvar = async () => {
    try {
      await atualizarPerfil({ nome, senha: senha || undefined });

      setEditando(false);
      Alert.alert('Sucesso', 'Perfil atualizado!');
    } catch {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  const handleLogout = async () => {

    Alert.alert(
      'Sair',
      'Deseja realmente sair do UniCheck?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: fazerLogout },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.perfilCard}>
        <Avatar nome={user?.nome ?? ''} tamanho={72} />
        <Text style={styles.nome}>{user?.nome}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeTexto}>Aluno</Text>
        </View>
      </View>

      {editando ? (
        <View style={styles.form}>
          <Input
            label="Nome"
            value={nome}
            onChangeText={setNome}
            icon="person-outline"
          />
          <Input
            label="Nova senha (deixe vazio para não alterar)"
            value={senha}
            onChangeText={setSenha}
            icon="lock-closed-outline"
            secureTextEntry
            placeholder="••••••"
          />
          <View style={styles.botoes}>
            <Button
              label="Cancelar"
              onPress={() => setEditando(false)}
              variante="outline"
              style={styles.botao}
            />
            <Button
              label="Salvar"
              onPress={handleSalvar}
              isLoading={loading}
              style={styles.botao}
            />
          </View>
        </View>
      ) : (
        <Button
          label="Editar Perfil"
          onPress={() => setEditando(true)}
          variante="outline"
        />
      )}

      <Button
        label="Sair do App"
        onPress={handleLogout}
        variante="danger"
        style={styles.botaoLogout}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  perfilCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
    ...Shadows.sm,
  },
  nome: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
  },
  email: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTexto: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primaryMedium,
  },
  form: {
    marginBottom: 16,
  },
  botoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  botao: {
    flex: 1,
  },
  botaoLogout: {
    marginTop: 12,
  },
});