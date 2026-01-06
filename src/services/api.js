import axios from 'axios'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: '/backend/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', errorMessage)
    return Promise.reject(error)
  },
)

// ==========================================
// CATEGORY API
// ==========================================
export const categoryAPI = {
  getAll: () => apiClient.get('/categories'),
  getById: (id) => apiClient.get(`/categories/${id}`),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
}

// ==========================================
// SUBCATEGORY API
// ==========================================
export const subcategoryAPI = {
  getAll: (categoryId = null) =>
    apiClient.get('/subcategories', {
      params: categoryId ? { categoryId } : {},
    }),

  getById: (id) => apiClient.get(`/subcategories/${id}`),
  create: (data) => apiClient.post('/subcategories', data),
  update: (id, data) => apiClient.put(`/subcategories/${id}`, data),
  delete: (id) => apiClient.delete(`/subcategories/${id}`),
}

// ==========================================
// SPEC API
// ==========================================
export const specAPI = {
  getAll: (subcategoryId = null) =>
    apiClient.get('/specs', {
      params: subcategoryId ? { subcategoryId } : {},
    }),

  getById: (id) => apiClient.get(`/specs/${id}`),
  create: (data) => apiClient.post('/specs', data),
  update: (id, data) => apiClient.put(`/specs/${id}`, data),
  delete: (id) => apiClient.delete(`/specs/${id}`),
}

// ==========================================
// CALCULATION API
// ==========================================
export const calculationAPI = {
  getAll: (filters = {}) => apiClient.get('/calculations', { params: filters }),

  getById: (id) => apiClient.get(`/calculations/${id}`),
  create: (data) => apiClient.post('/calculations', data),
  update: (id, data) => apiClient.put(`/calculations/${id}`, data),
  delete: (id) => apiClient.delete(`/calculations/${id}`),
}

// ==========================================
// HEALTH CHECK
// ==========================================
export const healthAPI = {
  check: () => apiClient.get('/health'),
}

export default apiClient
