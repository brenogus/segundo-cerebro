import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

function formatarData(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const hoje = new Date();
  const diff = hoje - d;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (dias === 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 7) return `${dias} dias atrás`;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

export default function ItemNota({ nota, onPress, onLongPress }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <View style={styles.linha}>
        <Text style={styles.titulo} numberOfLines={1}>{nota.title || 'Sem título'}</Text>
        <Text style={styles.data}>{formatarData(nota.updatedAt)}</Text>
      </View>
      {nota.preview ? (
        <Text style={styles.preview} numberOfLines={2}>{nota.preview}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  data: {
    color: colors.textMuted,
    fontSize: 11,
  },
  preview: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});
