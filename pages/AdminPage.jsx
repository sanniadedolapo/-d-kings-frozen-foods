import { useEffect, useState } from 'react'
import {
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  X,
  Loader2,
  ExternalLink
} from 'lucide-react'
import {
  getAdminStats,
  getAllOrders,
  updateOrderStatus,
  getProducts,
  createProduct,
  deleteProduct,
  getCategories
} from '../services/api'
import { useCart } from '../context/CartContext'

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const { showToast } = useCart()

  const [newProduct, setNewProduct] = useState({
    name: '',
    unit: '1kg pack',
    price: '',
    stockQuantity: 20,
    emoji: '🍗',
    description: '',
    categoryId: '',
    featured: false
  })

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [statsData, ordersData, productsData, categoriesData] = await Promise.all([
        getAdminStats(),
        getAllOrders(statusFilter),
        getProducts(),
        getCategories()
      ])
      setStats(statsData)
      setOrders(ordersData)
      setProducts(productsData)
      setCategories(categoriesData)
      if (categoriesData.length > 0 && !newProduct.categoryId) {
        setNewProduct((prev) => ({ ...prev, categoryId: categoriesData[0].id }))
      }
    } catch (err) {
      showToast('Failed to load dashboard data: ' + err.message, 'warning')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [statusFilter])

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, { orderStatus: newStatus })
      showToast(`Order #${orderId} marked as ${newStatus}`, 'success')
      // Refresh list
      const updatedOrders = await getAllOrders(statusFilter)
      setOrders(updatedOrders)
      const newStats = await getAdminStats()
      setStats(newStats)
    } catch (err) {
      showToast('Update failed: ' + err.message, 'warning')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) {
      return
    }
    try {
      await deleteProduct(productId)
      showToast(`Product "${name}" deleted`, 'info')
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      const newStats = await getAdminStats()
      setStats(newStats)
    } catch (err) {
      showToast('Delete failed: ' + err.message, 'warning')
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) {
      showToast('Name and price are required', 'warning')
      return
    }

    try {
      await createProduct({
        ...newProduct,
        price: Number(newProduct.price),
        stockQuantity: Number(newProduct.stockQuantity),
        categoryId: Number(newProduct.categoryId)
      })
      showToast('Product added successfully!', 'success')
      setIsAddProductOpen(false)
      setNewProduct({
        name: '',
        unit: '1kg pack',
        price: '',
        stockQuantity: 20,
        emoji: '🍗',
        description: '',
        categoryId: categories[0]?.id || '',
        featured: false
      })
      const prods = await getProducts()
      setProducts(prods)
      const newStats = await getAdminStats()
      setStats(newStats)
    } catch (err) {
      showToast('Failed to add product: ' + err.message, 'warning')
    }
  }

  const formatNaira = (val) => {
    return '₦' + Number(val || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  }

  return (
    <div className="section admin-page">
      <div className="admin-header">
        <div>
          <p className="eyebrow">Store Operations Management</p>
          <h1>Merchant Dashboard</h1>
        </div>
        <button className="button secondary refresh-btn" onClick={loadAllData} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinner' : ''} /> Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="kpi-grid">
          <div className="kpi-card revenue-card">
            <div className="kpi-icon-wrap"><DollarSign size={22} /></div>
            <div>
              <small>Total Gross Revenue</small>
              <h3>{formatNaira(stats.totalRevenue)}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap orders"><Package size={22} /></div>
            <div>
              <small>Total Orders Placed</small>
              <h3>{stats.totalOrders}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap pending"><Clock size={22} /></div>
            <div>
              <small>Pending Orders</small>
              <h3>{stats.pendingOrders}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap delivered"><CheckCircle2 size={22} /></div>
            <div>
              <small>Delivered Orders</small>
              <h3>{stats.deliveredOrders}</h3>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap warning"><AlertTriangle size={22} /></div>
            <div>
              <small>Low Stock Alerts</small>
              <h3>{stats.lowStockProducts}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          Product Catalog & Inventory ({products.length})
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="admin-content-card">
          <div className="table-controls">
            <h3>Recent Store Orders</h3>
            <div className="filter-group">
              <label htmlFor="statusFilter">Filter Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Delivery Location</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Dispatch Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-records">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.orderNumber}</strong>
                      </td>
                      <td>
                        <small>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : '-'}
                        </small>
                      </td>
                      <td>
                        <div><strong>{order.customerName}</strong></div>
                        <small className="muted">{order.customerPhone}</small>
                      </td>
                      <td>
                        <small>{order.deliveryCity}</small>
                      </td>
                      <td>
                        <small>{order.items ? order.items.length : 0} items</small>
                      </td>
                      <td>
                        <strong>{formatNaira(order.totalAmount)}</strong>
                      </td>
                      <td>
                        <span className={`status-tag ${order.paymentStatus?.toLowerCase()}`}>
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className={`status-select ${order.orderStatus?.toLowerCase()}`}
                          value={order.orderStatus}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td>
                        <a
                          href={`/track?order=${order.orderNumber}`}
                          className="table-link"
                          target="_blank"
                          rel="noreferrer"
                          title="View Order Details"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Tab Content */}
      {activeTab === 'inventory' && (
        <div className="admin-content-card">
          <div className="table-controls">
            <h3>Frozen Products Inventory</h3>
            <button
              className="button primary add-product-btn"
              onClick={() => setIsAddProductOpen(true)}
            >
              <Plus size={16} /> Add New Product
            </button>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Unit Size</th>
                  <th>Price</th>
                  <th>Stock Count</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="prod-cell">
                        <span className="prod-emoji">{p.emoji || '🧊'}</span>
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.categoryName || '-'}</td>
                    <td><code>{p.sku}</code></td>
                    <td>{p.unit}</td>
                    <td><strong>{formatNaira(p.price)}</strong></td>
                    <td>
                      <span className={`stock-count-badge ${p.stockQuantity <= 5 ? 'critical' : 'good'}`}>
                        {p.stockQuantity} in stock
                      </span>
                    </td>
                    <td>{p.featured ? '⭐ Yes' : 'No'}</td>
                    <td>
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddProductOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Product to Catalogue</h3>
              <button className="close-btn" onClick={() => setIsAddProductOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="admin-add-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jumbo Croaker Fish"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={newProduct.categoryId}
                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit / Pack Size *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1kg pack, 500g"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₦) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 9500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="20"
                    value={newProduct.stockQuantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Emoji Icon</label>
                  <select
                    value={newProduct.emoji}
                    onChange={(e) => setNewProduct({ ...newProduct, emoji: e.target.value })}
                  >
                    <option value="🍗">🍗 Chicken</option>
                    <option value="🦃">🦃 Turkey</option>
                    <option value="🐟">🐟 Fish</option>
                    <option value="🦐">🦐 Seafood</option>
                    <option value="🥩">🥩 Meat / Beef</option>
                    <option value="🌭">🌭 Sausage</option>
                    <option value="🥟">🥟 Pastry / Snack</option>
                    <option value="🧊">🧊 Frozen Pack</option>
                  </select>
                </div>

                <div className="form-group checkbox-field">
                  <label className="checkbox-label inline-check">
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    />
                    <span>Feature on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe blast-freezing, tenderness, recommended dishes..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="button primary full-width">
                  Save Product to Catalogue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

