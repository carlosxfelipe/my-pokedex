export interface TypeChange {
  id: number;
  name: string;
  typeFRLG: string;
  typeModern: string;
}

export const TYPE_CHANGES: TypeChange[] = [
  { id: 35, name: "Clefairy", typeFRLG: "Normal", typeModern: "Fada" },
  { id: 36, name: "Clefable", typeFRLG: "Normal", typeModern: "Fada" },
  {
    id: 39,
    name: "Jigglypuff",
    typeFRLG: "Normal",
    typeModern: "Normal / Fada",
  },
  {
    id: 40,
    name: "Wigglytuff",
    typeFRLG: "Normal",
    typeModern: "Normal / Fada",
  },
  {
    id: 122,
    name: "Mr. Mime",
    typeFRLG: "Psíquico",
    typeModern: "Psíquico / Fada",
  },
  {
    id: 176,
    name: "Togetic",
    typeFRLG: "Normal / Voador",
    typeModern: "Fada / Voador",
  },
  {
    id: 468,
    name: "Togekiss",
    typeFRLG: "Normal / Voador",
    typeModern: "Fada / Voador",
  },
];

export function getTypeChangeById(pokemonId: number): TypeChange | undefined {
  return TYPE_CHANGES.find((p) => p.id === pokemonId);
}
