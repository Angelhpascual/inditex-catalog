import { describe, it, expect, beforeEach } from "vitest"
import { Cart } from "../../../modules/cart/domain/Cart"
import { Phone } from "../../../modules/phone/domain/Phone"

describe("Cart", () => {
  let cart: Cart
  let mockPhone: Phone

  beforeEach(() => {
    cart = new Cart()
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

  describe("addItem", () => {
    it("añade un nuevo item al carrito correctamente", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      const items = cart.getItems()
      expect(items).toHaveLength(1)
      expect(items[0].phone).toBe(mockPhone)
      expect(items[0].colorId).toBe("Black")
      expect(items[0].storageId).toBe("128GB")
      expect(items[0].quantity).toBe(1)
    })

    it("incrementa la cantidad si el item ya existe", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      cart.addItem(mockPhone, "Black", "128GB")
      const items = cart.getItems()
      expect(items).toHaveLength(1)
      expect(items[0].quantity).toBe(2)
    })

    it("lanza error si no se pueden validar las opciones", () => {
      expect(() => {
        cart.addItem(mockPhone, "Red", "128GB")
      }).toThrow()

      expect(() => {
        cart.addItem(mockPhone, "Black", "256GB")
      }).toThrow()
    })
  })

  describe("removeItem", () => {
    it("elimina un item del carrito", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      const items = cart.getItems()
      cart.removeItem(items[0].id)
      expect(cart.getItems()).toHaveLength(0)
    })

    it("no hace nada si el id no existe", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      cart.removeItem("invalid-id")
      expect(cart.getItems()).toHaveLength(1)
    })
  })

  describe("updateQuantity", () => {
    beforeEach(() => {
      cart.addItem(mockPhone, "Black", "128GB")
    })

    it("actualiza la cantidad de un item existente", () => {
      const items = cart.getItems()
      cart.updateQuantity(items[0].id, 3)
      expect(cart.getItems()[0].quantity).toBe(3)
    })

    it("elimina el item si la cantidad es 0", () => {
      const items = cart.getItems()
      cart.updateQuantity(items[0].id, 0)
      expect(cart.getItems()).toHaveLength(0)
    })

    it("no hace nada si el id no existe", () => {
      cart.updateQuantity("invalid-id", 5)
      expect(cart.getItems()[0].quantity).toBe(1)
    })
  })

  describe("getTotalPrice", () => {
    it("calcula el precio total correctamente", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      cart.addItem(mockPhone, "Black", "128GB")
      const mockPhone2 = new Phone(
        "2",
        "Apple",
        "iPhone 13 Pro",
        1099,
        "image2.jpg",
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
          screenRefreshRate: "120 Hz",
        },
        [{ name: "Black", hexCode: "#000000", imageUrl: "black.jpg" }],
        [{ capacity: "128GB", price: 1099 }]
      )
      cart.addItem(mockPhone2, "Black", "128GB")
      expect(cart.getTotalPrice()).toBe(999 * 2 + 1099)
    })

    it("retorna 0 para un carrito vacío", () => {
      expect(cart.getTotalPrice()).toBe(0)
    })
  })

  describe("clear", () => {
    it("elimina todos los items del carrito", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      cart.clear()
      expect(cart.getItems()).toHaveLength(0)
    })
  })

  describe("isEmpty", () => {
    it("retorna true cuando el carrito está vacío", () => {
      expect(cart.isEmpty).toBe(true)
    })

    it("retorna false cuando el carrito tiene items", () => {
      cart.addItem(mockPhone, "Black", "128GB")
      expect(cart.isEmpty).toBe(false)
    })
  })
})
