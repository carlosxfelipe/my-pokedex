import type { IPokemonRepository } from "../../domain/repositories/IPokemonRepository";
import type { Pokemon } from "../../domain/entities/Pokemon";
import type {
  GameVersion,
  DataLanguage,
} from "../../domain/value-objects/GameVersion";

export class GetPokemonDetailUseCase {
  constructor(private readonly repository: IPokemonRepository) {}

  async execute(
    idOrName: number | string,
    version: GameVersion,
    language: DataLanguage,
  ): Promise<Pokemon> {
    return this.repository.getDetail(idOrName, version, language);
  }
}
