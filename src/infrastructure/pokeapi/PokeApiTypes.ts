// Tipos crus da PokéAPI — apenas o que usamos

export interface ApiNamedResource {
  name: string;
  url: string;
}

export interface ApiPokemon {
  id: number;
  name: string;
  types: { slot: number; type: ApiNamedResource }[];
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  moves: {
    move: ApiNamedResource;
    version_group_details: {
      level_learned_at: number;
      move_learn_method: ApiNamedResource;
      version_group: ApiNamedResource;
    }[];
  }[];
}

export interface ApiPokemonSpecies {
  id: number;
  names: { name: string; language: ApiNamedResource }[];
  evolution_chain: { url: string };
}

export interface ApiEvolutionChain {
  chain: ApiChainLink;
}

export interface ApiChainLink {
  species: ApiNamedResource;
  evolves_to: ApiChainLink[];
  evolution_details: {
    trigger: ApiNamedResource;
    min_level: number | null;
    item: ApiNamedResource | null;
  }[];
}

export interface ApiMove {
  name: string;
  type: { type: ApiNamedResource } | ApiNamedResource;
  damage_class: ApiNamedResource;
  power: number | null;
  accuracy: number | null;
}

export interface ApiMoveDetail {
  name: string;
  names: { name: string; language: ApiNamedResource }[];
  type: ApiNamedResource;
  damage_class: ApiNamedResource;
  power: number | null;
  accuracy: number | null;
}
