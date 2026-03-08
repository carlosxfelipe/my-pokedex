import type { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import type { PokemonSummary } from "../../domain/entities/Pokemon";
import type { DataLanguage } from "../../domain/value-objects/GameVersion";

export class SearchPokemonUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  async execute(
    language: DataLanguage,
    limit: number,
  ): Promise<PokemonSummary[]> {
    return this.repository.listPokemons(language, limit);
  }
}
