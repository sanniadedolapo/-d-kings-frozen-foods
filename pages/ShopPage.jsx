import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Plus, Minus, Check, X, Snowflake, ShoppingCart, Loader2, Info } from 'lucide-react'
import { getCategories, getProducts } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [addedIds, setAddedIds] = useState({})

  const { addToCart } = useCart()

  const currentCategory = searchParams.get('category') || 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    const params = {}
    if (currentCategory && currentCategory !== 'all') {
      params.category = currentCategory
    }

    Promise.allSettled([getCategories(), getProducts(params)]).then(([catRes, prodRes]) => {
      if (!mounted) return

      if (catRes.status === 'fulfilled' && catRes.value) {
        setCategories(catRes.value)
      }
      if (prodRes.status === 'fulfilled' && prodRes.value) {
        setProducts(prodRes.value)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [currentCategory])

  const handleCategoryChange = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', slug)
    }
    setSearchParams(searchParams)
  }

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1
      const next = Math.max(1, current + delta)
      return { ...prev, [productId]: next }
    })
  }

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 1
    addToCart(product, qty)
    setAddedIds((prev) => ({ ...prev, [product.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }))
    }, 1500)
  }

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q))
      )
    }

    if (inStockOnly) {
      list = list.filter((p) => p.stockQuantity > 0)
    }

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-desc':
        list.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // 'featured'
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }

    return list
  }, [products, searchQuery, inStockOnly, sortBy])

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSortBy('featured')
    setInStockOnly(false)
    searchParams.delete('category')
    setSearchParams(searchParams)
  }

  return (
    <div className="section shop-page">
      <div className="shop-header">
        <div>
          <p className="eyebrow">Direct Cold Storage Supply</p>
          <h1>Shop Frozen Catalogue</h1>
          <p className="hero-copy">Browse blast-frozen meat, fish, seafood and ready-to-fry finger foods.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="shop-controls-bar">
        <div className="search-input-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search chicken wings, Titus fish, prawns, sausages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="sort-controls">
          <div className="control-item">
            <SlidersHorizontal size={16} />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            <span>In stock only</span>
          </label>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-tabs">
        <button
          className={`cat-tab ${currentCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            className={`cat-tab ${currentCategory === c.slug ? 'active' : ''}`}
            onClick={() => handleCategoryChange(c.slug)}
          >
            <span>{c.icon || '🧊'}</span> {c.name}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="results-counter">
        <span>Showing <strong>{filteredProducts.length}</strong> products</span>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="loading-state">
          <Loader2 size={36} className="spinner" />
          <p>Loading fresh catalogue items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-shop">
          <span className="empty-emoji">🧊</span>
          <h2>No matching products found</h2>
          <p>Try searching for a different keyword or view all categories.</p>
          <button className="button primary" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="product-grid shop-grid">
          {filteredProducts.map((product) => {
            const qty = quantities[product.id] || 1
            const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5
            const isOutOfStock = product.stockQuantity <= 0

            return (
              <article className="product-card full-card" key={product.id}>
                <div
                  className="product-image clickable"
                  onClick={() => setSelectedProduct(product)}
                  title="Click to view details"
                >
                  <span className="card-emoji">{product.emoji || '🍗'}</span>
                  {product.categoryName && (
                    <span className="product-cat-pill">{product.categoryName}</span>
                  )}
                  {isLowStock && <span className="badge-low-stock">Only {product.stockQuantity} left</span>}
                  {isOutOfStock && <span className="badge-out-stock">Out of Stock</span>}
                </div>

                <div className="product-body">
                  <div className="card-top-info">
                    <small className="product-unit">{product.unit || '1 pack'}</small>
                    <small className="product-sku">{product.sku}</small>
                  </div>

                  <h3
                    className="clickable-title"
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </h3>

                  <p className="product-description-snippet">
                    {product.description || 'Premium blast-frozen quality product.'}
                  </p>

                  <div className="product-pricing">
                    <strong className="product-price">{formatNaira(product.price)}</strong>
                    <small className="unit-label">per {product.unit || 'unit'}</small>
                  </div>

                  <div className="product-action-row">
                    <div className="qty-picker shop-qty">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={isOutOfStock}
                        aria-label="Decrease"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        disabled={isOutOfStock || qty >= product.stockQuantity}
                        aria-label="Increase"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button
                      className={`button primary add-btn ${addedIds[product.id] ? 'added' : ''}`}
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedIds[product.id] ? (
                        <>
                          <Check size={16} /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={16} /> Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="modal-dialog product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Details</h3>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-product-layout">
              <div className="modal-product-image">
                <span>{selectedProduct.emoji || '🧊'}</span>
              </div>

              <div className="modal-product-info">
                <span className="product-cat-pill">{selectedProduct.categoryName}</span>
                <h2>{selectedProduct.name}</h2>
                <div className="modal-meta-row">
                  <span><strong>SKU:</strong> {selectedProduct.sku}</span>
                  <span><strong>Size:</strong> {selectedProduct.unit}</span>
                  <span><strong>Status:</strong> {selectedProduct.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>

                <p className="modal-description">{selectedProduct.description}</p>

                <div className="storage-note">
                  <Snowflake size={16} />
                  <span>Store at -18°C or below. Do not refreeze once thawed.</span>
                </div>

                <div className="modal-price-box">
                  <strong>{formatNaira(selectedProduct.price)}</strong>
                  <button
                    className="button primary"
                    disabled={selectedProduct.stockQuantity <= 0}
                    onClick={() => {
                      handleAddToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

