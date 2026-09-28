import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Fish, ShoppingBasket, Snowflake, ShieldCheck, Truck, MessageSquare, Plus, Check } from 'lucide-react'
import { getCategories, getProducts, getHealth } from '../services/api'
import { useCart } from '../context/CartContext'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [backendReady, setBackendReady] = useState(false)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const [addedIds, setAddedIds] = useState({})

  useEffect(() => {
    let mounted = true

    Promise.allSettled([
      getHealth(),
      getCategories(),
      getProducts({ featured: true })
    ]).then(([healthRes, catRes, prodRes]) => {
      if (!mounted) return

      if (healthRes.status === 'fulfilled') {
        setBackendReady(true)
      }

      if (catRes.status === 'fulfilled' && catRes.value) {
        setCategories(catRes.value)
      } else {
        // Fallback static categories
        setCategories([
          { name: 'Chicken', slug: 'chicken', icon: '🍗' },
          { name: 'Turkey', slug: 'turkey', icon: '🦃' },
          { name: 'Fish', slug: 'fish', icon: '🐟' },
          { name: 'Seafood', slug: 'seafood', icon: '🦐' },
          { name: 'Beef & Meat', slug: 'beef', icon: '🥩' },
          { name: 'Snacks', slug: 'snacks', icon: '🥟' }
        ])
      }

      if (prodRes.status === 'fulfilled' && prodRes.value && prodRes.value.length > 0) {
        setFeaturedProducts(prodRes.value)
      } else {
        // Fallback products
        setFeaturedProducts([
          { id: 1, name: 'Premium Chicken Wings', unit: '1kg pack', price: 8500, emoji: '🍗' },
          { id: 2, name: 'Atlantic Mackerel (Titus)', unit: 'Large size (3 pcs)', price: 12000, emoji: '🐟' },
          { id: 3, name: 'Family Beef Sausage', unit: '500g pack', price: 6500, emoji: '🌭' }
        ])
      }

      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [])

  const handleAdd = (product) => {
    addToCart(product, 1)
    setAddedIds((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }))
    }, 1500)
  }

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Freshness You Can Taste</p>
          <h1>Quality frozen foods, delivered directly to your door.</h1>
          <p className="hero-copy">
            Premium blast-frozen poultry, Atlantic seafood, prime beef cuts, and pastries carefully packed for fast cold-chain delivery across Nigeria.
          </p>

          <div className="hero-actions">
            <Link className="button primary hero-cta" to="/shop">
              Shop Catalogue <ArrowRight size={18} />
            </Link>
            <a
              className="button secondary wa-hero-btn"
              href="https://wa.me/2348000000000?text=Hello%20D%20Kings%20Frozen%20Foods,%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare size={18} /> Order on WhatsApp
            </a>
          </div>

          <p className={backendReady ? 'system-status ready' : 'system-status'} aria-live="polite">
            <span /> {backendReady ? 'Store services & live database online' : 'Store services are initializing...'}
          </p>
        </div>

        <div className="hero-art" aria-label="Assorted frozen foods">
          <div className="art-circle" />
          <span className="food food-fish" title="Atlantic Fish">🐟</span>
          <span className="food food-chicken" title="Frozen Chicken">🍗</span>
          <span className="food food-shrimp" title="Tiger Prawns">🦐</span>
          <span className="ice-flake" title="Blast Frozen">❄</span>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="section" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse Selection</p>
            <h2>Shop by Category</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              className="category-card"
              to={`/shop?category=${category.slug}`}
              key={category.slug || category.name}
            >
              <span className="cat-icon">{category.icon || '🧊'}</span>
              <strong>{category.name}</strong>
              <small>Explore {category.name}</small>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section soft-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Customer Favourites</p>
            <h2>Popular This Week</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            Shop all items <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="product-skeleton" />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <article className="product-card" key={product.id || product.name}>
                <div className="product-image">
                  <span>{product.emoji || '🍗'}</span>
                  {product.categoryName && (
                    <span className="product-cat-pill">{product.categoryName}</span>
                  )}
                </div>
                <div className="product-body">
                  <small className="product-unit">{product.unit || '1 pack'}</small>
                  <h3>{product.name}</h3>
                  <div className="product-footer">
                    <strong className="product-price">{formatNaira(product.price)}</strong>
                    <button
                      className={`add-cart-btn ${addedIds[product.id] ? 'added' : ''}`}
                      onClick={() => handleAdd(product)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      {addedIds[product.id] ? <Check size={18} /> : <Plus size={18} />}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Trust & Guarantee Section */}
      <section className="trust-section">
        <div className="trust-item">
          <div className="trust-icon-box">
            <Snowflake size={26} />
          </div>
          <h3>Blast Frozen Quality</h3>
          <p>Blast-frozen at -18°C immediately after dressing to preserve essential nutrients and juiciness.</p>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <Truck size={26} />
          </div>
          <h3>Cold-Chain Delivery</h3>
          <p>Dispatched in specialized insulated thermal packaging with coolant gel to arrive rock-solid frozen.</p>
        </div>

        <div className="trust-item">
          <div className="trust-icon-box">
            <ShoppingBasket size={26} />
          </div>
          <h3>Effortless Ordering</h3>
          <p>Order online with secure debit cards, Nigerian bank transfer, or one-click direct WhatsApp chat.</p>
        </div>
      </section>

      {/* WhatsApp Quick Order Callout */}
      <section className="section wa-callout-section">
        <div className="wa-callout-box">
          <div className="wa-callout-content">
            <span className="wa-icon-large">📱</span>
            <h2>Prefer to Order on WhatsApp?</h2>
            <p>
              Send your shopping list directly to our sales desk. We calculate your bill, confirm your delivery time, and dispatch immediately!
            </p>
            <a
              href="https://wa.me/2348000000000?text=Hello%20D%20Kings,%20I%20want%20to%20inquire%20about%20frozen%20food%20prices."
              target="_blank"
              rel="noopener noreferrer"
              className="button wa-bright-btn"
            >
              <MessageSquare size={18} /> Chat with D Kings Desk
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

