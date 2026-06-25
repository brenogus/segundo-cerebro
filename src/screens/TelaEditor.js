import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PreviewMarkdown from '../components/PreviewMarkdown';
import { getNota, salvarNota, getListaNotas, gerarId } from '../utils/armazenamento';
import { extrairWikiLinks } from '../utils/markdownUtil';
import { colors, spacing, radius } from '../theme';

const BOTOES_BARRA = [
  { label: 'H1', inserir: '# ', envolver: false },
  { label: 'H2', inserir: '## ', envolver: false },
  { label: 'B', inserir: '**', envolver: true },
  { label: 'I', inserir: '*', envolver: true },
  { label: '`', inserir: '`', envolver: true },
  { label: '[]', inserir: '[[', envolver: false, sufixo: ']]' },
  { label: '> ', inserir: '> ', envolver: false },
  { label: '- ', inserir: '- ', envolver: false },
];

export default function TelaEditor({ route, navigation }) {
  const { cerebroId, notaId, ehNova, initialTitle } = route.params;

  const [titulo, setTitulo] = useState(initialTitle ?? '');
  const [conteudo, setConteudo] = useState('');
  const [modo, setModo] = useState('editar'); // 'editar' | 'preview'
  const [notasCerebro, setNotasCerebro] = useState([]);

  const refInput = useRef(null);
  const refSelecao = useRef({ start: 0, end: 0 });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <View style={styles.acoesHeader}>
          <TouchableOpacity onPress={alternarModo} style={styles.btnHeader}>
            <Text style={styles.btnHeaderTexto}>
              {modo === 'editar' ? 'Preview' : 'Editar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSalvar}
            style={[styles.btnHeader, styles.btnHeaderSalvar]}
          >
            <Text style={[styles.btnHeaderTexto, styles.btnHeaderSalvarTexto]}>Salvar</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [modo, titulo, conteudo]);

  useEffect(() => {
    carregarNota();
    carregarNotasCerebro();
  }, []);

  async function carregarNota() {
    if (ehNova) return;
    const nota = await getNota(cerebroId, notaId);
    if (nota) {
      setTitulo(nota.title ?? '');
      setConteudo(nota.content ?? '');
    }
  }

  async function carregarNotasCerebro() {
    const lista = await getListaNotas(cerebroId);
    setNotasCerebro(lista);
  }

  async function handleSalvar() {
    const nota = {
      id: notaId,
      title: titulo.trim() || 'Sem título',
      content: conteudo,
      preview: conteudo.slice(0, 120).replace(/[#*`>\[\]]/g, '').trim(),
      updatedAt: new Date().toISOString(),
    };
    await salvarNota(cerebroId, nota);
    navigation.setParams({ titulo: nota.title });
  }

  function alternarModo() {
    setModo(m => (m === 'editar' ? 'preview' : 'editar'));
  }

  // insere markdown na posição atual do cursor
  function inserirMarkdown(btn) {
    const { start, end } = refSelecao.current;
    const selecionado = conteudo.slice(start, end);
    let novoTexto;

    if (btn.envolver) {
      novoTexto =
        conteudo.slice(0, start) +
        btn.inserir + selecionado + btn.inserir +
        conteudo.slice(end);
    } else {
      const sufixo = btn.sufixo ?? '';
      novoTexto = conteudo.slice(0, start) + btn.inserir + selecionado + sufixo + conteudo.slice(end);
    }

    setConteudo(novoTexto);

    setTimeout(() => {
      refInput.current?.focus();
    }, 50);
  }

  // navega pra outra nota quando clica num [[link]]
  async function handleClicarLink(tituloLink) {
    const existente = notasCerebro.find(
      n => n.title?.toLowerCase() === tituloLink.toLowerCase()
    );

    if (existente) {
      navigation.push('Editor', {
        cerebroId,
        notaId: existente.id,
        ehNova: false,
      });
    } else {
      Alert.alert(
        `"${tituloLink}"`,
        'Essa nota não existe ainda. Criar agora?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Criar nota',
            onPress: () => {
              navigation.push('Editor', {
                cerebroId,
                notaId: gerarId(),
                ehNova: true,
                initialTitle: tituloLink,
              });
            },
          },
        ]
      );
    }
  }

  const wikiLinks = extrairWikiLinks(conteudo);
  const titulosExistentes = notasCerebro.map(n => n.title);
  const linkQuebrado = wikiLinks.filter(l => !titulosExistentes.includes(l));

  return (
    <SafeAreaView style={styles.tela} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      {/* título sempre visível */}
      <TextInput
        style={styles.inputTitulo}
        placeholder="Título da nota"
        placeholderTextColor={colors.textMuted}
        value={titulo}
        onChangeText={setTitulo}
        returnKeyType="next"
        onSubmitEditing={() => refInput.current?.focus()}
      />

      {modo === 'editar' ? (
        <>
          {/* barra de ferramentas md */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.barra}
            contentContainerStyle={styles.barraConteudo}
          >
            {BOTOES_BARRA.map(btn => (
              <TouchableOpacity
                key={btn.label}
                style={styles.botaoBarra}
                onPress={() => inserirMarkdown(btn)}
              >
                <Text style={styles.botaoBarraTexto}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            ref={refInput}
            style={styles.editor}
            multiline
            value={conteudo}
            onChangeText={setConteudo}
            onSelectionChange={e => { refSelecao.current = e.nativeEvent.selection; }}
            placeholder={'Escreva suas notas aqui...\n\nUse [[Nome da Nota]] para linkar outras notas.'}
            placeholderTextColor={colors.textMuted}
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect={false}
            scrollEnabled
          />
        </>
      ) : (
        <PreviewMarkdown
          conteudo={conteudo}
          aoClicarLink={handleClicarLink}
        />
      )}

      {/* rodapé com info de links */}
      {wikiLinks.length > 0 && (
        <View style={styles.barraLinks}>
          <Text style={styles.rotuloLinks}>Links: </Text>
          {wikiLinks.map(link => (
            <TouchableOpacity key={link} onPress={() => handleClicarLink(link)}>
              <Text style={[
                styles.chipLink,
                linkQuebrado.includes(link) && styles.chipLinkQuebrado,
              ]}>
                {link}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  acoesHeader: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginRight: spacing.xs,
  },
  btnHeader: {
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnHeaderSalvar: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  btnHeaderTexto: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  btnHeaderSalvarTexto: {
    color: '#fff',
  },
  inputTitulo: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    letterSpacing: -0.3,
  },
  barra: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    flexGrow: 0,
  },
  barraConteudo: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: 4,
    flexDirection: 'row',
  },
  botaoBarra: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 32,
    alignItems: 'center',
  },
  botaoBarraTexto: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  editor: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    padding: spacing.md,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    textAlignVertical: 'top',
  },
  barraLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.xs,
  },
  rotuloLinks: {
    color: colors.textMuted,
    fontSize: 11,
  },
  chipLink: {
    color: colors.link,
    fontSize: 12,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  chipLinkQuebrado: {
    color: colors.textMuted,
    borderStyle: 'dashed',
  },
});
