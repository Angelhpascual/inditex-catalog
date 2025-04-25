import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { PhoneApiRepository } from "../modules/phone/infrastructure/repositories/PhoneApiRepository"
import { GetPhoneDetailUseCase } from "../modules/phone/application/use-cases/GetPhoneDetailUseCase"
import { Phone } from "../modules/phone/domain/Phone"
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
        
        // Establecer valores iniciales para color y almacenamiento
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

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error-message">{error}</div>
  if (!phone) return <div className="error-message">Teléfono no encontrado</div>

  return (
    <div className="phone-detail">
      <div className="phone-detail__header">
        <div className="phone-detail__image-container">
          <img
            src={phone.getImageForColor(selectedColor) || phone.imageUrl}
            alt={phone.name}
            className="phone-detail__image"
          />
        </div>

        <div className="phone-detail__info">
          <div className="phone-detail__brand">{phone.brand}</div>
          <h1 className="phone-detail__name">{phone.name}</h1>
          <p className="phone-detail__description">{phone.description}</p>
          <div className="phone-detail__price">${currentPrice}</div>

          <div className="phone-detail__options">
            <div className="phone-detail__colors">
              <h3>Colores disponibles:</h3>
              <div className="color-options">
                {phone.colorOptions.map((color) => (
                  <div
                    key={color.name}
                    className={`color-option ${selectedColor === color.name ? "active" : ""}`}
                    style={{ backgroundColor: color.hexCode }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {phone.storageOptions.length > 0 && (
              <div className="phone-detail__storage">
                <h3>Almacenamiento:</h3>
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
            )}
          </div>
        </div>
      </div>

      <div className="phone-detail__specs">
        <h2>Especificaciones</h2>
        <div className="specs-grid">
          {Object.entries(phone.specs).map(([key, value]) => (
            <div key={key} className="spec-item">
              <div className="spec-label">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div className="spec-value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {similarPhones.length > 0 && (
        <div className="similar-phones">
          <h2>Productos similares</h2>
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
                  <div className="similar-phone-brand">{similarPhone.brand}</div>
                  <div className="similar-phone-name">{similarPhone.name}</div>
                  <div className="similar-phone-price">
                    ${similarPhone.basePrice}
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
