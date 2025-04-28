import { Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { PhoneGrid } from "./components/phone/PhoneGrid"
import PhoneDetail from "./components/PhoneDetail"
import { CartView } from "./components/cart/CartView"
import { CartProvider } from "./context/CartContext"
import { Toaster } from "sonner"

function App() {
  return (
    <CartProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<PhoneGrid />} />
          <Route path="/phones/:id" element={<PhoneDetail />} />
          <Route path="/cart" element={<CartView />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </Layout>
    </CartProvider>
  )
}

export default App
