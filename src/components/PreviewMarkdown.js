import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { tokenizarLinha, classificarLinha } from '../utils/markdownUtil';
import { colors, spacing, radius } from '../theme';

// renderiza tokens inline (bold, italic, link, code, texto simples)
function TokensInline({ tokens, aoClicarLink }) {
  return (
    <Text>
      {tokens.map((token, i) => {
        if (token.type === 'link') {
          return (
            <Text
              key={i}
              style={styles.link}
              onPress={() => aoClicarLink?.(token.value)}
            >
              {token.value}
            </Text>
          );
        }
        if (token.type === 'bold') {
          return <Text key={i} style={styles.negrito}>{token.value}</Text>;
        }
        if (token.type === 'italic') {
          return <Text key={i} style={styles.italico}>{token.value}</Text>;
        }
        if (token.type === 'code') {
          return <Text key={i} style={styles.codigoInline}>{token.value}</Text>;
        }
        return <Text key={i} style={styles.simples}>{token.value}</Text>;
      })}
    </Text>
  );
}

export default function PreviewMarkdown({ conteudo, aoClicarLink }) {
  const linhas = (conteudo ?? '').split('\n');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
      {linhas.map((linha, i) => {
        const { type, content: conteudoLinha } = classificarLinha(linha);
        const tokens = tokenizarLinha(conteudoLinha);

        if (type === 'blank') {
          return <View key={i} style={styles.espaco} />;
        }

        if (type === 'hr') {
          return <View key={i} style={styles.divisor} />;
        }

        if (type === 'quote') {
          return (
            <View key={i} style={styles.blocoQuote}>
              <Text style={styles.textoQuote}>
                <TokensInline tokens={tokens} aoClicarLink={aoClicarLink} />
              </Text>
            </View>
          );
        }

        if (type === 'li') {
          return (
            <View key={i} style={styles.linhaLista}>
              <Text style={styles.marcador}>•</Text>
              <Text style={styles.textoLista}>
                <TokensInline tokens={tokens} aoClicarLink={aoClicarLink} />
              </Text>
            </View>
          );
        }

        const estiloTexto =
          type === 'h1' ? styles.h1
          : type === 'h2' ? styles.h2
          : type === 'h3' ? styles.h3
          : styles.paragrafo;

        return (
          <Text key={i} style={estiloTexto}>
            <TokensInline tokens={tokens} aoClicarLink={aoClicarLink} />
          </Text>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  h1: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    letterSpacing: -0.3,
  },
  h2: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  h3: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  paragrafo: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  simples: {
    color: colors.textPrimary,
  },
  negrito: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  italico: {
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  codigoInline: {
    fontFamily: 'monospace',
    backgroundColor: colors.surfaceAlt,
    color: colors.accent,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 13,
  },
  link: {
    color: colors.link,
    textDecorationLine: 'underline',
  },
  espaco: {
    height: spacing.sm,
  },
  divisor: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  blocoQuote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingLeft: spacing.md,
    marginVertical: spacing.xs,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
  },
  textoQuote: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontSize: 14,
    lineHeight: 20,
  },
  linhaLista: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    paddingLeft: spacing.sm,
  },
  marcador: {
    color: colors.accent,
    marginRight: spacing.sm,
    fontSize: 14,
    lineHeight: 22,
  },
  textoLista: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    flex: 1,
  },
});
