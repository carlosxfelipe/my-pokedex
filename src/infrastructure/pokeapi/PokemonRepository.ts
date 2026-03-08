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
    // 1. Tenta o cache SQLite
    const cached = await getSummaryList(language);
    const cachedIds = new Set(cached.map((p) => p.id));

    // 2. Identifica quais IDs de 1 até o limite NÃO estão no cache
    const missingIds: number[] = [];
    for (let id = 1; id <= limit; id++) {
      if (!cachedIds.has(id)) {
        missingIds.push(id);
      }
    }

    // Se não falta nada, devolve o cache filtrado pelo limite
    if (missingIds.length === 0) {
      return cached.filter((p) => p.id <= limit);
    }

    // 3. Busca apenas os IDs que faltam em lotes (chunks)
    const results: PokemonSummary[] = [];
    const chunkSize = 50;

    for (let i = 0; i < missingIds.length; i += chunkSize) {
      const chunk = missingIds.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (id) => {
          try {
            const [pokemon, species] = await Promise.all([
              cachedGet<ApiPokemon>(`/pokemon/${id}`),
              cachedGet<ApiPokemonSpecies>(`/pokemon-species/${id}`),
            ]);
            return mapSummary(pokemon, species, language);
          } catch (e) {
            console.warn(`Erro ao carregar summary do Pokémon ${id}:`, e);
            return null;
          }
        }),
      );

      // Filtra nulos em caso de falha individual na API
      for (const res of chunkResults) {
        if (res) results.push(res);
      }
    }

    // 4. Salva as novidades e devolve a lista completa e ordenada
    if (results.length > 0) {
      await saveSummaryList(results, language);
    }

    const fullList = [...cached, ...results].sort((a, b) => a.id - b.id);
    return fullList.filter((p) => p.id <= limit);
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
