import { describe, it, expect, beforeEach, vi } from "vitest"
import { SearchPhonesUseCase } from "../../../modules/phone/application/use-cases/SearchPhoneUseCase"
import { Phone } from "../../../modules/phone/domain/Phone"
import { PhoneRepository } from "../../../modules/phone/domain/PhoneRepository"

describe("SearchPhonesUseCase", () => {
  // Mock de teléfonos para pruebas
  const mockPhones = [
    new Phone("1", "Apple", "iPhone 13", 999, "url1"),
    new Phone("2", "Samsung", "Galaxy S21", 899, "url2"),
    new Phone("3", "Apple", "iPhone 12", 799, "url3"),
  ]

  // Crear un mock del repositorio
  const mockRepository = {
    searchPhones: vi.fn(),
    countResults: vi.fn(),
    findAll: vi.fn(),
    findById: vi.fn(),
    findSimilarPhones: vi.fn(),
    findByBrand: vi.fn(),
  }

  // Tipado del repositorio mock
  const repository: PhoneRepository = mockRepository

  // Instanciar el caso de uso con el repositorio mock
  const searchPhonesUseCase = new SearchPhonesUseCase(repository)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("retorna array vacío cuando la consulta es muy corta", async () => {
    const result = await searchPhonesUseCase.execute({ query: "a" })
    expect(result.phones).toEqual([])
    expect(result.total).toBe(0)
    expect(mockRepository.searchPhones).not.toHaveBeenCalled()
  })

  it("retorna array vacío cuando la consulta es muy larga", async () => {
    const longQuery = "a".repeat(51)
    const result = await searchPhonesUseCase.execute({ query: longQuery })
    expect(result.phones).toEqual([])
    expect(result.total).toBe(0)
    expect(mockRepository.searchPhones).not.toHaveBeenCalled()
  })

  it("busca teléfonos con consulta válida", async () => {
    mockRepository.searchPhones.mockResolvedValue(mockPhones)
    mockRepository.countResults.mockResolvedValue(mockPhones.length)

    const result = await searchPhonesUseCase.execute({ query: "iphone" })

    expect(mockRepository.searchPhones).toHaveBeenCalledWith(
      expect.objectContaining({ query: "iphone" })
    )
    expect(result.phones).toEqual(mockPhones)
    expect(result.total).toBe(mockPhones.length)
  })

  it("ordena teléfonos por precio ascendente", async () => {
    mockRepository.searchPhones.mockResolvedValue(mockPhones)
    mockRepository.countResults.mockResolvedValue(mockPhones.length)

    const result = await searchPhonesUseCase.execute({
      query: "phone",
      sortBy: "price",
      order: "asc",
    })

    expect(result.phones[0].basePrice).toBeLessThanOrEqual(
      result.phones[1].basePrice
    )
    expect(result.phones[1].basePrice).toBeLessThanOrEqual(
      result.phones[2].basePrice
    )
  })

  it("ordena teléfonos por marca", async () => {
    mockRepository.searchPhones.mockResolvedValue(mockPhones)
    mockRepository.countResults.mockResolvedValue(mockPhones.length)

    const result = await searchPhonesUseCase.execute({
      query: "phone",
      sortBy: "brand",
      order: "asc",
    })

    const brands = result.phones.map((phone) => phone.brand)
    expect(brands).toEqual([...brands].sort())
  })

  it("normaliza la consulta correctamente", async () => {
    mockRepository.searchPhones.mockResolvedValue([])
    mockRepository.countResults.mockResolvedValue(0)

    await searchPhonesUseCase.execute({ query: "iPhone 13 Pro!" })

    expect(mockRepository.searchPhones).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.stringMatching(/^iphone 13 pro$/),
      })
    )
  })
})
