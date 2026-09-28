import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

// Intercept response to extract data payload if structured as ApiResponse
api.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data
    }
    return response.data
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

export const getHealth = () => api.get('/health')

export const getCategories = () => api.get('/categories')

export const getProducts = (params = {}) => {
  const query = new URLSearchParams()
  if (params.category) query.append('category', params.category)
  if (params.search) query.append('search', params.search)
  if (params.featured) query.append('featured', 'true')
  const queryString = query.toString()
  return api.get(`/products${queryString ? '?' + queryString : ''}`)
}

export const getProductById = (id) => api.get(`/products/${id}`)

export const createProduct = (productData) => api.post('/products', productData)

export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData)

export const deleteProduct = (id) => api.delete(`/products/${id}`)

export const createOrder = (orderData) => api.post('/orders', orderData)

export const getOrderByNumber = (orderNumber) => api.get(`/orders/${orderNumber}`)

export const getAllOrders = (status) => {
  const query = status ? `?status=${status}` : ''
  return api.get(`/orders${query}`)
}

export const updateOrderStatus = (id, statusData) => api.patch(`/orders/${id}/status`, statusData)

export const verifyOrderPayment = (orderNumber, reference) =>
  api.post(`/orders/${orderNumber}/verify-payment`, { reference })

export const getAdminStats = () => api.get('/admin/stats')

export default api
