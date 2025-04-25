import { Phone } from "../../domain/Phone";
import { PhoneRepository } from "../../domain/PhoneRepository";

export interface PhoneDetail {
  phone: Phone | null;
  similarPhones: Phone[];
  selectedColor?: string;
  selectedStorage?: string;
  currentImage?: string;
  currentPrice?: number;
}

export class GetPhoneDetailUseCase {
  constructor(private readonly phoneRepository: PhoneRepository) {}

  async execute(
    id: string,
    colorId?: string,
    storageId?: string,
  ): Promise<PhoneDetail> {
    const phone = await this.phoneRepository.findById(id);

    if (!phone) {
      return {
        phone: null,
        similarPhones: [],
      };
    }

    const similarPhones = await this.phoneRepository.findSimilarPhones(phone);

    return {
      phone,
      similarPhones,
      selectedColor: colorId,
      selectedStorage: storageId,
      currentImage: colorId ? phone.getImageForColor(colorId) : phone.imageUrl,
      currentPrice: storageId ? phone.getPrice(storageId) : phone.basePrice,
    };
  }

  canAddToCart(detail: PhoneDetail): boolean {
    if (!detail.phone) return false;
    return detail.phone.canAddToCart(
      detail.selectedColor ?? "",
      detail.selectedStorage ?? "",
    );
  }
}
