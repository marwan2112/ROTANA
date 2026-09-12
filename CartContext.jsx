import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'boutique_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // كل عنصر: { productId, name, image, color, size, price, qty }
  function addItem(item) {
    setItems((prev) => {
      const key = (i) => `${i.productId}-${i.color}-${i.size}`
      const existing = prev.find((i) => key(i) === key(item))
      if (existing) {
        return prev.map((i) =>
          key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i
        )
      }
      return [...prev, item]
    })
  }

  function updateQty(productId, color, size, qty) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.color === color && i.size === size
            ? { ...i, qty }
            : i
        )
        .filter((i) => i.qty > 0)
    )
  }

  function removeItem(productId, color, size) {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.color === color && i.size === size)
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const value = { items, addItem, updateQty, removeItem, clearCart, total, count }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
