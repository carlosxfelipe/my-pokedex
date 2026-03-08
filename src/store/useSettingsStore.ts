import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
import type {
  GameVersion,
  DataLanguage,
} from "../domain/value-objects/GameVersion";
import type { PokemonType } from "../domain/value-objects/PokemonType";

// Instância MMKV v4 (Nitro)
const mmkv = createMMKV({ id: "pokedex-settings" });

// Adapter para o Zustand persist
const mmkvStorage: StateStorage = {
  setItem: (key, value) => mmkv.set(key, value),
  getItem: (key) => mmkv.getString(key) ?? null,
  removeItem: (key) => mmkv.remove(key),
};

interface SettingsState {
  gameVersion: GameVersion;
  language: DataLanguage;
  typeFilter: PokemonType | "all";
  showAllGenerations: boolean;
  setGameVersion: (version: GameVersion) => void;
  setLanguage: (language: DataLanguage) => void;
  setTypeFilter: (typeFilter: PokemonType | "all") => void;
  setShowAllGenerations: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist<SettingsState>(
    (set) => ({
      gameVersion: "firered",
      language: "en",
      typeFilter: "all",
      showAllGenerations: false,
      setGameVersion: (gameVersion) => set({ gameVersion }),
      setLanguage: (language) => set({ language }),
      setTypeFilter: (typeFilter) => set({ typeFilter }),
      setShowAllGenerations: (showAllGenerations) =>
        set({ showAllGenerations }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
