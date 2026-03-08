import type { PokemonType } from "../value-objects/PokemonType";
import type { Move } from "./Move";
import type { Evolution } from "./Evolution";

export interface PokemonSummary {
  id: number;
  name: string;
  spriteUrl: string | null;
  types: PokemonType[];
}

export interface Pokemon extends PokemonSummary {
  moves: Move[];
  evolutionChain: Evolution[];
}
