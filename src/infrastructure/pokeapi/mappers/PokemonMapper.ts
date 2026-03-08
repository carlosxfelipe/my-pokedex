import type { PokemonSummary, Pokemon } from "../../../domain/entities/Pokemon";
import type {
  Evolution,
  EvolutionTrigger,
} from "../../../domain/entities/Evolution";
import type { Move } from "../../../domain/entities/Move";
import type { PokemonType } from "../../../domain/value-objects/PokemonType";
import type {
  GameVersion,
  DataLanguage,
} from "../../../domain/value-objects/GameVersion";
import type {
  ApiPokemon,
  ApiPokemonSpecies,
  ApiChainLink,
  ApiMoveDetail,
} from "../PokeApiTypes";

function getLocalizedName(
  names: { name: string; language: { name: string } }[],
  language: DataLanguage,
): string | null {
  return names.find((n) => n.language.name === language)?.name ?? null;
}

export function mapSummary(
  api: ApiPokemon,
  species: ApiPokemonSpecies,
  language: DataLanguage,
): PokemonSummary {
  const localizedName = getLocalizedName(species.names, language);
  return {
    id: api.id,
    name: localizedName ?? api.name,
    spriteUrl:
      api.sprites.other["official-artwork"].front_default ??
      api.sprites.front_default,
    types: api.types
      .sort((a, b) => a.slot - b.slot)
      .map((t) => t.type.name as PokemonType),
  };
}

export function mapMoves(
  api: ApiPokemon,
  version: GameVersion,
  moveDetails: Map<string, ApiMoveDetail>,
  language: DataLanguage,
  targetVersionGroup: string = "firered-leafgreen",
): Move[] {
  const moves: Move[] = [];

  for (const entry of api.moves) {
    const versionDetail = entry.version_group_details.find(
      (vgd) =>
        vgd.version_group.name === targetVersionGroup &&
        vgd.move_learn_method.name === "level-up",
    );
    if (!versionDetail) continue;

    const detail = moveDetails.get(entry.move.name);
    if (!detail) continue;

    const localizedName =
      getLocalizedName(detail.names, language) ??
      entry.move.name.replace(/-/g, " ");

    moves.push({
      name: localizedName,
      level: versionDetail.level_learned_at,
      type: detail.type.name as PokemonType,
      power: detail.power,
      accuracy: detail.accuracy,
      category: detail.damage_class.name as Move["category"],
    });
  }

  return moves.sort((a, b) => a.level - b.level);
}

export function mapEvolutionChain(
  chain: ApiChainLink,
  spriteMap: Map<number, string | null>,
): Evolution[] {
  const evolutions: Evolution[] = [];

  // Adiciona o primeiro Pokémon da cadeia (forma base)
  const rootId = extractIdFromUrl(chain.species.url);
  evolutions.push({
    pokemonId: rootId,
    pokemonName: chain.species.name,
    spriteUrl: spriteMap.get(rootId) ?? null,
    minLevel: null,
    trigger: "level-up",
    item: null,
  });

  // Função interna recursiva para percorrer as evoluções seguintes
  const processChain = (link: ApiChainLink) => {
    for (const next of link.evolves_to) {
      const detail = next.evolution_details[0];
      const trigger = detail?.trigger?.name ?? "other";
      const id = extractIdFromUrl(next.species.url);

      evolutions.push({
        pokemonId: id,
        pokemonName: next.species.name,
        spriteUrl: spriteMap.get(id) ?? null,
        minLevel: detail?.min_level ?? null,
        trigger: trigger as EvolutionTrigger,
        item: detail?.item?.name ?? null,
      });

      processChain(next);
    }
  };

  processChain(chain);
  return evolutions;
}

export function mapPokemon(
  summary: PokemonSummary,
  moves: Move[],
  evolutionChain: Evolution[],
): Pokemon {
  return { ...summary, moves, evolutionChain };
}

function extractIdFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return parseInt(parts[parts.length - 1], 10);
}
