import type { Pokemon, PokemonSummary } from "../entities/Pokemon";
import type { GameVersion, DataLanguage } from "../value-objects/GameVersion";

export interface IPokemonRepository {
  /**
   * Lista os Pokémons até o limite definido (Kanto/Hoenn = 386, ou Todos = 1025).
   */
  listPokemons(
    language: DataLanguage,
    limit: number,
  ): Promise<PokemonSummary[]>;

  /**
   * Busca o detalhe completo de um Pokémon (moves FRLG + cadeia evolutiva).
   */
  getDetail(
    idOrName: number | string,
    version: GameVersion,
    language: DataLanguage,
  ): Promise<Pokemon>;
}
