// Lista de Pokémon que NÃO são capturáveis em FireRed/LeafGreen (apenas por evento, troca ou não disponíveis)
// Fonte: Bulbapedia, Serebii, experiência da comunidade
// IDs e nomes para fácil referência

export const UNOBTAINABLE_FRLG = [
  // Lendários de evento
  { id: 151, name: "Mew" },
  { id: 201, name: "Unown" }, // Só por troca, não capturável em FRLG
  { id: 249, name: "Lugia" }, // Só por evento/troca
  { id: 250, name: "Ho-Oh" }, // Só por evento/troca
  { id: 251, name: "Celebi" }, // Só por evento/troca
  { id: 385, name: "Jirachi" }, // Só por evento/troca
  { id: 386, name: "Deoxys" }, // Só por evento/troca
  // Outros não disponíveis normalmente
  { id: 172, name: "Pichu" }, // Só por breeding/troca
  { id: 173, name: "Cleffa" }, // Só por breeding/troca
  { id: 174, name: "Igglybuff" }, // Só por breeding/troca
  { id: 175, name: "Togepi" }, // Só por ovo de evento
  { id: 236, name: "Tyrogue" }, // Só por breeding/troca
  { id: 238, name: "Smoochum" }, // Só por breeding/troca
  { id: 239, name: "Elekid" }, // Só por breeding/troca
  { id: 240, name: "Magby" }, // Só por breeding/troca
  { id: 246, name: "Larvitar" }, // Só pós-game, mas não selvagem
  { id: 298, name: "Azurill" }, // Só por breeding/troca
  // Adicione outros conforme necessário
];

// Função utilitária para checar se um Pokémon é indisponível
export function isUnobtainableInFRLG(pokemonId: number): boolean {
  return UNOBTAINABLE_FRLG.some((p) => p.id === pokemonId);
}
