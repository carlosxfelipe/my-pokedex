import type { PokemonType } from "../domain/value-objects/PokemonType";

type OffenseConfig = {
  superEffective: PokemonType[];
  notVeryEffective: PokemonType[];
  noEffect: PokemonType[];
};

export const OFFENSIVE_MATCHUPS: Record<PokemonType, OffenseConfig> = {
  normal: {
    superEffective: [],
    notVeryEffective: ["rock", "steel"],
    noEffect: ["ghost"],
  },
  fire: {
    superEffective: ["grass", "ice", "bug", "steel"],
    notVeryEffective: ["fire", "water", "rock", "dragon"],
    noEffect: [],
  },
  water: {
    superEffective: ["fire", "ground", "rock"],
    notVeryEffective: ["water", "grass", "dragon"],
    noEffect: [],
  },
  electric: {
    superEffective: ["water", "flying"],
    notVeryEffective: ["electric", "grass", "dragon"],
    noEffect: ["ground"],
  },
  grass: {
    superEffective: ["water", "ground", "rock"],
    notVeryEffective: [
      "fire",
      "grass",
      "poison",
      "flying",
      "bug",
      "dragon",
      "steel",
    ],
    noEffect: [],
  },
  ice: {
    superEffective: ["grass", "ground", "flying", "dragon"],
    notVeryEffective: ["fire", "water", "ice", "steel"],
    noEffect: [],
  },
  fighting: {
    superEffective: ["normal", "ice", "rock", "dark", "steel"],
    notVeryEffective: ["poison", "flying", "psychic", "bug", "fairy"],
    noEffect: ["ghost"],
  },
  poison: {
    superEffective: ["grass", "fairy"],
    notVeryEffective: ["poison", "ground", "rock", "ghost"],
    noEffect: ["steel"],
  },
  ground: {
    superEffective: ["fire", "electric", "poison", "rock", "steel"],
    notVeryEffective: ["grass", "bug"],
    noEffect: ["flying"],
  },
  flying: {
    superEffective: ["grass", "fighting", "bug"],
    notVeryEffective: ["electric", "rock", "steel"],
    noEffect: [],
  },
  psychic: {
    superEffective: ["fighting", "poison"],
    notVeryEffective: ["psychic", "steel"],
    noEffect: ["dark"],
  },
  bug: {
    superEffective: ["grass", "psychic", "dark"],
    notVeryEffective: [
      "fire",
      "fighting",
      "poison",
      "flying",
      "ghost",
      "steel",
      "fairy",
    ],
    noEffect: [],
  },
  rock: {
    superEffective: ["fire", "ice", "flying", "bug"],
    notVeryEffective: ["fighting", "ground", "steel"],
    noEffect: [],
  },
  ghost: {
    superEffective: ["psychic", "ghost"],
    notVeryEffective: ["dark"],
    noEffect: ["normal"],
  },
  dragon: {
    superEffective: ["dragon"],
    notVeryEffective: ["steel"],
    noEffect: ["fairy"],
  },
  dark: {
    superEffective: ["psychic", "ghost"],
    notVeryEffective: ["fighting", "dark", "fairy"],
    noEffect: [],
  },
  steel: {
    superEffective: ["ice", "rock", "fairy"],
    notVeryEffective: ["fire", "water", "electric", "steel"],
    noEffect: [],
  },
  fairy: {
    superEffective: ["fighting", "dragon", "dark"],
    notVeryEffective: ["fire", "poison", "steel"],
    noEffect: [],
  },
};

export function getDefensiveMatchups(defenderType: PokemonType) {
  const vulnerableTo: PokemonType[] = [];
  const resistantTo: PokemonType[] = [];
  const immuneTo: PokemonType[] = [];

  const allTypes = Object.keys(OFFENSIVE_MATCHUPS) as PokemonType[];

  for (const attacker of allTypes) {
    const offense = OFFENSIVE_MATCHUPS[attacker];
    if (offense.superEffective.includes(defenderType)) {
      vulnerableTo.push(attacker);
    } else if (offense.notVeryEffective.includes(defenderType)) {
      resistantTo.push(attacker);
    } else if (offense.noEffect.includes(defenderType)) {
      immuneTo.push(attacker);
    }
  }

  return { vulnerableTo, resistantTo, immuneTo };
}
