import * as SQLite from 'expo-sqlite';

// expo-sqlite v14+ (SDK 51) usa openDatabaseAsync
let db = null;

async function getDb() {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('segundo_cerebro.db');
  return db;
}

// cria as tabelas se ainda não existirem
async function inicializarBanco() {
  const banco = await getDb();
  await banco.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS cerebros (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      description TEXT,
      color       TEXT,
      criado_em   TEXT
    );

    CREATE TABLE IF NOT EXISTS notas (
      id          TEXT PRIMARY KEY,
      cerebro_id  TEXT NOT NULL,
      title       TEXT,
      content     TEXT,
      preview     TEXT,
      updated_at  TEXT,
      FOREIGN KEY (cerebro_id) REFERENCES cerebros(id) ON DELETE CASCADE
    );
  `);
}

// ── Cérebros ──────────────────────────────────────────────

async function getCerebros() {
  try {
    const banco = await getDb();
    const linhas = await banco.getAllAsync('SELECT * FROM cerebros ORDER BY criado_em ASC');
    return linhas;
  } catch (e) {
    console.warn('getCerebros erro:', e);
    return [];
  }
}

async function salvarCerebro(cerebro) {
  try {
    const banco = await getDb();
    await banco.runAsync(
      `INSERT INTO cerebros (id, name, description, color, criado_em)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name        = excluded.name,
         description = excluded.description,
         color       = excluded.color`,
      [cerebro.id, cerebro.name, cerebro.description ?? '', cerebro.color ?? '', cerebro.criadoEm ?? new Date().toISOString()]
    );
    return true;
  } catch (e) {
    console.warn('salvarCerebro erro:', e);
    return false;
  }
}

async function deletarCerebro(cerebroId) {
  try {
    const banco = await getDb();
    // CASCADE apaga as notas junto (definido no schema)
    await banco.runAsync('DELETE FROM cerebros WHERE id = ?', [cerebroId]);
    return true;
  } catch (e) {
    console.warn('deletarCerebro erro:', e);
    return false;
  }
}

// ── Notas ─────────────────────────────────────────────────

async function getNota(cerebroId, notaId) {
  try {
    const banco = await getDb();
    const linha = await banco.getFirstAsync(
      'SELECT * FROM notas WHERE id = ? AND cerebro_id = ?',
      [notaId, cerebroId]
    );
    return linha ?? null;
  } catch (e) {
    console.warn('getNota erro:', e);
    return null;
  }
}

async function salvarNota(cerebroId, nota) {
  try {
    const banco = await getDb();
    await banco.runAsync(
      `INSERT INTO notas (id, cerebro_id, title, content, preview, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         title      = excluded.title,
         content    = excluded.content,
         preview    = excluded.preview,
         updated_at = excluded.updated_at`,
      [nota.id, cerebroId, nota.title ?? '', nota.content ?? '', nota.preview ?? '', nota.updatedAt ?? new Date().toISOString()]
    );
    return true;
  } catch (e) {
    console.warn('salvarNota erro:', e);
    return false;
  }
}

async function getListaNotas(cerebroId) {
  try {
    const banco = await getDb();
    const linhas = await banco.getAllAsync(
      'SELECT id, title, preview, updated_at as updatedAt FROM notas WHERE cerebro_id = ? ORDER BY updated_at DESC',
      [cerebroId]
    );
    return linhas;
  } catch (e) {
    console.warn('getListaNotas erro:', e);
    return [];
  }
}

async function deletarNota(cerebroId, notaId) {
  try {
    const banco = await getDb();
    await banco.runAsync('DELETE FROM notas WHERE id = ? AND cerebro_id = ?', [notaId, cerebroId]);
    return true;
  } catch (e) {
    console.warn('deletarNota erro:', e);
    return false;
  }
}

// ── Util ──────────────────────────────────────────────────

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export {
  inicializarBanco,
  getCerebros,
  salvarCerebro,
  deletarCerebro,
  getNota,
  salvarNota,
  getListaNotas,
  deletarNota,
  gerarId,
};
