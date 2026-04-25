
// Popup que aparece após escanear o QR Code com sucesso.
// Mostra o nome do aluno e fecha

import { useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ConfirmacaoPresenca } from '../types/presenca';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';

interface PresencaConfirmModalProps {
  visivel:      boolean;
  confirmacao:  ConfirmacaoPresenca | null;
  onFechar:     () => void;
}

export function PresencaConfirmModal({
  visivel,
  confirmacao,
  onFechar,
}: PresencaConfirmModalProps) {

  // fecha após 2 segundos quando fica visível
  useEffect(() => {
    if (visivel) {
      const t = setTimeout(onFechar, 2000);
      return () => clearTimeout(t);   // cleanup se fechar manualmente antes
    }
  }, [visivel]);   // roda quando 'visivel' mudar

  return (
    <Modal
      visible={visivel}
      transparent        // fundo não bloqueia totalmente a tela
      animationType="fade"
      onRequestClose={onFechar}
      // onRequestClose: chamado quando usuário aperta "voltar" no Android
    >
      {/* Overlay escuro com o card branco centralizado */}
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Ícone de check grande e verde */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="checkmark-circle"
              size={64}
              color={Colors.success}
            />
          </View>

          <Text style={styles.titulo}>Presença registrada!</Text>

          {/* Dados do aluno (se disponíveis) */}
          {confirmacao && (
            <>
              <Text style={styles.nome}>{confirmacao.nome}</Text>
              <Text style={styles.matricula}>
                Matrícula: {confirmacao.matricula}
              </Text>
            </>
          )}

          {/* Fechará automaticamente (indicação visual) */}
          <Text style={styles.auto}>Fechando automaticamente...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',   // preto com 60% de opacidade
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    gap: 8,
  },
  iconContainer: {
    marginBottom: 8,
  },
  titulo: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.success,
    textAlign: 'center',
  },
  nome: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
  },
  matricula: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  auto: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});