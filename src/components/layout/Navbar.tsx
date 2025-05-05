import { Link } from "react-router-dom"
import { useCart } from "../../context/CartContext"

export const Navbar = () => {
  const { cart } = useCart()

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          <img src="/assets/Logo.png" alt="Inditex" />
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="cart-count">
            ({cart ? cart.getItems().length : 0})
          </span>
        </Link>
      </div>
    </nav>
  )
}
