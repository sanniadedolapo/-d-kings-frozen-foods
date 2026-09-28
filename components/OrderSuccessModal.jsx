import { CheckCircle2, MessageSquare, Copy, ArrowRight, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function OrderSuccessModal() {
  const { lastOrder, setLastOrder, showToast } = useCart()
  const navigate = useNavigate()

  if (!lastOrder) return null

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(lastOrder.orderNumber)
    showToast('Order number copied to clipboard!', 'info')
  }

  const handleTrack = () => {
    const num = lastOrder.orderNumber
    setLastOrder(null)
    navigate(`/track?order=${num}`)
  }

  return (
    <div className="modal-backdrop" onClick={() => setLastOrder(null)}>
      <div className="modal-dialog success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-header">
          <div className="success-icon-wrap">
            <CheckCircle2 size={46} />
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for choosing <strong>D Kings Frozen Foods</strong>.</p>
        </div>

        <div className="order-receipt-card">
          <div className="receipt-row-highlight">
            <div>
              <small>Tracking Number</small>
              <strong>{lastOrder.orderNumber}</strong>
            </div>
            <button className="copy-btn" onClick={copyOrderNumber} title="Copy Order Number">
              <Copy size={16} /> Copy
            </button>
          </div>

          <div className="receipt-details">
            <div>
              <small>Customer</small>
              <p>{lastOrder.customerName} ({lastOrder.customerPhone})</p>
            </div>
            <div>
              <small>Deliver To</small>
              <p>{lastOrder.deliveryAddress}, {lastOrder.deliveryCity}</p>
            </div>
            <div>
              <small>Payment Status</small>
              <span className={`status-tag ${lastOrder.paymentStatus?.toLowerCase()}`}>
                {lastOrder.paymentStatus}
              </span>
            </div>
            <div>
              <small>Total Paid / Due</small>
              <strong className="receipt-total">{formatNaira(lastOrder.totalAmount)}</strong>
            </div>
          </div>

          {lastOrder.items && lastOrder.items.length > 0 && (
            <div className="receipt-items">
              <small>Items:</small>
              <ul>
                {lastOrder.items.map((item, idx) => (
                  <li key={idx}>
                    <span>{item.quantity}x {item.productName}</span>
                    <span>{formatNaira(item.subtotal)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="success-actions">
          {lastOrder.whatsappShareUrl && (
            <a
              href={lastOrder.whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button whatsapp-btn full-width"
            >
              <MessageSquare size={20} /> Open Order in WhatsApp <ExternalLink size={16} />
            </a>
          )}

          <div className="success-btn-group">
            <button className="button secondary full-width" onClick={handleTrack}>
              Track Order Status <ArrowRight size={16} />
            </button>
            <button className="button outline full-width" onClick={() => setLastOrder(null)}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

