import { Phone, BasicPhoneData, DetailedPhoneData } from "../../domain/Phone"
import { PhoneFilters, PhoneRepository } from "../../domain/PhoneRepository"

let instance: PhoneApiRepository | null = null

export class PhoneApiRepository implements PhoneRepository {
  private readonly BASE_URL =
    "https://prueba-tecnica-api-tienda-moviles.onrender.com"
  private readonly API_KEY = "87909682e6cd74208f41a6ef39fe4191"
  private readonly MAX_PHONES = 20

  private constructor() {}

  static getInstance(): PhoneApiRepository {
    if (!instance) {
      instance = new PhoneApiRepository()
    }
    return instance
  }

  private async fetchWithApiKey(
    endpoint: string,
    params: Record<string, string> = {}
  ) {
    const queryParams = new URLSearchParams(params).toString()
    const url = `${this.BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ""}`
    console.log("Making request to:", url)

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": this.API_KEY,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("API key inválida")
        }
        if (response.status === 404) {
          return null
        }
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error en la petición:", error)
      throw error
    }
  }

  private removeDuplicates(data: any[]): any[] {
    return data.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    )
  }

  private ensureLimit(data: any[]): any[] {
    if (data.length < this.MAX_PHONES) {
      console.log(
        `Se encontraron ${data.length} teléfonos únicos, intentando obtener más...`
      )
      return data
    }
    return data.slice(0, this.MAX_PHONES)
  }

  async findAll(): Promise<Phone[]> {
    try {
      const params = {
        limit: (this.MAX_PHONES + 5).toString(),
        offset: "0",
      }
      const data = await this.fetchWithApiKey("/products", params)
      if (!Array.isArray(data)) {
        console.error("La respuesta no es un array:", data)
        return []
      }

      const uniqueData = this.removeDuplicates(data)
      const limitedData = this.ensureLimit(uniqueData)
      return limitedData.map((item) =>
        Phone.fromBasicData(item as BasicPhoneData)
      )
    } catch (error) {
      console.error("Error en findAll:", error)
      return []
    }
  }

  async findById(id: string): Promise<Phone | null> {
    try {
      const data = await this.fetchWithApiKey(`/products/${id}`)
      if (!data) return null
      return Phone.fromDetailedData(data as DetailedPhoneData)
    } catch (error) {
      console.error("Error en findById:", error)
      return null
    }
  }

  async searchPhones(filters: PhoneFilters): Promise<Phone[]> {
    try {
      const params: Record<string, string> = {
        limit: (this.MAX_PHONES + 5).toString(),
        offset: "0",
      }

      if (filters.query) {
        params.search = filters.query
      }

      const data = await this.fetchWithApiKey("/products", params)
      if (!Array.isArray(data)) {
        console.error("La respuesta de búsqueda no es un array:", data)
        return []
      }

      const uniqueData = this.removeDuplicates(data)
      const limitedData = this.ensureLimit(uniqueData)
      const phones = limitedData.map((item) =>
        Phone.fromBasicData(item as BasicPhoneData)
      )
      return this.applyFilters(phones, filters)
    } catch (error) {
      console.error("Error en searchPhones:", error)
      return []
    }
  }

  async findByBrand(brand: string): Promise<Phone[]> {
    const params = {
      search: brand,
      limit: (this.MAX_PHONES + 5).toString(),
      offset: "0",
    }
    const data = await this.fetchWithApiKey("/products", params)
    if (!Array.isArray(data)) {
      console.error("La respuesta de búsqueda por marca no es un array:", data)
      return []
    }
    const uniqueData = this.removeDuplicates(data)
    const limitedData = this.ensureLimit(uniqueData)
    return limitedData.map((item) =>
      Phone.fromBasicData(item as BasicPhoneData)
    )
  }

  async findSimilarPhones(phone: Phone): Promise<Phone[]> {
    try {
      const params = {
        search: phone.brand,
        limit: (this.MAX_PHONES + 5).toString(),
        offset: "0",
      }
      const data = await this.fetchWithApiKey("/products", params)
      if (!Array.isArray(data)) {
        console.error(
          "La respuesta de búsqueda de similares no es un array:",
          data
        )
        return []
      }

      const uniqueData = this.removeDuplicates(data)
      const limitedData = this.ensureLimit(uniqueData)
      return limitedData
        .filter((item) => item.id !== phone.id)
        .map((item) => Phone.fromBasicData(item as BasicPhoneData))
    } catch (error) {
      console.error("Error en findSimilarPhones:", error)
      return []
    }
  }

  async countResults(filters: PhoneFilters): Promise<number> {
    const phones = await this.searchPhones(filters)
    return Math.min(phones.length, this.MAX_PHONES)
  }

  private applyFilters(phones: Phone[], filters: PhoneFilters): Phone[] {
    return phones.filter((phone) => {
      if (
        filters.minPrice !== undefined &&
        phone.basePrice < filters.minPrice
      ) {
        return false
      }
      if (
        filters.maxPrice !== undefined &&
        phone.basePrice > filters.maxPrice
      ) {
        return false
      }
      return true
    })
  }
}
