import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'dkings_cart_items'
const DELIVERY_FEE = 1500

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [lastOrder, setLastOrder] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Storage error ignored
    }
  }, [cart])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev))
    }, 3200)
  }

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        const currentQty = updated[existingIndex].quantity
        const newQty = currentQty + quantity

        if (product.stockQuantity && newQty > product.stockQuantity) {
          showToast(`Only ${product.stockQuantity} items in stock!`, 'warning')
          return prev
        }

        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty }
        return updated
      } else {
        return [...prev, { product, quantity }]
      }
    })

    showToast(`Added ${quantity}x ${product.name} to cart!`)
  }

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
    showToast('Item removed from cart', 'info')
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          if (item.product.stockQuantity && quantity > item.product.stockQuantity) {
            showToast(`Max available stock is ${item.product.stockQuantity}`, 'warning')
            return { ...item, quantity: item.product.stockQuantity }
          }
          return { ...item, quantity }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCart([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch {}
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  const subtotal = cart.reduce((total, item) => {
    const price = Number(item.product.price) || 0
    return total + price * item.quantity
  }, 0)

  const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0
  const grandTotal = subtotal + deliveryFee

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        deliveryFee,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastOrder,
        setLastOrder,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

