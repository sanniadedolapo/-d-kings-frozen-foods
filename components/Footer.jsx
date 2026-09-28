import { Link } from 'react-router-dom'
import { Snowflake, Phone, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-top">
        <div className="footer-column brand-col">
          <div className="footer-brand">
            <span className="brand-mark"><Snowflake size={20} /></span>
            <strong>D Kings <span>Frozen Foods</span></strong>
          </div>
          <p className="footer-tagline">
            Nigeria's trusted cold-chain distributor of blast-frozen poultry, premium seafood, prime cuts, and ready pastries.
          </p>
          <div className="footer-trust-badge">
            <ShieldCheck size={18} />
            <span>100% Quality Inspected & Temperature Controlled</span>
          </div>
        </div>

        <div className="footer-column">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop Catalogue</Link></li>
            <li><Link to="/track">Track Your Order</Link></li>
            <li><Link to="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Product Categories</h4>
          <ul className="footer-links">
            <li><Link to="/shop?category=chicken">Frozen Chicken</Link></li>
            <li><Link to="/shop?category=turkey">Turkey Cuts</Link></li>
            <li><Link to="/shop?category=fish">Freshwater & Sea Fish</Link></li>
            <li><Link to="/shop?category=seafood">Prawns & Seafood</Link></li>
            <li><Link to="/shop?category=beef">Beef & Goat Meat</Link></li>
          </ul>
        </div>

        <div className="footer-column contact-col">
          <h4>Customer Care & Hub</h4>
          <p><MapPin size={16} /> 12 Distribution Way, Ikeja / Lekki Hub, Lagos</p>
          <p><Phone size={16} /> +234 800 000 0000</p>
          <p><Clock size={16} /> Mon – Sat: 7:30 AM – 7:00 PM</p>
          <a
            href="https://wa.me/2348000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-wa-link"
          >
            <MessageSquare size={16} /> Direct WhatsApp Chat
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 D Kings Frozen Foods Ltd. All rights reserved.</p>
        <small>Powered by Spring Boot 3.4 & React Vite.</small>
      </div>
    </footer>
  )
}

