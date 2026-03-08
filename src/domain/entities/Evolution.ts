export type EvolutionTrigger = "level-up" | "use-item" | "trade" | "other";

export interface Evolution {
  fromId: number;
  fromName: string;
  fromSpriteUrl: string | null;
  toId: number;
  toName: string;
  toSpriteUrl: string | null;
  minLevel: number | null; // null = não evolui por level
  trigger: EvolutionTrigger;
  item: string | null; // ex: "fire-stone"
}
