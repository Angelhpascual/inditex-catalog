import { Phone } from "../../phone/domain/Phone"

export interface CartItem {
  id: string
  phone: Phone
  colorId: string
  storageId: string
  quantity: number
}

export class Cart {
  private items: CartItem[] = []

  addItem(phone: Phone, colorId: string, storageId: string): void {
    if (!phone.canAddToCart(colorId, storageId)) {
      throw new Error(
        "Cannot add phone to cart without color and storage selection"
      )
    }

    const existingItem = this.items.find(
      (item) =>
        item.phone.id === phone.id &&
        item.colorId === colorId &&
        item.storageId === storageId
    )

    if (existingItem) {
      existingItem.quantity += 1
      return
    }

    this.items.push({
      id: `${phone.id}-${colorId}-${storageId}`,
      phone,
      colorId,
      storageId,
      quantity: 1,
    })
  }

  removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId)
    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.items.find((item) => item.id === itemId)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  getItems(): CartItem[] {
    return [...this.items]
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      const itemPrice = item.phone.getPrice(item.storageId)
      return total + itemPrice * item.quantity
    }, 0)
  }

  clear(): void {
    this.items = []
  }

  get isEmpty(): boolean {
    return this.items.length === 0
  }
}
