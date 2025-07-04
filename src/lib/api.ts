import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password })
    return response.data
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },
}

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await api.get('/properties')
    return response.data
  },
  
  create: async (property: any) => {
    const response = await api.post('/properties', property)
    return response.data
  },
  
  update: async (id: number, property: any) => {
    const response = await api.put(`/properties/${id}`, property)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/properties/${id}`)
    return response.data
  },
}

// Business logic functions
export const calculatePenalty = (outstandingAmount: number, daysPastDue: number): number => {
  const dailyRate = 0.005 // 0.5%
  return outstandingAmount * Math.pow(1 + dailyRate, daysPastDue) - outstandingAmount
}

export const calculateCommission = (rentAmount: number, isAgent: boolean = false): number => {
  const rate = isAgent ? 0.01 : 0.05 // 1% for agents, 5% for company
  return rentAmount * rate
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2
  }).format(amount)
}

// Helper function to format dates
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export default api