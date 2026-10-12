import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import OrderSuccessModal from './components/OrderSuccessModal'
import Toast from './components/Toast'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import TrackOrderPage from './pages/TrackOrderPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <CartProvider>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />

        {/* Global Overlays & Modals */}
        <CartDrawer />
        <CheckoutModal />
        <OrderSuccessModal />
        <Toast />
      </div>
    </CartProvider>
  )
}

export default App
