import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Package, CheckCircle2, Clock, Truck, Home, MessageSquare, AlertCircle, Loader2 } from 'lucide-react'
import { getOrderByNumber } from '../services/api'

export default function TrackOrderPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialOrder = searchParams.get('order') || ''
  const [orderNumber, setOrderNumber] = useState(initialOrder)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PROCESSING', label: 'In Cold Storage', icon: Package },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: Home }
  ]

  const fetchOrder = async (num) => {
    if (!num.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await getOrderByNumber(num.trim())
      setOrder(data)
    } catch (err) {
      setError(err.message || 'Order not found. Please verify the order number.')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrder) {
      fetchOrder(initialOrder)
    }
  }, [initialOrder])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!orderNumber.trim()) return
    setSearchParams({ order: orderNumber.trim() })
    fetchOrder(orderNumber)
  }

  const getStepIndex = (status) => {
    const map = {
      PENDING: 0,
      CONFIRMED: 1,
      PROCESSING: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4
    }
    return map[status] ?? 0
  }

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="section track-page">
      <div className="track-header">
        <p className="eyebrow">Real-Time Dispatch Tracking</p>
        <h1>Track Your Frozen Order</h1>
        <p className="hero-copy">Enter your order reference (e.g. <strong>DK-2026-10001</strong>) to check preparation and delivery progress.</p>

        <form onSubmit={handleSearch} className="track-search-box">
          <div className="search-input-wrap track-input">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="e.g. DK-2026-10001"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>
          <button type="submit" className="button primary track-btn" disabled={loading}>
            {loading ? <Loader2 size={18} className="spinner" /> : 'Track Order'}
          </button>
        </form>
      </div>

      {error && (
        <div className="track-error-card">
          <AlertCircle size={24} />
          <div>
            <strong>Unable to locate order</strong>
            <p>{error}</p>
          </div>
        </div>
      )}

      {order && (
        <div className="track-results-container">
          <div className="track-card">
            <div className="track-card-header">
              <div>
                <small>Order Reference</small>
                <h2>{order.orderNumber}</h2>
                <span className="order-date">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                </span>
              </div>
              <div className="order-badges">
                <span className={`status-tag ${order.orderStatus?.toLowerCase()}`}>
                  {order.orderStatus?.replace(/_/g, ' ')}
                </span>
                <span className={`status-tag ${order.paymentStatus?.toLowerCase()}`}>
                  Payment: {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Visual Timeline */}
            <div className="timeline-container">
              {steps.map((step, idx) => {
                const currentIdx = getStepIndex(order.orderStatus)
                const isCompleted = idx <= currentIdx
                const isCurrent = idx === currentIdx
                const IconComponent = step.icon

                return (
                  <div
                    key={step.key}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    <div className="step-circle">
                      <IconComponent size={18} />
                    </div>
                    <span className="step-label">{step.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Details Grid */}
            <div className="track-info-grid">
              <div className="info-block">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Phone:</strong> {order.customerPhone}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
              </div>

              <div className="info-block">
                <h4>Delivery Address</h4>
                <p>{order.deliveryAddress}</p>
                <p>{order.deliveryCity}</p>
                {order.notes && <p className="order-notes-tag"><em>Note: "{order.notes}"</em></p>}
              </div>

              <div className="info-block">
                <h4>Payment Details</h4>
                <p><strong>Method:</strong> {order.paymentMethod}</p>
                <p><strong>Status:</strong> {order.paymentStatus}</p>
                {order.paymentReference && (
                  <p><strong>Reference:</strong> {order.paymentReference}</p>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="track-items-table">
              <h4>Items in this Order</h4>
              <div className="items-list">
                {order.items?.map((item) => (
                  <div className="track-item-row" key={item.id}>
                    <div className="item-name-col">
                      <span className="item-emoji">{item.productEmoji || '🧊'}</span>
                      <span>{item.productName}</span>
                    </div>
                    <span className="item-qty">Qty: {item.quantity}</span>
                    <span className="item-price">{formatNaira(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="track-pricing-summary">
                <div className="pricing-row">
                  <span>Subtotal:</span>
                  <span>{formatNaira(order.subtotal)}</span>
                </div>
                <div className="pricing-row">
                  <span>Cold Delivery Fee:</span>
                  <span>{formatNaira(order.deliveryFee)}</span>
                </div>
                <div className="pricing-row grand-total-row">
                  <strong>Total Amount:</strong>
                  <strong>{formatNaira(order.totalAmount)}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="track-actions-footer">
              <a
                href={`https://wa.me/2348000000000?text=Hello%20D%20Kings,%20I%20am%20checking%20on%20my%20order%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button whatsapp-btn"
              >
                <MessageSquare size={16} /> Inquire on WhatsApp
              </a>
              <Link to="/shop" className="button outline">
                Order More Items
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

