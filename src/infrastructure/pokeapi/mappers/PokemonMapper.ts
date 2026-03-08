import type { PokemonSummary, Pokemon } from "../../../domain/entities/Pokemon";
import type {
  Evolution,
  EvolutionTrigger,
} from "../../../domain/entities/Evolution";
import type { Move } from "../../../domain/entities/Move";
import type { PokemonType } from "../../../domain/value-objects/PokemonType";
import type { DataLanguage } from "../../../domain/value-objects/GameVersion";
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
  version: "firered" | "leafgreen",
  moveDetails: Map<string, ApiMoveDetail>,
  language: DataLanguage,
): Move[] {
  const moves: Move[] = [];

  for (const entry of api.moves) {
    const versionDetail = entry.version_group_details.find(
      (vgd) =>
        vgd.version_group.name === "firered-leafgreen" &&
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

function extractEvolutions(
  link: ApiChainLink,
  spriteMap: Map<number, string | null>,
): Evolution[] {
  const result: Evolution[] = [];

  for (const next of link.evolves_to) {
    const detail = next.evolution_details[0];
    const trigger = detail?.trigger?.name ?? "other";
    const nameSlug = next.species.name;
    const id = extractIdFromUrl(next.species.url);

    result.push({
      pokemonId: id,
      pokemonName: nameSlug,
      spriteUrl: spriteMap.get(id) ?? null,
      minLevel: detail?.min_level ?? null,
      trigger: trigger as EvolutionTrigger,
      item: detail?.item?.name ?? null,
    });

    result.push(...extractEvolutions(next, spriteMap));
  }

  return result;
}

export function mapEvolutionChain(
  chain: ApiChainLink,
  spriteMap: Map<number, string | null>,
): Evolution[] {
  return extractEvolutions(chain, spriteMap);
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
