import type { GameVersion } from "../domain/value-objects/GameVersion";

export const EXCLUSIVES = {
  firered: [
    23,
    24, // Ekans, Arbok
    43,
    44,
    45,
    182, // Oddish, Gloom, Vileplume, Bellossom
    54,
    55, // Psyduck, Golduck
    58,
    59, // Growlithe, Arcanine
    90,
    91, // Shellder, Cloyster
    123,
    212, // Scyther, Scizor
    125,
    239, // Electabuzz, Elekid
    194,
    195, // Wooper, Quagsire
    198, // Murkrow
    211, // Qwilfish
    225, // Delibird
    227, // Skarmory
  ],
  leafgreen: [
    27,
    28, // Sandshrew, Sandslash
    37,
    38, // Vulpix, Ninetales
    69,
    70,
    71, // Bellsprout, Weepinbell, Victreebel
    79,
    80,
    199, // Slowpoke, Slowbro, Slowking
    120,
    121, // Staryu, Starmie
    126,
    240, // Magmar, Magby
    127, // Pinsir
    183,
    184,
    298, // Marill, Azumarill, Azurill
    200, // Misdreavus
    215, // Sneasel
    223,
    224, // Remoraid, Octillery
    226, // Mantine
  ],
};

/**
 * Retorna qual versão o Pokémon é exclusivo, ou `null` se ambos.
 */
export function getExclusiveVersion(
  pokemonId: number,
): "firered" | "leafgreen" | null {
  if (EXCLUSIVES.firered.includes(pokemonId)) return "firered";
  if (EXCLUSIVES.leafgreen.includes(pokemonId)) return "leafgreen";
  return null;
}
