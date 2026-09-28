import { CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast } = useCart()

  if (!toast) return null

  const getIcon = () => {
    switch (toast.type) {
      case 'warning':
        return <AlertCircle size={18} className="toast-icon warning" />
      case 'info':
        return <Info size={18} className="toast-icon info" />
      default:
        return <CheckCircle2 size={18} className="toast-icon success" />
    }
  }

  return (
    <div className={`toast-container ${toast.type || 'success'}`}>
      {getIcon()}
      <span>{toast.message}</span>
    </div>
  )
}

