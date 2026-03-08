export type EvolutionTrigger = "level-up" | "use-item" | "trade" | "other";

export interface Evolution {
  pokemonId: number;
  pokemonName: string;
  spriteUrl: string | null;
  minLevel: number | null; // null = não evolui por level
  trigger: EvolutionTrigger;
  item: string | null; // ex: "fire-stone"
}
