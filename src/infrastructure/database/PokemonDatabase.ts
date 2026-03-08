import * as SQLite from "expo-sqlite";
import type { PokemonSummary, Pokemon } from "../../domain/entities/Pokemon";
import type { Move } from "../../domain/entities/Move";
import type { Evolution } from "../../domain/entities/Evolution";
import type { PokemonType } from "../../domain/value-objects/PokemonType";

const DB_NAME = "pokedex.db";

let _db: SQLite.SQLiteDatabase | null = null;

function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync(DB_NAME);
  }
  return _db;
}

export async function initDatabase(): Promise<void> {
  const db = getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS pokemon_summary (
      id          INTEGER PRIMARY KEY,
      name        TEXT    NOT NULL,
      sprite_url  TEXT,
      types       TEXT    NOT NULL, -- JSON array
      language    TEXT    NOT NULL,
      updated_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pokemon_moves (
      pokemon_id  INTEGER NOT NULL,
      version     TEXT    NOT NULL,
      level       INTEGER NOT NULL,
      name        TEXT    NOT NULL,
      type        TEXT    NOT NULL,
      power       INTEGER,
      accuracy    INTEGER,
      category    TEXT    NOT NULL,
      PRIMARY KEY (pokemon_id, version, name)
    );

    CREATE TABLE IF NOT EXISTS pokemon_evolutions (
      source_id   INTEGER NOT NULL,
      pokemon_id  INTEGER NOT NULL,
      pokemon_name TEXT   NOT NULL,
      sprite_url  TEXT,
      min_level   INTEGER,
      trigger     TEXT    NOT NULL,
      item        TEXT,
      sort_order  INTEGER NOT NULL,
      PRIMARY KEY (source_id, pokemon_id)
    );
  `);
}

// ─── Summary ────────────────────────────────────────────────────────────────

export async function getSummaryList(
  language: string,
): Promise<PokemonSummary[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{
    id: number;
    name: string;
    sprite_url: string | null;
    types: string;
  }>(
    `SELECT id, name, sprite_url, types FROM pokemon_summary WHERE language = ? ORDER BY id`,
    [language],
  );
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    spriteUrl: r.sprite_url,
    types: JSON.parse(r.types) as PokemonType[],
  }));
}

export async function saveSummaryList(
  list: PokemonSummary[],
  language: string,
): Promise<void> {
  const db = getDb();
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    for (const p of list) {
      await db.runAsync(
        `INSERT OR REPLACE INTO pokemon_summary (id, name, sprite_url, types, language, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.spriteUrl, JSON.stringify(p.types), language, now],
      );
    }
  });
}

// ─── Detail (moves + evolutions) ───────────────────────────────────────────

export async function getPokemonDetail(
  id: number,
  version: string,
  language: string,
): Promise<Pokemon | null> {
  const db = getDb();

  const summary = await db.getFirstAsync<{
    id: number;
    name: string;
    sprite_url: string | null;
    types: string;
  }>(
    `SELECT id, name, sprite_url, types FROM pokemon_summary WHERE id = ? AND language = ?`,
    [id, language],
  );

  if (!summary) return null;

  const moveRows = await db.getAllAsync<{
    level: number;
    name: string;
    type: string;
    power: number | null;
    accuracy: number | null;
    category: string;
  }>(
    `SELECT level, name, type, power, accuracy, category
     FROM pokemon_moves WHERE pokemon_id = ? AND version = ? ORDER BY level`,
    [id, version],
  );

  const evoRows = await db.getAllAsync<{
    pokemon_id: number;
    pokemon_name: string;
    sprite_url: string | null;
    min_level: number | null;
    trigger: string;
    item: string | null;
  }>(
    `SELECT pokemon_id, pokemon_name, sprite_url, min_level, trigger, item
     FROM pokemon_evolutions WHERE source_id = ? ORDER BY sort_order`,
    [id],
  );

  return {
    id: summary.id,
    name: summary.name,
    spriteUrl: summary.sprite_url,
    types: JSON.parse(summary.types) as PokemonType[],
    moves: moveRows.map((m) => ({
      level: m.level,
      name: m.name,
      type: m.type as PokemonType,
      power: m.power,
      accuracy: m.accuracy,
      category: m.category as Move["category"],
    })),
    evolutionChain: evoRows.map((e) => ({
      pokemonId: e.pokemon_id,
      pokemonName: e.pokemon_name,
      spriteUrl: e.sprite_url,
      minLevel: e.min_level,
      trigger: e.trigger as Evolution["trigger"],
      item: e.item,
    })),
  };
}

export async function savePokemonDetail(
  pokemon: Pokemon,
  version: string,
  language: string,
): Promise<void> {
  const db = getDb();
  await db.withTransactionAsync(async () => {
    // Ensure summary exists
    await db.runAsync(
      `INSERT OR REPLACE INTO pokemon_summary (id, name, sprite_url, types, language, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        pokemon.id,
        pokemon.name,
        pokemon.spriteUrl,
        JSON.stringify(pokemon.types),
        language,
        Date.now(),
      ],
    );

    // Moves
    for (const m of pokemon.moves) {
      await db.runAsync(
        `INSERT OR REPLACE INTO pokemon_moves (pokemon_id, version, level, name, type, power, accuracy, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pokemon.id,
          version,
          m.level,
          m.name,
          m.type,
          m.power,
          m.accuracy,
          m.category,
        ],
      );
    }

    // Evolutions
    for (let i = 0; i < pokemon.evolutionChain.length; i++) {
      const e = pokemon.evolutionChain[i];
      await db.runAsync(
        `INSERT OR REPLACE INTO pokemon_evolutions
           (source_id, pokemon_id, pokemon_name, sprite_url, min_level, trigger, item, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pokemon.id,
          e.pokemonId,
          e.pokemonName,
          e.spriteUrl,
          e.minLevel,
          e.trigger,
          e.item,
          i,
        ],
      );
    }
  });
}
