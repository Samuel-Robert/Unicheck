
// exibição de estatísticas de presença de uma disciplina.
// A barra de progresso muda de cor conforme o percentual.

import { View, Text, StyleSheet } from 'react-native';
import { DashboardDisciplina } from '../types/dashboard';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { corPresenca, formatarPercentual } from '../utils/formatters';

interface DashboardCardProps {
  item: DashboardDisciplina;
}

export function DashboardCard({ item }: DashboardCardProps) {
  // corPresenca retorna verde/amarelo/vermelho conforme o percentual
  const cor = corPresenca(item.percentualPresenca);

  return (
    <View style={styles.card}>
      {/* Nome da disciplina */}
      <Text style={styles.nome}>{item.disciplina.nome}</Text>

      {/* Percentual em destaque na cor certa */}
      <Text style={[styles.percentual, { color: cor }]}>
        {formatarPercentual(item.percentualPresenca)}
      </Text>

      {/* Barra de progresso */}
      <View style={styles.barraFundo}>
        <View style={[
          styles.barraFill,
          {
            // Largura proporcional: '83%' preenche 83% do espaço
            width: `${Math.min(item.percentualPresenca, 100)}%` as any,
            backgroundColor: cor,
          }
        ]} />
      </View>

      {/* Linha de detalhes: presenças / total */}
      <View style={styles.detalheRow}>
        <Text style={styles.detalhe}>
          {item.totalPresencas} presenças
        </Text>
        <Text style={styles.detalhe}>
          {item.totalAlunos} alunos
        </Text>
        <Text style={styles.detalhe}>
          {item.totalFaltas} faltas
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  nome: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  percentual: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    marginBottom: 8,
    // color é definido inline (dinâmico)
  },
  barraFundo: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',   // garante que o fill não ultrapasse as bordas
    marginBottom: 10,
  },
  barraFill: {
    height: '100%',
    borderRadius: 4,
    // width e backgroundColor são definidos inline
  },
  detalheRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detalhe: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
});