import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartDrawer() {
  const {
    cart,
    itemCount,
    subtotal,
    deliveryFee,
    grandTotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    setIsCheckoutOpen
  } = useCart()

  if (!isCartOpen) return null

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} />
            <h2>Your Cart <span>({itemCount})</span></h2>
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="drawer-empty">
            <span className="empty-emoji">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Select delicious frozen chicken, turkey, seafood, and meats from our catalogue.</p>
            <button
              className="button primary"
              onClick={() => setIsCartOpen(false)}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="drawer-items">
              {cart.map(({ product, quantity }) => (
                <div className="drawer-item" key={product.id}>
                  <div className="item-thumbnail">{product.emoji || '🧊'}</div>
                  <div className="item-details">
                    <h4>{product.name}</h4>
                    <span className="item-unit">{product.unit || '1 pack'}</span>
                    <strong className="item-price">{formatNaira(product.price)}</strong>
                    
                    <div className="item-controls">
                      <div className="qty-picker">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        className="item-remove-btn"
                        onClick={() => removeFromCart(product.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="item-subtotal">
                    {formatNaira(Number(product.price) * quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-footer">
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatNaira(subtotal)}</strong>
              </div>
              <div className="summary-row">
                <span>Cold-Chain Delivery</span>
                <span>{formatNaira(deliveryFee)}</span>
              </div>
              <div className="summary-row total-row">
                <strong>Total Amount</strong>
                <strong className="accent-total">{formatNaira(grandTotal)}</strong>
              </div>

              <button className="button primary full-width checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <button className="clear-cart-btn" onClick={clearCart}>
                Clear basket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

