import type { PokemonType } from "../value-objects/PokemonType";

export type MoveCategory = "physical" | "special" | "status";

export interface Move {
  name: string;
  level: number; // 0 = TM / Tutor
  type: PokemonType;
  power: number | null;
  accuracy: number | null;
  category: MoveCategory;
}
