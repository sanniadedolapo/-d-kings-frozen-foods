import { useState } from 'react'
import { X, MessageSquare, CreditCard, Banknote, ShieldCheck, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createOrder, verifyOrderPayment } from '../services/api'

export default function CheckoutModal() {
  const {
    cart,
    subtotal,
    deliveryFee,
    grandTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setLastOrder,
    showToast
  } = useCart()

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: 'Lagos (Island / Lekki)',
    notes: '',
    paymentMethod: 'WHATSAPP'
  })

  const [loading, setLoading] = useState(false)
  const [paystackStep, setPaystackStep] = useState(false)
  const [createdOrderRef, setCreatedOrderRef] = useState(null)

  if (!isCheckoutOpen) return null

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.customerName.trim()) {
      showToast('Please enter your full name', 'warning')
      return
    }
    if (!formData.customerPhone.trim()) {
      showToast('Please enter your phone number', 'warning')
      return
    }
    if (!formData.deliveryAddress.trim()) {
      showToast('Please provide your delivery address', 'warning')
      return
    }

    setLoading(true)

    const payload = {
      customerName: formData.customerName,
      customerEmail: formData.customerEmail || `${formData.customerPhone.replace(/[^0-9]/g, '')}@customer.dkings.ng`,
      customerPhone: formData.customerPhone,
      deliveryAddress: formData.deliveryAddress,
      deliveryCity: formData.deliveryCity,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity
      }))
    }

    try {
      const order = await createOrder(payload)

      if (formData.paymentMethod === 'PAYSTACK') {
        setCreatedOrderRef(order)
        setPaystackStep(true)
        setLoading(false)
      } else {
        clearCart()
        setIsCheckoutOpen(false)
        setLastOrder(order)
        showToast('Order placed successfully!', 'success')
      }
    } catch (err) {
      showToast(err.message || 'Failed to place order. Please try again.', 'warning')
      setLoading(false)
    }
  }

  const handleSimulatedPaystackSuccess = async () => {
    if (!createdOrderRef) return
    setLoading(true)
    try {
      const ref = 'PSTK_' + Math.random().toString(36).substring(2, 10).toUpperCase()
      const verifiedOrder = await verifyOrderPayment(createdOrderRef.orderNumber, ref)
      clearCart()
      setPaystackStep(false)
      setIsCheckoutOpen(false)
      setLastOrder(verifiedOrder)
      showToast('Payment verified successfully!', 'success')
    } catch (err) {
      showToast('Payment confirmation failed: ' + err.message, 'warning')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={() => !loading && setIsCheckoutOpen(false)}>
      <div className="modal-dialog checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Secure Checkout</h2>
          <button className="close-btn" onClick={() => !loading && setIsCheckoutOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {paystackStep ? (
          <div className="paystack-simulation-card">
            <div className="paystack-header">
              <span className="paystack-badge">Paystack Gateway</span>
              <h3>Complete Payment: {formatNaira(createdOrderRef.totalAmount)}</h3>
              <p>Order Reference: <strong>{createdOrderRef.orderNumber}</strong></p>
            </div>

            <div className="paystack-demo-box">
              <CreditCard size={38} className="card-icon" />
              <p>Pay with Test Card / Bank Transfer</p>
              <div className="test-card-preview">
                <span>•••• •••• •••• 4081</span>
                <span>08/29</span>
              </div>
            </div>

            <div className="paystack-actions">
              <button
                className="button primary full-width"
                disabled={loading}
                onClick={handleSimulatedPaystackSuccess}
              >
                {loading ? <Loader2 className="spinner" size={18} /> : `Authorize ${formatNaira(createdOrderRef.totalAmount)}`}
              </button>
              <button
                className="button secondary full-width"
                disabled={loading}
                onClick={() => {
                  setPaystackStep(false)
                  clearCart()
                  setIsCheckoutOpen(false)
                  setLastOrder(createdOrderRef)
                }}
              >
                Pay via WhatsApp instead
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-layout">
              <div className="checkout-fields">
                <h3>Delivery Details</h3>

                <div className="form-group">
                  <label htmlFor="customerName">Full Name *</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    required
                    placeholder="e.g. Fatima Bello"
                    value={formData.customerName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customerPhone">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      id="customerPhone"
                      name="customerPhone"
                      required
                      placeholder="e.g. 0802 345 6789"
                      value={formData.customerPhone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="customerEmail">Email Address</label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      placeholder="e.g. fatima@gmail.com"
                      value={formData.customerEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryAddress">Street Address *</label>
                  <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    required
                    rows="2"
                    placeholder="House/Plot number, street name, landmarks"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deliveryCity">City / Delivery Zone *</label>
                  <select
                    id="deliveryCity"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleChange}
                  >
                    <option value="Lagos Island / Victoria Island / Ikoyi">Lagos Island / Victoria Island / Ikoyi</option>
                    <option value="Lekki Phase 1 / Ikate / Chevron">Lekki Phase 1 / Ikate / Chevron</option>
                    <option value="Ajah / Sangotedo">Ajah / Sangotedo</option>
                    <option value="Ikeja / GRA / Maryland">Ikeja / GRA / Maryland</option>
                    <option value="Surulere / Yaba">Surulere / Yaba</option>
                    <option value="Gbagada / Magodo / Ogudu">Gbagada / Magodo / Ogudu</option>
                    <option value="Festac / Amuwo Odofin">Festac / Amuwo Odofin</option>
                    <option value="Abuja (Central Delivery)">Abuja (Central Delivery)</option>
                    <option value="Other Nigeria Locations">Other Nigeria Locations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    id="notes"
                    name="notes"
                    placeholder="e.g. Call when outside, leave with security"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className={`payment-card ${formData.paymentMethod === 'WHATSAPP' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="WHATSAPP"
                      checked={formData.paymentMethod === 'WHATSAPP'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <div className="payment-title">
                        <MessageSquare size={18} className="wa-icon" />
                        <strong>WhatsApp Order (Recommended)</strong>
                      </div>
                      <small>Instant checkout! Order receipt opens on WhatsApp for quick confirmation and bank transfer.</small>
                    </div>
                  </label>

                  <label className={`payment-card ${formData.paymentMethod === 'PAYSTACK' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="PAYSTACK"
                      checked={formData.paymentMethod === 'PAYSTACK'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <div className="payment-title">
                        <CreditCard size={18} />
                        <strong>Pay Online (Paystack / Card)</strong>
                      </div>
                      <small>Instant debit card or Nigerian bank transfer via secure Paystack gateway.</small>
                    </div>
                  </label>

                  <label className={`payment-card ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH_ON_DELIVERY"
                      checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                      onChange={handleChange}
                    />
                    <div className="payment-info">
                      <div className="payment-title">
                        <Banknote size={18} />
                        <strong>Pay on Delivery / Pos</strong>
                      </div>
                      <small>Pay with POS or cash upon cold-chain delivery at your doorstep.</small>
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-summary-box">
                <h4>Order Summary</h4>
                <div className="checkout-items-list">
                  {cart.map(({ product, quantity }) => (
                    <div className="mini-order-item" key={product.id}>
                      <span>{quantity}x {product.name}</span>
                      <strong>{formatNaira(Number(product.price) * quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="summary-divider" />

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Cold Storage Delivery</span>
                  <span>{formatNaira(deliveryFee)}</span>
                </div>
                <div className="summary-row total-row">
                  <strong>Total to Pay</strong>
                  <strong className="accent-total">{formatNaira(grandTotal)}</strong>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="button primary full-width place-order-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="spinner" size={18} /> Placing Order...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} /> Confirm Order ({formatNaira(grandTotal)})
                    </>
                  )}
                </button>

                <p className="checkout-guarantee">
                  ❄ Guaranteed 100% frozen delivery with food-grade thermal insulation.
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

