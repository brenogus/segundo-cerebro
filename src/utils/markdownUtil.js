// extrai links no formato [[Nome da Nota]] do texto
function extrairWikiLinks(texto) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(texto)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)]; // remove duplicatas
}

// divide o texto em tokens para renderização inline
// cada token tem type: 'text' | 'link' | 'bold' | 'italic' | 'code'
function tokenizarLinha(linha) {
  const tokens = [];
  // regex combinando [[link]], **bold**, *italic*, `code`
  const padrao = /(\[\[[^\]]+\]\])|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g;
  let ultimoIndice = 0;
  let match;

  while ((match = padrao.exec(linha)) !== null) {
    if (match.index > ultimoIndice) {
      tokens.push({ type: 'text', value: linha.slice(ultimoIndice, match.index) });
    }

    const raw = match[0];
    if (raw.startsWith('[[')) {
      tokens.push({ type: 'link', value: raw.slice(2, -2).trim() });
    } else if (raw.startsWith('**')) {
      tokens.push({ type: 'bold', value: raw.slice(2, -2) });
    } else if (raw.startsWith('*')) {
      tokens.push({ type: 'italic', value: raw.slice(1, -1) });
    } else if (raw.startsWith('`')) {
      tokens.push({ type: 'code', value: raw.slice(1, -1) });
    }

    ultimoIndice = match.index + raw.length;
  }

  if (ultimoIndice < linha.length) {
    tokens.push({ type: 'text', value: linha.slice(ultimoIndice) });
  }

  return tokens;
}

// converte uma linha em tipo estrutural
function classificarLinha(linha) {
  if (linha.startsWith('# ')) return { type: 'h1', content: linha.slice(2) };
  if (linha.startsWith('## ')) return { type: 'h2', content: linha.slice(3) };
  if (linha.startsWith('### ')) return { type: 'h3', content: linha.slice(4) };
  if (linha.startsWith('- ') || linha.startsWith('* ')) return { type: 'li', content: linha.slice(2) };
  if (linha.startsWith('> ')) return { type: 'quote', content: linha.slice(2) };
  if (linha.startsWith('---') && linha.trim() === '---') return { type: 'hr', content: '' };
  if (linha.trim() === '') return { type: 'blank', content: '' };
  return { type: 'p', content: linha };
}

export { extrairWikiLinks, tokenizarLinha, classificarLinha };
