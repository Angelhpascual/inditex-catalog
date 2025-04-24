import { Cart } from "../../domain/Cart"
import { CartRepository } from "../../domain/CartRepository"
import { Phone } from "../../../phone/domain/Phone"

export class ManageCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async addToCart(
    phone: Phone,
    colorId: string,
    storageId: string
  ): Promise<Cart> {
    const cart = await this.cartRepository.load()
    cart.addItem(phone, colorId, storageId)
    await this.cartRepository.save(cart)
    return cart
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const cart = await this.cartRepository.load()
    cart.removeItem(itemId)
    await this.cartRepository.save(cart)
    return cart
  }

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.cartRepository.load()
    cart.updateQuantity(itemId, quantity)
    await this.cartRepository.save(cart)
    return cart
  }

  async getCart(): Promise<Cart> {
    return this.cartRepository.load()
  }

  async clearCart(): Promise<void> {
    const cart = await this.cartRepository.load()
    cart.clear()
    await this.cartRepository.save(cart)
  }
}
