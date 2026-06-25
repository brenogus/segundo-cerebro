import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import ItemNota from '../components/ItemNota';
import { getListaNotas, deletarNota, gerarId } from '../utils/armazenamento';
import { colors, spacing, radius } from '../theme';

export default function TelaCerebro({ route, navigation }) {
  const { cerebro } = route.params;
  const [notas, setNotas] = useState([]);
  const [busca, setBusca] = useState('');

  useFocusEffect(
    useCallback(() => {
      carregarNotas();
    }, [])
  );

  async function carregarNotas() {
    const lista = await getListaNotas(cerebro.id);
    // ordena por mais recente
    lista.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setNotas(lista);
  }

  function notasFiltradas() {
    if (!busca.trim()) return notas;
    const q = busca.toLowerCase();
    return notas.filter(n => n.title?.toLowerCase().includes(q));
  }

  function abrirNota(notaId) {
    navigation.navigate('Editor', {
      cerebroId: cerebro.id,
      notaId: notaId ?? gerarId(),
      ehNova: !notaId,
      nomeCerebro: cerebro.name,
    });
  }

  function handlePressionarLongo(nota) {
    Alert.alert(nota.title || 'Sem título', '', [
      {
        text: 'Abrir',
        onPress: () => abrirNota(nota.id),
      },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => confirmarDelecao(nota),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function confirmarDelecao(nota) {
    Alert.alert('Deletar nota', `Deletar "${nota.title || 'Sem título'}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          await deletarNota(cerebro.id, nota.id);
          carregarNotas();
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
      <View style={styles.linhaBusca}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar notas..."
          placeholderTextColor={colors.textMuted}
          value={busca}
          onChangeText={setBusca}
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={notasFiltradas()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <ItemNota
            nota={item}
            onPress={() => abrirNota(item.id)}
            onLongPress={() => handlePressionarLongo(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioTexto}>
              {busca ? 'Nenhuma nota encontrada.' : 'Vault vazio por enquanto.'}
            </Text>
            {!busca && (
              <Text style={styles.vazioDica}>Toque em "+" pra criar a primeira nota.</Text>
            )}
          </View>
        }
      />

      <TouchableOpacity
        style={styles.botaoFlutuante}
        onPress={() => abrirNota(null)}
        activeOpacity={0.85}
      >
        <Text style={styles.botaoFlutuanteTexto}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  linhaBusca: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  inputBusca: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
  },
  lista: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 60,
    gap: spacing.xs,
  },
  vazioTexto: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  vazioDica: {
    color: colors.textMuted,
    fontSize: 12,
  },
  botaoFlutuante: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.accent,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  botaoFlutuanteTexto: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
});
