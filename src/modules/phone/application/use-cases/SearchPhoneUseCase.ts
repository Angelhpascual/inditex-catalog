import { Phone } from "../../domain/Phone"
import { PhoneFilters, PhoneRepository } from "../../domain/PhoneRepository"

export class SearchPhonesUseCase {
  private readonly MIN_QUERY_LENGTH = 2

  constructor(private readonly phoneRepository: PhoneRepository) {}

  async execute(query?: string): Promise<{ phones: Phone[]; total: number }> {
    if (query && query.trim().length < this.MIN_QUERY_LENGTH) {
      return {
        phones: [],
        total: 0,
      }
    }

    const filters: PhoneFilters = query ? { query: query.trim() } : {}

    const phones = await this.phoneRepository.searchPhones(filters)
    const total = await this.phoneRepository.countResults(filters)

    return {
      phones,
      total,
    }
  }
}
