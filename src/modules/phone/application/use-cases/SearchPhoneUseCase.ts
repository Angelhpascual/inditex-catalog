import { Phone } from "../../domain/Phone"
import { PhoneFilters, PhoneRepository } from "../../domain/PhoneRepository"

export interface SearchParams {
  query?: string
  brand?: string
  sortBy?: 'price' | 'name' | 'brand'
  order?: 'asc' | 'desc'
}

export class SearchPhonesUseCase {
  private readonly MIN_QUERY_LENGTH = 2
  private readonly MAX_QUERY_LENGTH = 50

  constructor(private readonly phoneRepository: PhoneRepository) {}

  async execute(
    params: SearchParams = {}
  ): Promise<{ phones: Phone[]; total: number }> {
    const filters: PhoneFilters = {}

    if (params.query) {
      const trimmedQuery = params.query.trim()
      if (
        trimmedQuery.length < this.MIN_QUERY_LENGTH ||
        trimmedQuery.length > this.MAX_QUERY_LENGTH
      ) {
        return { phones: [], total: 0 }
      }
      filters.query = this.normalizeQuery(trimmedQuery)
    }

    if (params.brand) {
      filters.brand = params.brand.trim().toLowerCase()
    }

    const phones = await this.phoneRepository.searchPhones(filters)
    const total = await this.phoneRepository.countResults(filters)

    const sortedPhones = this.sortPhones(phones, params.sortBy, params.order)

    return {
      phones: sortedPhones,
      total,
    }
  }

  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, " ")
  }

  private sortPhones(
    phones: Phone[], 
    sortBy?: 'price' | 'name' | 'brand',
    order: 'asc' | 'desc' = 'asc'
  ): Phone[] {
    if (!sortBy) return phones

    return [...phones].sort((a, b) => {
      const orderMultiplier = order === 'desc' ? -1 : 1
      
      switch (sortBy) {
        case 'price':
          return (a.basePrice - b.basePrice) * orderMultiplier
        case 'name':
          return a.model.localeCompare(b.model) * orderMultiplier
        case 'brand':
          return a.brand.localeCompare(b.brand) * orderMultiplier
        default:
          return 0
      }
    })
  }
}
