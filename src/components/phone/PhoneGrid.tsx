import { useEffect, useState, useCallback, useRef } from "react"
import { Phone } from "../../modules/phone/domain/Phone"
import { PhoneApiRepository } from "../../modules/phone/infrastructure/repositories/PhoneApiRepository"
import { SearchPhonesUseCase } from "../../modules/phone/application/use-cases/SearchPhoneUseCase"
import { PhoneCard } from "./PhoneCard"
import { SearchBar } from "./SearchBar"
import "../../styles/phones.css"

const phoneRepository = PhoneApiRepository.getInstance()
const searchPhonesUseCase = new SearchPhonesUseCase(phoneRepository)

export const PhoneGrid = () => {
  const [phones, setPhones] = useState<Phone[]>([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loadingRef = useRef(false)

  const loadPhones = useCallback(async (query?: string) => {
    if (loadingRef.current) return

    try {
      loadingRef.current = true
      setLoading(true)
      setError(null)

      const results = await searchPhonesUseCase.execute({ query })
      setPhones(results.phones)
      setTotalResults(results.total)
    } catch (err) {
      console.error("Error cargando teléfonos:", err)
      setError("Error al cargar los teléfonos. Por favor, intenta de nuevo.")
      setPhones([])
      setTotalResults(0)
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }, [])

  // Usar useEffect una sola vez para la carga inicial
  useEffect(() => {
    loadPhones()
  }, []) // Quitar loadPhones de las dependencias intencionalmente

  const handleSearch = useCallback(
    (query: string) => {
      loadPhones(query)
    },
    [loadPhones]
  )

  return (
    <div className="phones-container">
      <SearchBar onSearch={handleSearch} totalResults={totalResults} />
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => loadPhones()} className="retry-button">
            Reintentar
          </button>
        </div>
      )}
      {loading ? (
        <div className="loading">Cargando teléfonos...</div>
      ) : (
        <div className="phones-grid">
          {phones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
          {!loading && phones.length === 0 && !error && (
            <div className="no-results">No se encontraron teléfonos</div>
          )}
        </div>
      )}
    </div>
  )
}
