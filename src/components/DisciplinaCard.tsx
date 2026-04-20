import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Disciplina } from '../types/disciplina';
import { Badge } from './ui/Badge';
import { Colors, Shadows } from '../constants/colors';
import { Typography } from '../constants/typography';
import { corPresenca, formatarPercentual } from '../utils/formatters';

interface DisciplinaCardProps {
  disciplina:  Disciplina;
  percentual?: number; 
  onPress:     () => void;
}

export function DisciplinaCard({ disciplina, percentual, onPress }: DisciplinaCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <Text style={styles.nome} numberOfLines={1}>
          {disciplina.nome}
        </Text>
        {percentual !== undefined && (
          <Badge
            label={formatarPercentual(percentual)}
            tipo={percentual >= 75 ? 'success' : percentual >= 50 ? 'warning' : 'error'}
          />
        )}
      </View>

      {/* Professor e turma */}
      <View style={styles.info}>
        <Ionicons name="person-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.infoTexto}>{disciplina.professor.nome}</Text>
      </View>
      <View style={styles.info}>
        <Ionicons name="people-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.infoTexto}>{disciplina.turma.identificacao}</Text>
      </View>
      {percentual !== undefined && (
        <View style={styles.progressoContainer}>
          <View style={styles.progressoFundo}>
            <View style={[
              styles.progressoFill,
              {
                width: `${Math.min(percentual, 100)}%` as any,
                
                backgroundColor: corPresenca(percentual),
              }
            ]} />
          </View>
          <Text style={styles.progressoTexto}>
            {formatarPercentual(percentual)} de presença
          </Text>
        </View>
      )}

      <Ionicons
        name="chevron-forward-outline"
        size={16}
        color={Colors.textSecondary}
        style={styles.seta}
      />
    </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',   
    alignItems: 'center',
    marginBottom: 8,
  },
  nome: {
    flex: 1,  
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.textPrimary,
    marginRight: 8,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 3,
  },
  infoTexto: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  progressoContainer: {
    marginTop: 12,
  },
  progressoFundo: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',  
  },
  progressoFill: {
    height: '100%',
    borderRadius: 3,
    
  },
  progressoTexto: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  seta: {
    position: 'absolute',   
    right: 16,
    top: '50%',            
  },
});