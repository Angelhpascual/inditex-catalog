import { Link } from "react-router-dom"
import { toast } from "sonner"
import { useCart } from "../../context/CartContext"
import { CartItem } from "../../modules/cart/domain/Cart"
import "../../styles/cart.css"

export const CartView = () => {
  const { cart, loading, error, removeFromCart, updateQuantity } = useCart()

  const handleRemoveItem = async (item: CartItem) => {
    try {
      await removeFromCart(item.id)
      toast.warning("Producto eliminado del carrito", {
        description: `${item.phone.name} - ${item.colorId}, ${item.storageId}`,
      })
    } catch (err) {
      console.error("Error removing item:", err)
      toast.error("Error al eliminar el producto")
    }
  }

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    try {
      await updateQuantity(item.id, newQuantity)
      toast.success("Cantidad actualizada", {
        description: `${item.phone.name} - Cantidad: ${newQuantity}`,
      })
    } catch (err) {
      console.error("Error updating quantity:", err)
      toast.error("Error al actualizar la cantidad")
    }
  }

  if (loading) return <div className="loading">Cargando carrito...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!cart || cart.isEmpty) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <p>¿Por qué no añades algunos productos?</p>
        <Link to="/" className="continue-shopping">
          Continuar comprando
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-view">
      <h1>Tu Carrito</h1>
      <div className="cart-items">
        {cart.getItems().map((item: CartItem) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.phone.getImageForColor(item.colorId)}
              alt={item.phone.name}
              className="cart-item__image"
            />
            <div className="cart-item__info">
              <h3>{item.phone.name}</h3>
              <p className="cart-item__brand">{item.phone.brand}</p>
              <p className="cart-item__options">
                Color: {item.colorId} | Almacenamiento: {item.storageId}
              </p>
              <p className="cart-item__price">
                {item.phone.getPrice(item.storageId)}€
              </p>
            </div>
            <div className="cart-item__quantity">
              <button
                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="cart-item__remove"
              onClick={() => handleRemoveItem(item)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>{cart.getTotalPrice()}€</span>
        </div>
        <button className="checkout-button">Proceder al pago</button>
        <Link to="/" className="continue-shopping">
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
