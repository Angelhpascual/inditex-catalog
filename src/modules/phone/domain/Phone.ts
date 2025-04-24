export interface ColorOption {
  name: string
  hexCode: string
  imageUrl: string
}

export interface StorageOption {
  capacity: string
  price: number
}

export interface Specifications {
  screen: string
  resolution: string
  processor: string
  mainCamera: string
  selfieCamera: string
  battery: string
  os: string
  screenRefreshRate: string
}

export interface SimilarProduct {
  id: string
  brand: string
  name: string
  basePrice: number
  imageUrl: string
}

// Interfaz básica que coincide con la respuesta del listado
export interface BasicPhoneData {
  id: string
  brand: string
  name: string
  basePrice: number
  imageUrl: string
}

// Interfaz detallada que coincide con la respuesta del detalle
export interface DetailedPhoneData extends BasicPhoneData {
  description: string
  rating: number
  specs: Specifications
  colorOptions: ColorOption[]
  storageOptions: StorageOption[]
  similarProducts: SimilarProduct[]
}

export class Phone {
  constructor(
    public readonly id: string,
    public readonly brand: string,
    public readonly name: string,
    public readonly basePrice: number,
    public readonly imageUrl: string,
    public readonly description: string = "",
    public readonly rating: number = 0,
    public readonly specs: Specifications = {} as Specifications,
    public readonly colorOptions: ColorOption[] = [],
    public readonly storageOptions: StorageOption[] = [],
    public readonly similarProducts: SimilarProduct[] = []
  ) {}

  static fromBasicData(data: BasicPhoneData): Phone {
    return new Phone(
      data.id,
      data.brand,
      data.name,
      data.basePrice,
      data.imageUrl
    )
  }

  static fromDetailedData(data: DetailedPhoneData): Phone {
    return new Phone(
      data.id,
      data.brand,
      data.name,
      data.basePrice,
      data.imageUrl,
      data.description,
      data.rating,
      data.specs,
      data.colorOptions,
      data.storageOptions,
      data.similarProducts
    )
  }

  get hasDetails(): boolean {
    return (
      this.description !== "" ||
      this.colorOptions.length > 0 ||
      this.storageOptions.length > 0
    )
  }

  getPrice(storage?: string): number {
    if (!storage) return this.basePrice
    const storageOption = this.storageOptions.find(
      (opt) => opt.capacity === storage
    )
    return storageOption?.price ?? this.basePrice
  }

  getImageForColor(color?: string): string {
    if (!color) return this.imageUrl
    const colorOption = this.colorOptions.find((opt) => opt.name === color)
    return colorOption?.imageUrl ?? this.imageUrl
  }

  canAddToCart(color: string, storage: string): boolean {
    return !!(
      this.colorOptions.find((opt) => opt.name === color) &&
      this.storageOptions.find((opt) => opt.capacity === storage)
    )
  }
}
