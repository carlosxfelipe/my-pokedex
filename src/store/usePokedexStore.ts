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
  detailById: Record<string, Pokemon>;
  detailLoadingById: Record<string, boolean>;
  detailErrorById: Record<string, string | null>;
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
  detailById: {},
  detailLoadingById: {},
  detailErrorById: {},

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
    const detailKey = String(idOrName);
    set((state) => ({
      detailLoadingById: { ...state.detailLoadingById, [detailKey]: true },
      detailErrorById: { ...state.detailErrorById, [detailKey]: null },
    }));
    try {
      const pokemon = await detailUseCase.execute(idOrName, version, language);
      const pokemonKey = String(pokemon.id);
      set((state) => ({
        detailById: { ...state.detailById, [pokemonKey]: pokemon },
        detailLoadingById: { ...state.detailLoadingById, [detailKey]: false },
      }));
    } catch (e: any) {
      set((state) => ({
        detailLoadingById: { ...state.detailLoadingById, [detailKey]: false },
        detailErrorById: {
          ...state.detailErrorById,
          [detailKey]: e.message ?? "Erro ao carregar Pokémon",
        },
      }));
    }
  },

  clearDetail: () =>
    set({ detailById: {}, detailLoadingById: {}, detailErrorById: {} }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
