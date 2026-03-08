import type { Pokemon, PokemonSummary } from "../entities/Pokemon";
import type { GameVersion, DataLanguage } from "../value-objects/GameVersion";

export interface IPokemonRepository {
  /**
   * Lista os 151 Pokémon de Kanto com dados básicos.
   */
  listKanto(language: DataLanguage): Promise<PokemonSummary[]>;

  /**
   * Busca o detalhe completo de um Pokémon (moves FRLG + cadeia evolutiva).
   */
  getDetail(
    idOrName: number | string,
    version: GameVersion,
    language: DataLanguage,
  ): Promise<Pokemon>;
}
