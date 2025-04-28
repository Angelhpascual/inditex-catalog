import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"
import { Cart } from "../modules/cart/domain/Cart"
import { LocalStorageCartRepository } from "../modules/cart/infrastructure/repositories/LocalStorageCartRepository"
import { ManageCartUseCase } from "../modules/cart/application/use-cases/ManageCartUseCase"
import { Phone } from "../modules/phone/domain/Phone"

interface CartContextType {
  cart: Cart | null
  loading: boolean
  error: string | null
  addToCart: (phone: Phone, colorId: string, storageId: string) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartRepository = new LocalStorageCartRepository()
const manageCartUseCase = new ManageCartUseCase(cartRepository)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCart = async () => {
    try {
      setLoading(true)
      const loadedCart = await manageCartUseCase.getCart()
      setCart(loadedCart)
      setError(null)
    } catch (err) {
      console.error("Error loading cart:", err)
      setError("Error al cargar el carrito")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const addToCart = async (
    phone: Phone,
    colorId: string,
    storageId: string
  ) => {
    try {
      const updatedCart = await manageCartUseCase.addToCart(
        phone,
        colorId,
        storageId
      )
      setCart(updatedCart)
    } catch (err) {
      console.error("Error adding to cart:", err)
      throw err
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const updatedCart = await manageCartUseCase.removeFromCart(itemId)
      setCart(updatedCart)
    } catch (err) {
      console.error("Error removing from cart:", err)
      throw err
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const updatedCart = await manageCartUseCase.updateQuantity(
        itemId,
        quantity
      )
      setCart(updatedCart)
    } catch (err) {
      console.error("Error updating quantity:", err)
      throw err
    }
  }

  const clearCart = async () => {
    try {
      await manageCartUseCase.clearCart()
      setCart(new Cart())
    } catch (err) {
      console.error("Error clearing cart:", err)
      throw err
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
