import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingBasket, Snowflake, X, PackageCheck, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getHealth } from '../services/api'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [backendReady, setBackendReady] = useState(false)
  const { itemCount, setIsCartOpen } = useCart()
  const location = useLocation()

  useEffect(() => {
    getHealth()
      .then(() => setBackendReady(true))
      .catch(() => setBackendReady(false))
  }, [])

  const isActive = (path) => location.pathname === path

  return (
    <header className="site-header">
      <Link className="brand" to="/">
        <span className="brand-mark"><Snowflake size={21} /></span>
        <span>D Kings <strong>Frozen Foods</strong></span>
      </Link>

      <div className="header-right-actions">
        <button
          className="cart-toggle-btn mobile-cart-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Shopping Cart"
        >
          <ShoppingBasket size={20} />
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </button>

        <button
          className="menu-button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <nav className={open ? 'main-nav open' : 'main-nav'}>
        <Link
          to="/"
          className={isActive('/') ? 'active' : ''}
          onClick={() => setOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={isActive('/shop') ? 'active' : ''}
          onClick={() => setOpen(false)}
        >
          Shop Catalogue
        </Link>
        <Link
          to="/track"
          className={isActive('/track') ? 'active' : ''}
          onClick={() => setOpen(false)}
        >
          <PackageCheck size={16} /> Track Order
        </Link>
        <Link
          to="/admin"
          className={isActive('/admin') ? 'active' : ''}
          onClick={() => setOpen(false)}
        >
          <ShieldCheck size={16} /> Admin Portal
        </Link>

        <button
          className="nav-cart desktop-cart-btn"
          onClick={() => {
            setOpen(false)
            setIsCartOpen(true)
          }}
        >
          <ShoppingBasket size={18} />
          <span>Cart</span>
          <strong className="cart-pill">{itemCount}</strong>
        </button>

        <div className={`nav-status-indicator ${backendReady ? 'online' : 'connecting'}`}>
          <span className="status-dot" />
          <small>{backendReady ? 'API Live' : 'Connecting'}</small>
        </div>
      </nav>
    </header>
  )
}

