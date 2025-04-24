import { Cart } from "./Cart"

export interface CartRepository {
  save(cart: Cart): Promise<void>
  load(): Promise<Cart>
}
