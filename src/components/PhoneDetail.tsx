import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { toast } from "sonner"
import { PhoneApiRepository } from "../modules/phone/infrastructure/repositories/PhoneApiRepository"
import { GetPhoneDetailUseCase } from "../modules/phone/application/use-cases/GetPhoneDetailUseCase"
import { Phone } from "../modules/phone/domain/Phone"
import { useCart } from "../context/CartContext"
import "../styles/phoneDetail.css"

const phoneRepository = PhoneApiRepository.getInstance()
const getPhoneDetailUseCase = new GetPhoneDetailUseCase(phoneRepository)

const PhoneDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState<Phone | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [selectedStorage, setSelectedStorage] = useState<string>("")
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [similarPhones, setSimilarPhones] = useState<Phone[]>([])
  const [addingToCart, setAddingToCart] = useState(false)
  const [addToCartError, setAddToCartError] = useState<string | null>(null)

  const { addToCart } = useCart()

  useEffect(() => {
    const loadPhoneDetail = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        const detail = await getPhoneDetailUseCase.execute(id)

        if (!detail.phone) {
          setError("Teléfono no encontrado")
          return
        }

        setPhone(detail.phone)
        setSimilarPhones(detail.similarPhones)

        if (detail.phone.colorOptions.length > 0) {
          setSelectedColor(detail.phone.colorOptions[0].name)
        }
        if (detail.phone.storageOptions.length > 0) {
          setSelectedStorage(detail.phone.storageOptions[0].capacity)
          setCurrentPrice(detail.phone.storageOptions[0].price)
        } else {
          setCurrentPrice(detail.phone.basePrice)
        }
      } catch (err) {
        console.error("Error loading phone details:", err)
        setError("Error al cargar los detalles del teléfono")
      } finally {
        setLoading(false)
      }
    }

    loadPhoneDetail()
  }, [id])

  const handleAddToCart = async () => {
    if (!phone || addingToCart) return

    if (!selectedColor || !selectedStorage) {
      setAddToCartError(
        "Por favor, selecciona un color y capacidad de almacenamiento"
      )
      return
    }

    try {
      setAddingToCart(true)
      setAddToCartError(null)
      await addToCart(phone, selectedColor, selectedStorage)
      toast.success("Producto añadido al carrito", {
        description: `${phone.name} - ${selectedColor}, ${selectedStorage}`,
      })
    } catch (err) {
      console.error("Error adding to cart:", err)
      setAddToCartError("Error al añadir al carrito")
      toast.error("Error al añadir al carrito")
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!phone) return <div className="error-message">Teléfono no encontrado</div>

  const canAddToCart = selectedColor && selectedStorage && !addingToCart

  return (
    <div className="phone-detail">
      <Link to="/" className="back-button">
        ← BACK
      </Link>

      <div className="phone-detail__content">
        <div className="phone-detail__left-column">
          <div className="phone-detail__image-container">
            <img
              src={phone.getImageForColor(selectedColor) || phone.imageUrl}
              alt={phone.name}
              className="phone-detail__image"
            />
          </div>
        </div>

        <div className="phone-detail__right-column">
          <div className="phone-detail__info">
            <h1 className="phone-detail__name">{phone.name.toUpperCase()}</h1>
            <div className="phone-detail__price">{currentPrice} EUR</div>

            <div className="phone-detail__options">
              <div className="phone-detail__storage">
                <h3>STORAGE (HOW MUCH SPACE DO YOU NEED?)</h3>
                <div className="storage-options">
                  {phone.storageOptions.map((storage) => (
                    <button
                      key={storage.capacity}
                      className={`storage-option ${selectedStorage === storage.capacity ? "active" : ""}`}
                      onClick={() => {
                        setSelectedStorage(storage.capacity)
                        setCurrentPrice(storage.price)
                      }}
                    >
                      {storage.capacity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="phone-detail__colors">
                <h3>COLOR. PICK YOUR FAVORITE</h3>
                <div className="color-options">
                  {phone.colorOptions.map((color) => (
                    <div key={color.name} className="color-option-container">
                      <button
                        className={`color-option ${selectedColor === color.name ? "active" : ""}`}
                        style={{ backgroundColor: color.hexCode }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      />
                      <span className="color-name">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`add-to-cart-button ${!canAddToCart ? "disabled" : ""}`}
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                AÑADIR
              </button>
              {addToCartError && (
                <div className="error-message">{addToCartError}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="phone-detail__specifications">
        <h3>SPECIFICATIONS</h3>
        <table className="specifications-table">
          <tbody>
            {Object.entries(phone.specs).map(([key, value]) => (
              <tr key={key} className="specification-row">
                <td className="specification-label">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .toUpperCase()}
                </td>
                <td className="specification-value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {similarPhones.length > 0 && (
        <div className="similar-phones">
          <h2>Similar items</h2>
          <div className="similar-phones-grid">
            {similarPhones.map((similarPhone) => (
              <Link
                key={similarPhone.id}
                to={`/phones/${similarPhone.id}`}
                className="similar-phone-card"
              >
                <img
                  src={similarPhone.imageUrl}
                  alt={similarPhone.name}
                  className="similar-phone-image"
                />
                <div className="similar-phone-info">
                  <div className="similar-phone-name">{similarPhone.name}</div>
                  <div className="similar-phone-price">
                    From {similarPhone.basePrice} EUR
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PhoneDetail
