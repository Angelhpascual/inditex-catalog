import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SearchBar } from "../../components/phone/SearchBar"

describe("SearchBar", () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
  })

  const renderSearchBar = (totalResults: number = 0) => {
    return render(
      <SearchBar onSearch={mockOnSearch} totalResults={totalResults} />
    )
  }

  it("renders search input correctly", () => {
    renderSearchBar()
    expect(
      screen.getByPlaceholderText("Buscar por nombre o marca...")
    ).toBeInTheDocument()
  })

  it("shows message when input is too short", () => {
    renderSearchBar()
    const input = screen.getByPlaceholderText("Buscar por nombre o marca...")
    fireEvent.change(input, { target: { value: "a" } })

    expect(
      screen.getByText("Introduce al menos 2 caracteres para buscar")
    ).toBeInTheDocument()
  })

  it("shows total results when search returns results", () => {
    renderSearchBar(5)
    const input = screen.getByPlaceholderText("Buscar por nombre o marca...")
    fireEvent.change(input, { target: { value: "iphone" } })

    expect(screen.getByText("5 resultados encontrados")).toBeInTheDocument()
  })

  it("shows singular message for one result", () => {
    renderSearchBar(1)
    const input = screen.getByPlaceholderText("Buscar por nombre o marca...")
    fireEvent.change(input, { target: { value: "iphone" } })

    expect(screen.getByText("1 resultado encontrado")).toBeInTheDocument()
  })

  it("debounces search calls", async () => {
    vi.useFakeTimers()
    renderSearchBar()

    const input = screen.getByPlaceholderText("Buscar por nombre o marca...")
    fireEvent.change(input, { target: { value: "iphone" } })

    expect(mockOnSearch).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(300)

    expect(mockOnSearch).toHaveBeenCalledWith("iphone")

    vi.useRealTimers()
  })
})
