import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius } from '../theme';

// cores disponíveis para o avatar do cérebro
const PALETA = [
  '#3a5cbf',
  '#5b8af5',
  '#7b5ea7',
  '#3a9e7e',
  '#c05c6a',
  '#c08840',
  '#3a7e9e',
  '#6b6b6b',
];

export default function ModalNovoCerebro({ visivel, aoFechar, aoConfirmar, dadosIniciais }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(PALETA[0]);

  useEffect(() => {
    if (dadosIniciais) {
      setNome(dadosIniciais.name ?? '');
      setDescricao(dadosIniciais.description ?? '');
      setCorSelecionada(dadosIniciais.color ?? PALETA[0]);
    } else {
      setNome('');
      setDescricao('');
      setCorSelecionada(PALETA[0]);
    }
  }, [visivel]);

  function handleConfirmar() {
    const nomeTrimado = nome.trim();
    if (!nomeTrimado) return;
    aoConfirmar({ name: nomeTrimado, description: descricao.trim(), color: corSelecionada });
  }

  return (
    <Modal visible={visivel} transparent animationType="fade" onRequestClose={aoFechar}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.caixa}>
            <Text style={styles.titulo}>{dadosIniciais ? 'Editar cérebro' : 'Novo cérebro'}</Text>

            <Text style={styles.rotulo}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="ex: Estudos de física"
              placeholderTextColor={colors.textMuted}
              value={nome}
              onChangeText={setNome}
              autoFocus
              returnKeyType="next"
            />

            <Text style={styles.rotulo}>Descrição (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="sobre o que é esse vault..."
              placeholderTextColor={colors.textMuted}
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.rotulo}>Cor</Text>
            <View style={styles.linhaCores}>
              {PALETA.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.bolinha,
                    { backgroundColor: c },
                    corSelecionada === c && styles.bolinhaSelecionada,
                  ]}
                  onPress={() => setCorSelecionada(c)}
                />
              ))}
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity style={styles.btnCancelar} onPress={aoFechar}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnConfirmar, !nome.trim() && styles.btnDesabilitado]}
                onPress={handleConfirmar}
                disabled={!nome.trim()}
              >
                <Text style={styles.btnConfirmarTexto}>
                  {dadosIniciais ? 'Salvar' : 'Criar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  caixa: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  titulo: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  rotulo: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    padding: spacing.sm + 2,
    fontSize: 14,
  },
  linhaCores: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  bolinha: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  bolinhaSelecionada: {
    borderWidth: 2.5,
    borderColor: colors.textPrimary,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  btnCancelar: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  btnCancelarTexto: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  btnConfirmar: {
    backgroundColor: colors.accent,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + 4,
  },
  btnDesabilitado: {
    opacity: 0.4,
  },
  btnConfirmarTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
