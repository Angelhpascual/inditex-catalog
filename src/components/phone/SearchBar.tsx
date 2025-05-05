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
      return "Enter at least 2 characters to search"
    }
    if (totalResults === 1) {
      return "1 result"
    }
    return `${totalResults} results`
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a smartphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="search-results">{getSearchMessage()}</div>
    </div>
  )
}
