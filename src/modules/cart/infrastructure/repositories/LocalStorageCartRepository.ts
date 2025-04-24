import { Cart } from "../../domain/Cart";
import { CartRepository } from "../../domain/CartRepository";
import { Phone } from "../../../phone/domain/Phone";

export class LocalStorageCartRepository implements CartRepository {
  private readonly STORAGE_KEY = "shopping-cart";

  async save(cart: Cart): Promise<void> {
    const serializedCart = this.serializeCart(cart);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedCart));
  }

  async load(): Promise<Cart> {
    const savedCart = localStorage.getItem(this.STORAGE_KEY);
    if (!savedCart) {
      return new Cart();
    }

    try {
      const cartData = JSON.parse(savedCart);
      return this.deserializeCart(cartData);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return new Cart();
    }
  }

  private serializeCart(cart: Cart): any {
    return {
      items: cart.getItems().map(item => ({
        id: item.id,
        phone: {
          id: item.phone.id,
          brand: item.phone.brand,
          model: item.phone.model,
          description: item.phone.description,
          basePrice: item.phone.basePrice,
          imageUrl: item.phone.imageUrl,
          colors: item.phone.colors,
          storageOptions: item.phone.storageOptions,
          specifications: item.phone.specifications
        },
        colorId: item.colorId,
        storageId: item.storageId,
        quantity: item.quantity
      }))
    };
  }

  private deserializeCart(data: any): Cart {
    const cart = new Cart();
    
    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        if (item.phone) {
          const phone = new Phone(
            item.phone.id,
            item.phone.brand,
            item.phone.model,
            item.phone.description,
            item.phone.basePrice,
            item.phone.imageUrl,
            item.phone.colors,
            item.phone.storageOptions,
            item.phone.specifications
          );
          
          cart.addItem(phone, item.colorId, item.storageId);
          if (item.quantity > 1) {
            cart.updateQuantity(item.id, item.quantity);
          }
        }
      });
    }

    return cart;
  }
}