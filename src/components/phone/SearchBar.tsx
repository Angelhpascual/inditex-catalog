import { useState, useEffect } from "react"
import "../../styles/phones.css"

interface SearchBarProps {
  onSearch: (query: string) => void
  totalResults: number
}

export const SearchBar = ({ onSearch, totalResults }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const MIN_SEARCH_LENGTH = 2

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, onSearch])

  const getSearchMessage = () => {
    if (!searchTerm) return ""
    if (searchTerm.length < MIN_SEARCH_LENGTH) {
      return "Introduce al menos 2 caracteres para buscar"
    }
    return `${totalResults} ${totalResults === 1 ? "resultado" : "resultados"} encontrados`
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre o marca..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="search-results">{getSearchMessage()}</div>
    </div>
  )
}
