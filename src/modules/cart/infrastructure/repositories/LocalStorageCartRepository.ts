import { Cart } from "../../domain/Cart"
import { CartRepository } from "../../domain/CartRepository"
import { Phone } from "../../../phone/domain/Phone"

export class LocalStorageCartRepository implements CartRepository {
  private readonly STORAGE_KEY = "shopping-cart"

  async save(cart: Cart): Promise<void> {
    const serializedCart = this.serializeCart(cart)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializedCart))
  }

  async load(): Promise<Cart> {
    const savedCart = localStorage.getItem(this.STORAGE_KEY)
    if (!savedCart) {
      return new Cart()
    }

    try {
      const cartData = JSON.parse(savedCart)
      return this.deserializeCart(cartData)
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      localStorage.removeItem(this.STORAGE_KEY) // Limpiar el carrito corrupto
      return new Cart()
    }
  }

  private serializeCart(cart: Cart): any {
    return {
      items: cart.getItems().map((item) => ({
        id: item.id,
        phone: {
          id: item.phone.id,
          brand: item.phone.brand,
          name: item.phone.name,
          basePrice: item.phone.basePrice,
          imageUrl: item.phone.imageUrl,
          description: item.phone.description,
          rating: item.phone.rating,
          specs: item.phone.specs,
          colorOptions: item.phone.colorOptions,
          storageOptions: item.phone.storageOptions,
          similarProducts: item.phone.similarProducts,
        },
        colorId: item.colorId,
        storageId: item.storageId,
        quantity: item.quantity,
      })),
    }
  }

  private deserializeCart(data: any): Cart {
    const cart = new Cart()

    if (data.items && Array.isArray(data.items)) {
      data.items.forEach((item: any) => {
        if (item.phone && item.colorId && item.storageId) {
          try {
            const phone = new Phone(
              item.phone.id,
              item.phone.brand,
              item.phone.name,
              item.phone.basePrice,
              item.phone.imageUrl,
              item.phone.description || "",
              item.phone.rating || 0,
              item.phone.specs || {},
              item.phone.colorOptions || [],
              item.phone.storageOptions || [],
              item.phone.similarProducts || []
            )

            // Verificar que el color y storage existan en las opciones del teléfono
            if (phone.canAddToCart(item.colorId, item.storageId)) {
              cart.addItem(phone, item.colorId, item.storageId)
              if (item.quantity > 1) {
                cart.updateQuantity(item.id, item.quantity)
              }
            }
          } catch (error) {
            console.error("Error deserializing cart item:", error)
            // Continuar con el siguiente item si hay error
          }
        }
      })
    }

    return cart
  }
}
