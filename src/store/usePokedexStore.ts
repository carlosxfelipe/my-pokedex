import { create } from "zustand";
import type { PokemonSummary, Pokemon } from "../domain/entities/Pokemon";
import type {
  GameVersion,
  DataLanguage,
} from "../domain/value-objects/GameVersion";
import { SearchPokemonUseCase } from "../application/use-cases/SearchPokemon";
import { GetPokemonDetailUseCase } from "../application/use-cases/GetPokemonDetail";
import { PokemonRepository } from "../infrastructure/pokeapi/PokemonRepository";

const repository = new PokemonRepository();
const searchUseCase = new SearchPokemonUseCase(repository);
const detailUseCase = new GetPokemonDetailUseCase(repository);

interface PokedexState {
  // Lista
  list: PokemonSummary[];
  listLoading: boolean;
  listError: string | null;
  searchQuery: string;
  // Detalhe
  selectedPokemon: Pokemon | null;
  detailLoading: boolean;
  detailError: string | null;
  // Ações
  loadList: (language: DataLanguage, limit: number) => Promise<void>;
  loadDetail: (
    idOrName: number | string,
    version: GameVersion,
    language: DataLanguage,
  ) => Promise<void>;
  clearDetail: () => void;
  setSearchQuery: (query: string) => void;
}

export const usePokedexStore = create<PokedexState>()((set) => ({
  list: [],
  listLoading: false,
  listError: null,
  searchQuery: "",
  selectedPokemon: null,
  detailLoading: false,
  detailError: null,

  loadList: async (language, limit) => {
    set({ listLoading: true, listError: null });
    try {
      const list = await searchUseCase.execute(language, limit);
      set({ list, listLoading: false });
    } catch (e: any) {
      set({
        listLoading: false,
        listError: e.message ?? "Erro ao carregar lista",
      });
    }
  },

  loadDetail: async (idOrName, version, language) => {
    set({ detailLoading: true, detailError: null, selectedPokemon: null });
    try {
      const pokemon = await detailUseCase.execute(idOrName, version, language);
      set({ selectedPokemon: pokemon, detailLoading: false });
    } catch (e: any) {
      set({
        detailLoading: false,
        detailError: e.message ?? "Erro ao carregar Pokémon",
      });
    }
  },

  clearDetail: () => set({ selectedPokemon: null }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
