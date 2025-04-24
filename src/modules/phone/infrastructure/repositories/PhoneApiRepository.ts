import {
  Phone,
  PhoneColor,
  StorageOption,
  Specifications,
} from "../../domain/Phone"
import { PhoneFilters, PhoneRepository } from "../../domain/PhoneRepository"

export class PhoneApiRepository implements PhoneRepository {
  private readonly API_URL = import.meta.env.VITE_API_URL
  private readonly API_KEY = import.meta.env.VITE_API_KEY
  private readonly MAX_PHONES = 20

  private async fetchWithApiKey(endpoint: string) {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      headers: {
        "x-api-key": this.API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  async findAll(): Promise<Phone[]> {
    const data = await this.fetchWithApiKey("/phones")
    return this.mapResponseToPhones(data).slice(0, this.MAX_PHONES)
  }

  async findById(id: string): Promise<Phone | null> {
    try {
      const data = await this.fetchWithApiKey(`/phones/${id}`)
      return this.mapResponseToPhone(data)
    } catch (error) {
      return null
    }
  }

  async searchPhones(filters: PhoneFilters): Promise<Phone[]> {
    const phones = await this.findAll()
    return this.applyFilters(phones, filters)
  }

  async findSimilarPhones(phone: Phone): Promise<Phone[]> {
    const allPhones = await this.findAll()
    return allPhones
      .filter((p) => p.id !== phone.id && p.brand === phone.brand)
      .slice(0, 3)
  }

  async findByBrand(brand: string): Promise<Phone[]> {
    const phones = await this.findAll()
    return phones.filter(
      (phone) => phone.brand.toLowerCase() === brand.toLowerCase()
    )
  }

  async countResults(filters: PhoneFilters): Promise<number> {
    const phones = await this.searchPhones(filters)
    return phones.length
  }

  private applyFilters(phones: Phone[], filters: PhoneFilters): Phone[] {
    return phones.filter((phone) => {
      if (
        filters.brand &&
        !phone.brand.toLowerCase().includes(filters.brand.toLowerCase())
      ) {
        return false
      }

      if (filters.query) {
        const query = filters.query.toLowerCase()
        const matchesName = phone.model.toLowerCase().includes(query)
        const matchesBrand = phone.brand.toLowerCase().includes(query)
        if (!matchesName && !matchesBrand) {
          return false
        }
      }

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

  private mapResponseToPhones(data: any[]): Phone[] {
    return data.map(this.mapResponseToPhone)
  }

  private mapResponseToPhone(data: any): Phone {
    return new Phone(
      data.id,
      data.brand,
      data.model,
      data.description || "",
      data.price,
      data.imgUrl,
      this.mapColors(data.colors, data.imgUrl),
      this.mapStorageOptions(data.storage, data.price),
      this.mapSpecifications(data)
    )
  }

  private mapColors(colors: string[], defaultImage: string): PhoneColor[] {
    return colors.map((color, index) => ({
      id: `color-${index}`,
      name: color,
      hex: this.getColorHex(color),
      imageUrl: defaultImage, // En este caso usamos la misma imagen para todos los colores
    }))
  }

  private mapStorageOptions(
    options: string[],
    basePrice: number
  ): StorageOption[] {
    return options.map((capacity, index) => ({
      id: `storage-${index}`,
      capacity,
      priceIncrement: this.calculatePriceIncrement(capacity, basePrice),
    }))
  }

  private mapSpecifications(data: any): Specifications {
    return {
      screen: data.screen || "",
      processor: data.processor || "",
      ram: data.ram || "",
      os: data.os || "",
      battery: data.battery || "",
      cameras: data.cameras || [],
      dimensions: data.dimensions || "",
      weight: data.weight || "",
      network: data.networkTechnology ? [data.networkTechnology] : [],
    }
  }

  private getColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#FF0000",
      blue: "#0000FF",
      green: "#00FF00",
      yellow: "#FFFF00",
      purple: "#800080",
      pink: "#FFC0CB",
      gold: "#FFD700",
      silver: "#C0C0C0",
      gray: "#808080",
    }

    return colorMap[colorName.toLowerCase()] || "#000000"
  }

  private calculatePriceIncrement(capacity: string, basePrice: number): number {
    const sizeInGB = parseInt(capacity)
    if (isNaN(sizeInGB)) return 0

    // Incremento del precio basado en la capacidad
    return Math.floor((sizeInGB / 64) * basePrice * 0.1)
  }
}
