# 🧠 Segundo Cérebro

Um app de notas pessoal para Android e iOS inspirado no conceito de *second brain* — ou seja, um lugar pra guardar o que você aprende antes de esquecer. Funciona como um Obsidian mobile bem simples: você cria vaults (chamados de "cérebros"), escreve notas em Markdown dentro deles e pode linkar notas entre si com a sintaxe `[[Nome da Nota]]`.

Feito com **React Native + Expo**, armazenamento local em **SQLite** via `expo-sqlite`.

---

## Funcionalidades

- Criar, editar e deletar múltiplos vaults (cada um com nome, cor e descrição)
- Criar, editar e deletar notas dentro de cada vault
- Editor de Markdown com barra de atalhos (H1, H2, negrito, itálico, código, citação, lista)
- Links entre notas com `[[Nome da Nota]]` — toca no link e vai direto pra nota; se não existir, oferece criar
- Preview de Markdown renderizado (títulos, listas, citações, negrito, itálico, código inline)
- Rodapé do editor mostrando todos os links da nota aberta (azul = nota existe, cinza = link quebrado)
- Busca de notas por título dentro do vault
- Persistência local com SQLite (os dados ficam no dispositivo)

---

## Estrutura do projeto

```
SegundoCerebro/
├── App.js                              # ponto de entrada, navegação e inicialização do banco
├── package.json
├── README.md
└── src/
    ├── theme.js                        # paleta de cores, espaçamentos e bordas
    ├── components/
    │   ├── CartaoCerebro.js            # cartão de vault na tela inicial
    │   ├── ItemNota.js                 # item de nota na lista do vault
    │   ├── ModalNovoCerebro.js         # modal pra criar ou editar um vault
    │   └── PreviewMarkdown.js          # renderizador de Markdown com suporte a wikilinks
    ├── screens/
    │   ├── TelaInicial.js              # lista de vaults
    │   ├── TelaCerebro.js              # lista de notas de um vault
    │   └── TelaEditor.js              # editor de nota (modo edição e preview)
    └── utils/
        ├── armazenamento.js            # todas as operações SQLite (CRUD de vaults e notas)
        └── markdownUtil.js             # parser de wikilinks e tokenizador inline de Markdown
```

---

## Como rodar

### Opção 1 — Expo Snack (sem instalar nada)

1. Acesse [snack.expo.dev](https://snack.expo.dev)
2. Apague os arquivos padrão que o Snack cria
3. Suba todos os arquivos desse projeto mantendo a estrutura de pastas
4. O Snack já tem o `expo-sqlite` disponível — é só rodar no preview

### Opção 2 — Local com Expo Go

Pré-requisitos: Node.js 18+, Expo CLI

```bash
# instala as dependências
npm install

# inicia o servidor de desenvolvimento
npx expo start
```

Depois escaneia o QR code com o **Expo Go** no celular (Android ou iOS).

### Opção 3 — Gerar APK

Para gerar um APK de desenvolvimento:

```bash
npx expo run:android
```

Ou com EAS Build (recomendado para APK de produção):

```bash
npm install -g eas-cli
eas build -p android --profile preview
```

---

## Banco de dados

O app usa **SQLite** local via `expo-sqlite` (SDK 51, API assíncrona). O banco é criado automaticamente na primeira vez que o app abre.

### Tabelas

**`cerebros`**
| coluna | tipo | descrição |
|---|---|---|
| id | TEXT PK | identificador único (gerado no app) |
| name | TEXT | nome do vault |
| description | TEXT | descrição opcional |
| color | TEXT | cor do avatar em hex |
| criado_em | TEXT | data de criação em ISO 8601 |

**`notas`**
| coluna | tipo | descrição |
|---|---|---|
| id | TEXT PK | identificador único |
| cerebro_id | TEXT FK | referência ao vault pai |
| title | TEXT | título da nota |
| content | TEXT | conteúdo em Markdown |
| preview | TEXT | primeiros 120 chars sem sintaxe MD |
| updated_at | TEXT | última atualização em ISO 8601 |

> A chave estrangeira tem `ON DELETE CASCADE`, ou seja, deletar um vault apaga todas as suas notas automaticamente.

---

## Sintaxe Markdown suportada

| Sintaxe | Resultado |
|---|---|
| `# Título` | Título H1 |
| `## Subtítulo` | Título H2 |
| `### Seção` | Título H3 |
| `**texto**` | **negrito** |
| `*texto*` | *itálico* |
| `` `código` `` | código inline |
| `> texto` | citação |
| `- item` | item de lista |
| `[[Nome da Nota]]` | link para outra nota |
| `---` | linha divisória |

---

## Tecnologias usadas

| Lib | Versão | Pra que serve |
|---|---|---|
| React Native | 0.74 | base do app |
| Expo | 51 | ambiente de build e APIs nativas |
| expo-sqlite | 14 | banco de dados SQLite local |
| @react-navigation/native | 6 | navegação entre telas |
| @react-navigation/native-stack | 6 | stack de navegação nativa |

---

## Próximos passos (ideias)

- [ ] Tags nas notas
- [ ] Grafo de conexões entre notas
- [ ] Busca pelo conteúdo das notas (não só título)
- [ ] Exportar notas como `.md`
- [ ] Ordenação configurável (por data, alfabética)
- [ ] Modo claro
