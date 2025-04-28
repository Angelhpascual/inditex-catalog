import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { PhoneCard } from "../../components/phone/PhoneCard"
import { Phone } from "../../modules/phone/domain/Phone"

describe("PhoneCard", () => {
  const mockPhone = new Phone(
    "1",
    "Apple",
    "iPhone 13",
    999,
    "https://example.com/iphone.jpg"
  )

  const renderPhoneCard = () => {
    return render(
      <BrowserRouter>
        <PhoneCard phone={mockPhone} />
      </BrowserRouter>
    )
  }

  it("renders phone information correctly", () => {
    renderPhoneCard()

    // Verificar que se muestra la información básica del teléfono
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("iPhone 13")).toBeInTheDocument()
    expect(screen.getByText("999€")).toBeInTheDocument()

    // Verificar que la imagen se renderiza correctamente
    const image = screen.getByAltText("iPhone 13")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "https://example.com/iphone.jpg")

    // Verificar que el enlace apunta a la ruta correcta
    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/phones/1")
  })
})
