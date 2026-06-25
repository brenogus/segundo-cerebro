import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CartaoCerebro from '../components/CartaoCerebro';
import ModalNovoCerebro from '../components/ModalNovoCerebro';
import { getCerebros, salvarCerebro, deletarCerebro, getListaNotas, gerarId } from '../utils/armazenamento';
import { colors, spacing } from '../theme';

export default function TelaInicial({ navigation }) {
  const [cerebros, setCerebros] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [cerebroEditando, setCerebroEditando] = useState(null);

  // recarrega quando volta pra tela
  useFocusEffect(
    useCallback(() => {
      carregarCerebros();
    }, [])
  );

  async function carregarCerebros() {
    const lista = await getCerebros();
    // enriquece com contagem de notas
    const enriquecida = await Promise.all(
      lista.map(async c => {
        const notas = await getListaNotas(c.id);
        return { ...c, noteCount: notas.length };
      })
    );
    setCerebros(enriquecida);
  }

  async function handleCriar({ name, description, color }) {
    const cerebro = {
      id: gerarId(),
      name,
      description,
      color,
      criadoEm: new Date().toISOString(),
    };
    await salvarCerebro(cerebro);
    setModalVisivel(false);
    carregarCerebros();
  }

  async function handleEditar({ name, description, color }) {
    const atualizado = { ...cerebroEditando, name, description, color };
    await salvarCerebro(atualizado);
    setCerebroEditando(null);
    setModalVisivel(false);
    carregarCerebros();
  }

  function handlePressionarLongo(cerebro) {
    Alert.alert(cerebro.name, 'O que você quer fazer?', [
      {
        text: 'Editar',
        onPress: () => {
          setCerebroEditando(cerebro);
          setModalVisivel(true);
        },
      },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: () => confirmarDelecao(cerebro),
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  function confirmarDelecao(cerebro) {
    Alert.alert(
      'Deletar cérebro',
      `Tem certeza que quer deletar "${cerebro.name}"? Todas as notas serão perdidas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            await deletarCerebro(cerebro.id);
            carregarCerebros();
          },
        },
      ]
    );
  }

  function abrirModal() {
    setCerebroEditando(null);
    setModalVisivel(true);
  }

  return (
    <View style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.nomeApp}>Segundo Cérebro</Text>
          <Text style={styles.subtitulo}>
            {cerebros.length === 0
              ? 'Nenhum vault criado ainda'
              : `${cerebros.length} vault${cerebros.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <TouchableOpacity style={styles.btnAdicionar} onPress={abrirModal}>
          <Text style={styles.btnAdicionarTexto}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cerebros}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <CartaoCerebro
            cerebro={item}
            onPress={() => navigation.navigate('Cerebro', { cerebro: item })}
            onLongPress={() => handlePressionarLongo(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Text style={styles.vazioIcone}>🧠</Text>
            <Text style={styles.vazioTexto}>Seu primeiro vault vai aparecer aqui.</Text>
            <Text style={styles.vazioDica}>Toque em "+ Novo" pra começar.</Text>
          </View>
        }
      />

      <ModalNovoCerebro
        visivel={modalVisivel}
        aoFechar={() => {
          setModalVisivel(false);
          setCerebroEditando(null);
        }}
        aoConfirmar={cerebroEditando ? handleEditar : handleCriar}
        dadosIniciais={cerebroEditando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nomeApp: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitulo: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  btnAdicionar: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  btnAdicionarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  lista: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  vazio: {
    alignItems: 'center',
    marginTop: 80,
    gap: spacing.sm,
  },
  vazioIcone: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  vazioTexto: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  vazioDica: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
