import type { GameVersion } from "../domain/value-objects/GameVersion";

// IDs originais da Gen 1 Kanto (1-151)
export const EXCLUSIVES = {
  firered: [
    23,
    24, // Ekans, Arbok
    43,
    44,
    45, // Oddish, Gloom, Vileplume
    54,
    55, // Psyduck, Golduck
    58,
    59, // Growlithe, Arcanine
    90,
    91, // Shellder, Cloyster
    123, // Scyther
    125, // Electabuzz
  ],
  leafgreen: [
    27,
    28, // Sandshrew, Sandslash
    37,
    38, // Vulpix, Ninetales
    52,
    53, // Meowth, Persian
    69,
    70,
    71, // Bellsprout, Weepinbell, Victreebel
    79,
    80, // Slowpoke, Slowbro
    120,
    121, // Staryu, Starmie
    126, // Magmar
    127, // Pinsir
  ],
};

/**
 * Retorna `true` se o Pokémon for capturável nativamente na versão selecionada.
 * (Retorna false se for exclusivo da versão oposta).
 */
export function isCatchable(pokemonId: number, version: GameVersion): boolean {
  if (version === "firered" && EXCLUSIVES.leafgreen.includes(pokemonId)) {
    return false;
  }
  if (version === "leafgreen" && EXCLUSIVES.firered.includes(pokemonId)) {
    return false;
  }
  return true;
}
