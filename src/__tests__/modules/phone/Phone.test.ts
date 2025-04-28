import { describe, it, expect } from "vitest"
import { Phone } from "../../../modules/phone/domain/Phone"

describe("Phone", () => {
  const mockBasicData = {
    id: "1",
    brand: "Apple",
    name: "iPhone 13",
    basePrice: 999,
    imageUrl: "https://example.com/iphone.jpg",
  }

  const mockDetailedData = {
    ...mockBasicData,
    description: "A great phone",
    rating: 4.5,
    specs: {
      screen: '6.1"',
      resolution: "2532 x 1170",
      processor: "A15 Bionic",
      mainCamera: "12MP",
      selfieCamera: "12MP",
      battery: "3240 mAh",
      os: "iOS 15",
      screenRefreshRate: "60Hz",
    },
    colorOptions: [
      {
        name: "Black",
        hexCode: "#000000",
        imageUrl: "https://example.com/iphone-black.jpg",
      },
      {
        name: "White",
        hexCode: "#FFFFFF",
        imageUrl: "https://example.com/iphone-white.jpg",
      },
    ],
    storageOptions: [
      { capacity: "128GB", price: 999 },
      { capacity: "256GB", price: 1099 },
    ],
    similarProducts: [],
  }

  describe("fromBasicData", () => {
    it("creates a phone with basic data", () => {
      const phone = Phone.fromBasicData(mockBasicData)

      expect(phone.id).toBe(mockBasicData.id)
      expect(phone.brand).toBe(mockBasicData.brand)
      expect(phone.name).toBe(mockBasicData.name)
      expect(phone.basePrice).toBe(mockBasicData.basePrice)
      expect(phone.imageUrl).toBe(mockBasicData.imageUrl)
      expect(phone.hasDetails).toBe(false)
    })
  })

  describe("fromDetailedData", () => {
    it("creates a phone with detailed data", () => {
      const phone = Phone.fromDetailedData(mockDetailedData)

      expect(phone.id).toBe(mockDetailedData.id)
      expect(phone.description).toBe(mockDetailedData.description)
      expect(phone.rating).toBe(mockDetailedData.rating)
      expect(phone.specs).toEqual(mockDetailedData.specs)
      expect(phone.colorOptions).toEqual(mockDetailedData.colorOptions)
      expect(phone.storageOptions).toEqual(mockDetailedData.storageOptions)
      expect(phone.hasDetails).toBe(true)
    })
  })

  describe("getPrice", () => {
    const phone = Phone.fromDetailedData(mockDetailedData)

    it("returns basePrice when no storage is specified", () => {
      expect(phone.getPrice()).toBe(mockDetailedData.basePrice)
    })

    it("returns specific price for given storage", () => {
      expect(phone.getPrice("256GB")).toBe(1099)
    })

    it("returns basePrice for invalid storage", () => {
      expect(phone.getPrice("512GB")).toBe(mockDetailedData.basePrice)
    })
  })

  describe("getImageForColor", () => {
    const phone = Phone.fromDetailedData(mockDetailedData)

    it("returns default image when no color is specified", () => {
      expect(phone.getImageForColor()).toBe(mockDetailedData.imageUrl)
    })

    it("returns specific image for given color", () => {
      expect(phone.getImageForColor("Black")).toBe(
        "https://example.com/iphone-black.jpg"
      )
    })

    it("returns default image for invalid color", () => {
      expect(phone.getImageForColor("Red")).toBe(mockDetailedData.imageUrl)
    })
  })

  describe("canAddToCart", () => {
    const phone = Phone.fromDetailedData(mockDetailedData)

    it("returns true for valid color and storage combination", () => {
      expect(phone.canAddToCart("Black", "128GB")).toBe(true)
    })

    it("returns false for invalid color", () => {
      expect(phone.canAddToCart("Red", "128GB")).toBe(false)
    })

    it("returns false for invalid storage", () => {
      expect(phone.canAddToCart("Black", "512GB")).toBe(false)
    })

    it("returns false for invalid color and storage", () => {
      expect(phone.canAddToCart("Red", "512GB")).toBe(false)
    })
  })
})
