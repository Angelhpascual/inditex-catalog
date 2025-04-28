import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { LocalStorageCartRepository } from "../../../modules/cart/infrastructure/repositories/LocalStorageCartRepository"
import { Cart } from "../../../modules/cart/domain/Cart"
import { Phone } from "../../../modules/phone/domain/Phone"

describe("LocalStorageCartRepository", () => {
  let repository: LocalStorageCartRepository
  let mockPhone: Phone

  beforeEach(() => {
    repository = new LocalStorageCartRepository()
    mockPhone = new Phone(
      "1",
      "Apple",
      "iPhone 13",
      999,
      "image.jpg",
      "Description",
      4.5,
      {
        screen: '6.1"',
        resolution: "2532 x 1170",
        processor: "A15 Bionic",
        mainCamera: "12 MP",
        selfieCamera: "12 MP",
        battery: "3240 mAh",
        os: "iOS 15",
        screenRefreshRate: "60 Hz",
      },
      [{ name: "Black", hexCode: "#000000", imageUrl: "black.jpg" }],
      [{ capacity: "128GB", price: 999 }]
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe("save", () => {
    it("guarda el carrito en localStorage", async () => {
      const cart = new Cart()
      cart.addItem(mockPhone, "Black", "128GB")
      await repository.save(cart)

      const stored = localStorage.getItem("cart")
      expect(stored).toBeTruthy()

      const parsedCart = JSON.parse(stored!)
      expect(parsedCart.items).toHaveLength(1)
      expect(parsedCart.items[0].phone.id).toBe(mockPhone.id)
    })

    it("sobreescribe el carrito existente", async () => {
      const cart1 = new Cart()
      cart1.addItem(mockPhone, "Black", "128GB")
      await repository.save(cart1)

      const cart2 = new Cart()
      await repository.save(cart2)

      const stored = localStorage.getItem("cart")
      const parsedCart = JSON.parse(stored!)
      expect(parsedCart.items).toHaveLength(0)
    })
  })

  describe("load", () => {
    it("carga un carrito vacío si no hay datos guardados", async () => {
      const cart = await repository.load()
      expect(cart.isEmpty).toBe(true)
    })

    it("carga el carrito guardado correctamente", async () => {
      const cart = new Cart()
      cart.addItem(mockPhone, "Black", "128GB")
      await repository.save(cart)

      const loadedCart = await repository.load()
      expect(loadedCart.getItems()).toHaveLength(1)

      const item = loadedCart.getItems()[0]
      expect(item.phone.id).toBe(mockPhone.id)
      expect(item.colorId).toBe("Black")
      expect(item.storageId).toBe("128GB")
    })

    it("maneja errores de JSON inválido", async () => {
      localStorage.setItem("cart", "invalid json")
      const cart = await repository.load()
      expect(cart.isEmpty).toBe(true)
    })
  })

  describe("clear", () => {
    it("elimina el carrito del localStorage", async () => {
      const cart = new Cart()
      cart.addItem(mockPhone, "Black", "128GB")
      await repository.save(cart)

      await repository.clear()
      expect(localStorage.getItem("cart")).toBeNull()
    })
  })
})
