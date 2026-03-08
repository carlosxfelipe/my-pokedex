import type { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import type { Pokemon, PokemonSummary } from "../../domain/entities/Pokemon";
import type {
  GameVersion,
  DataLanguage,
} from "../../domain/value-objects/GameVersion";
import { cachedGet } from "./PokeApiClient";
import type {
  ApiPokemon,
  ApiPokemonSpecies,
  ApiEvolutionChain,
  ApiMoveDetail,
} from "./PokeApiTypes";
import {
  mapSummary,
  mapMoves,
  mapEvolutionChain,
  mapPokemon,
} from "./mappers/PokemonMapper";
import {
  getSummaryList,
  saveSummaryList,
  getPokemonDetail,
  savePokemonDetail,
} from "../database/PokemonDatabase";

const NATIONAL_TOTAL = 386;

export class PokemonRepository implements IPokemonRepository {
  async listKanto(language: DataLanguage): Promise<PokemonSummary[]> {
    // 1. Tenta o cache SQLite
    const cached = await getSummaryList(language);
    if (cached.length === NATIONAL_TOTAL) return cached;

    // 2. Vai à API em lotes (chunks) para não estourar os limites da PokéAPI
    const ids = Array.from({ length: NATIONAL_TOTAL }, (_, i) => i + 1);
    const results: PokemonSummary[] = [];
    const chunkSize = 50;

    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (id) => {
          const [pokemon, species] = await Promise.all([
            cachedGet<ApiPokemon>(`/pokemon/${id}`),
            cachedGet<ApiPokemonSpecies>(`/pokemon-species/${id}`),
          ]);
          return mapSummary(pokemon, species, language);
        }),
      );
      results.push(...chunkResults);
    }

    await saveSummaryList(results, language);
    return results;
  }

  async getDetail(
    idOrName: number | string,
    version: GameVersion,
    language: DataLanguage,
  ): Promise<Pokemon> {
    const numericId =
      typeof idOrName === "number" ? idOrName : parseInt(String(idOrName), 10);

    // 1. Tenta o cache SQLite
    if (!isNaN(numericId)) {
      const cached = await getPokemonDetail(numericId, version, language);
      if (cached && cached.moves.length > 0) return cached;
    }

    // 2. Vai à API
    const [pokemon, species] = await Promise.all([
      cachedGet<ApiPokemon>(`/pokemon/${idOrName}`),
      cachedGet<ApiPokemonSpecies>(`/pokemon-species/${idOrName}`),
    ]);

    const summary = mapSummary(pokemon, species, language);

    const frlgMoveNames = pokemon.moves
      .filter((m) =>
        m.version_group_details.some(
          (vgd) =>
            vgd.version_group.name === "firered-leafgreen" &&
            vgd.move_learn_method.name === "level-up",
        ),
      )
      .map((m) => m.move.name);

    const moveDetailEntries = await Promise.all(
      frlgMoveNames.map(async (name) => {
        const detail = await cachedGet<ApiMoveDetail>(`/move/${name}`);
        return [name, detail] as const;
      }),
    );
    const moveDetails = new Map(moveDetailEntries);
    const moves = mapMoves(pokemon, version, moveDetails, language);

    const evolutionChain = await cachedGet<ApiEvolutionChain>(
      species.evolution_chain.url,
    );

    const spriteMap = new Map<number, string | null>();
    const collectIds = (chain: typeof evolutionChain.chain): number[] => {
      const id = extractIdFromUrl(chain.species.url);
      if (id > 386) return [];
      return [id, ...chain.evolves_to.flatMap(collectIds)];
    };
    const chainIds = collectIds(evolutionChain.chain);
    await Promise.all(
      chainIds.map(async (id) => {
        const p = await cachedGet<ApiPokemon>(`/pokemon/${id}`);
        spriteMap.set(
          id,
          p.sprites.other["official-artwork"].front_default ??
            p.sprites.front_default,
        );
      }),
    );

    const evolutions = mapEvolutionChain(evolutionChain.chain, spriteMap);
    const result = mapPokemon(summary, moves, evolutions);

    // 3. Persiste no SQLite
    await savePokemonDetail(result, version, language);

    return result;
  }
}

function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}
