import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Cart } from "../../modules/cart/domain/Cart"
import { LocalStorageCartRepository } from "../../modules/cart/infrastructure/repositories/LocalStorageCartRepository"

export const Navbar = () => {
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    const loadCart = async () => {
      const cartRepository = new LocalStorageCartRepository()
      const cart: Cart = await cartRepository.load()
      setCartItemsCount(cart.getItems().length)
    }

    loadCart()
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          Phone Catalog
        </Link>
        <Link to="/cart" className="cart-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          {cartItemsCount > 0 && (
            <span className="cart-count">{cartItemsCount}</span>
          )}
        </Link>
      </div>
    </nav>
  )
}
