import { Phone } from "./Phone"

export interface PhoneFilters {
  brand?: string
  query?: string
  minPrice?: number
  maxPrice?: number
}

export interface PhoneRepository {
  findAll(): Promise<Phone[]>
  findById(id: string): Promise<Phone | null>
  searchPhones(filters: PhoneFilters): Promise<Phone[]>
  findSimilarPhones(phone: Phone): Promise<Phone[]>
  findByBrand(brand: string): Promise<Phone[]>
  countResults(filters: PhoneFilters): Promise<number>
}
