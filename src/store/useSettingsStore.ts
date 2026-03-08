import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
import type {
  GameVersion,
  DataLanguage,
} from "../domain/value-objects/GameVersion";

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
  setGameVersion: (version: GameVersion) => void;
  setLanguage: (language: DataLanguage) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist<SettingsState>(
    (set) => ({
      gameVersion: "firered",
      language: "en",
      setGameVersion: (gameVersion) => set({ gameVersion }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
