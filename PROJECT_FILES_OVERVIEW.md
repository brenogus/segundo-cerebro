# Visão geral dos arquivos do projeto

Este arquivo explica o propósito de cada arquivo e pasta principal do projeto `Segundo Cérebro`.

## Raiz do projeto

- `App.js`
  - Ponto de entrada do app.
  - Inicializa o banco de dados SQLite e monta a navegação entre telas.
  - Usa `SafeAreaProvider` para suportar áreas seguras em dispositivos modernos.

- `app.json`
  - Configuração do Expo para o projeto.
  - Define nome, slug, versão e outras opções de build/expo.

- `package.json`
  - Lista dependências do projeto.
  - Contém scripts úteis como `npm run android` e `npm start`.

- `README.md`
  - Documentação do projeto para desenvolvedores e usuários.
  - Explica como rodar o app, funcionalidades e estrutura.

- `node_modules/`
  - Dependências instaladas do projeto.
  - Não faz parte do código-fonte principal, mas é necessária para rodar o app.

- `android/`
  - Projeto Android nativo gerado pelo Expo/React Native.
  - Contém código de build, manifestos e recursos para gerar APKs.
  - Não é explicado em detalhe aqui porque é gerado automaticamente a partir do fluxo Expo.

## `src/`

### `src/theme.js`
- Define a paleta de cores, espaçamentos e raios usados em todo o app.
- Centraliza valores de estilo para manter consistência visual.

### `src/components/`

- `CartaoCerebro.js`
  - Componente de cartão usado na tela inicial para exibir cada vault/cérebro.
  - Mostra nome, descrição, cor e número de notas.
  - Suporta toque curto e toque longo.

- `ItemNota.js`
  - Componente de item de nota usado na lista de notas de um vault.
  - Exibe título, data/atualização e pré-visualização da nota.

- `ModalNovoCerebro.js`
  - Modal para criar ou editar um vault (`cérebro`).
  - Permite preencher nome, descrição e escolher cor.
  - Usa `KeyboardAvoidingView` para manter o teclado fora do caminho.

- `PreviewMarkdown.js`
  - Renderiza o conteúdo de notas em Markdown simples.
  - Converte títulos, listas, citações, divisores e estilos inline como negrito, itálico, código e links `[[Nome da Nota]]`.
  - Permite tocar em wikilinks para navegar entre notas.

### `src/screens/`

- `TelaInicial.js`
  - Tela inicial do app.
  - Lista todos os vaults existentes.
  - Exibe cabeçalho, botão para criar novo vault e tela vazia quando não há itens.
  - Recarrega a lista de vaults quando a tela recebe foco.

- `TelaCerebro.js`
  - Tela que mostra as notas dentro de um vault/cérebro.
  - Permite buscar notas por título, abrir e deletar notas.
  - Tem botão flutuante para criar uma nova nota.

- `TelaEditor.js`
  - Tela de edição de nota.
  - Possui modo `editar` e `preview` para alternar entre escrever Markdown e ver o conteúdo renderizado.
  - Inclui uma barra de ferramentas de Markdown para inserir formatação rápida.
  - Carrega a nota existente ao abrir e salva alterações no banco.

### `src/utils/`

- `armazenamento.js`
  - Implementa todas as operações de banco de dados com `expo-sqlite`.
  - Cria tabelas `cerebros` e `notas` na primeira execução.
  - Expõe funções para ler, salvar, atualizar e deletar vaults e notas.
  - Gera IDs únicos simples para registros.

- `markdownUtil.js`
  - Funções de utilitários para processar o Markdown simples do app.
  - `extrairWikiLinks` encontra links no formato `[[Nome da Nota]]`.
  - `tokenizarLinha` quebra uma linha em tokens inline como link, negrito, itálico e código.
  - `classificarLinha` identifica o tipo de linha (`h1`, `h2`, `li`, `quote`, `hr`, `blank`, `p`).

## Observações gerais

- A maior parte do app é construída em torno de dados locais SQLite e navegação com `@react-navigation/native`.
- A interface usa um tema escuro unificado definido em `src/theme.js`.
- O app não possui backend remoto: tudo é armazenado localmente no dispositivo.
- O APK gerado pelo build fica em `android/app/build/outputs/apk/release/app-release.apk`.
