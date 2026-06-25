import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

// cartão exibido na tela inicial pra cada cérebro
export default function CartaoCerebro({ cerebro, onPress, onLongPress }) {
  const iniciais = cerebro.name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <TouchableOpacity
      style={styles.cartao}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
    >
      <View style={[styles.avatar, { backgroundColor: cerebro.color ?? colors.accentDim }]}>
        <Text style={styles.avatarTexto}>{iniciais}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1}>{cerebro.name}</Text>
        <Text style={styles.meta}>
          {cerebro.noteCount ?? 0} nota{cerebro.noteCount !== 1 ? 's' : ''}
          {cerebro.description ? `  ·  ${cerebro.description}` : ''}
        </Text>
      </View>

      <Text style={styles.seta}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  info: {
    flex: 1,
  },
  nome: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  seta: {
    color: colors.textMuted,
    fontSize: 22,
    marginRight: -4,
  },
});
