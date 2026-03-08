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
  async listPokemons(
    language: DataLanguage,
    limit: number,
  ): Promise<PokemonSummary[]> {
    // 1. Tenta o cache SQLite, devolve se tivermos na base tudo o que foi pedido!
    const cached = await getSummaryList(language);
    if (cached.length >= limit) return cached.slice(0, limit);

    // 2. O que falta? Vai à API em lotes (chunks) do que faltou buscar
    const startOffset = cached.length;
    const remainingIds = Array.from(
      { length: limit - startOffset },
      (_, i) => i + 1 + startOffset,
    );
    const results: PokemonSummary[] = [];
    const chunkSize = 50;

    for (let i = 0; i < remainingIds.length; i += chunkSize) {
      const chunk = remainingIds.slice(i, i + chunkSize);
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

    // 3. Salva só as novidades em back e une com o LocalDb
    await saveSummaryList(results, language);
    return [...cached, ...results];
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

    // MÁGICA: Detecção de Geração
    // Alguns pokémons acima do 386 nunca existiram no FireRed/LeafGreen.
    // Vamos buscar dinamicamente na versão mais recente que ele aprendeu golpes
    let targetVersionGroup = "firered-leafgreen";
    const hasFrlg = pokemon.moves.some((m) =>
      m.version_group_details.some(
        (vgd) =>
          vgd.version_group.name === "firered-leafgreen" &&
          vgd.move_learn_method.name === "level-up",
      ),
    );

    if (!hasFrlg && pokemon.moves.length > 0) {
      for (const m of pokemon.moves) {
        const levelUpMods = m.version_group_details.filter(
          (vgd) => vgd.move_learn_method.name === "level-up",
        );
        if (levelUpMods.length > 0) {
          targetVersionGroup =
            levelUpMods[levelUpMods.length - 1].version_group.name;
          break;
        }
      }
    }

    const targetMoveNames = pokemon.moves
      .filter((m) =>
        m.version_group_details.some(
          (vgd) =>
            vgd.version_group.name === targetVersionGroup &&
            vgd.move_learn_method.name === "level-up",
        ),
      )
      .map((m) => m.move.name);

    const moveDetailEntries = await Promise.all(
      targetMoveNames.map(async (name) => {
        const detail = await cachedGet<ApiMoveDetail>(`/move/${name}`);
        return [name, detail] as const;
      }),
    );
    const moveDetails = new Map(moveDetailEntries);
    const moves = mapMoves(
      pokemon,
      version,
      moveDetails,
      language,
      targetVersionGroup,
    );

    const evolutionChain = await cachedGet<ApiEvolutionChain>(
      species.evolution_chain.url,
    );

    const spriteMap = new Map<number, string | null>();
    const collectIds = (chain: typeof evolutionChain.chain): number[] => {
      const id = extractIdFromUrl(chain.species.url);
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
