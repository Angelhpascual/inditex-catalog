export interface PhoneColor {
  id: string
  name: string
  hex: string
  imageUrl: string
}

export interface StorageOption {
  id: string
  capacity: string
  priceIncrement: number
}

export interface Specifications {
  screen: string
  processor: string
  ram: string
  os: string
  battery: string
  cameras: string[]
  dimensions: string
  weight: string
  network: string[]
}

export class Phone {
  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly model: string,
    public readonly description: string,
    public readonly basePrice: number,
    public readonly imageUrl: string,
    public readonly colors: PhoneColor[],
    public readonly storageOptions: StorageOption[],
    public readonly specifications: Specifications
  ) {}

  getPrice(storageId: string): number {
    const storage = this.storageOptions.find((s) => s.id === storageId)
    return storage ? this.basePrice + storage.priceIncrement : this.basePrice
  }

  getImageForColor(colorId: string): string {
    const color = this.colors.find((c) => c.id === colorId)
    return color ? color.imageUrl : this.imageUrl
  }

  canAddToCart(colorId: string, storageId: string): boolean {
    return !!(
      this.colors.find((c) => c.id === colorId) &&
      this.storageOptions.find((s) => s.id === storageId)
    )
  }
}
