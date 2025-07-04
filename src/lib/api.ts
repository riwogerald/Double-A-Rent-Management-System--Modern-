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

// Agents API
export const agentsAPI = {
  getAll: async () => {
    const response = await api.get('/agents')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/agents/${id}`)
    return response.data
  },
  
  create: async (agent: any) => {
    const response = await api.post('/agents', agent)
    return response.data
  },
  
  update: async (id: number, agent: any) => {
    const response = await api.put(`/agents/${id}`, agent)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/agents/${id}`)
    return response.data
  },
}

// Landlords API
export const landlordsAPI = {
  getAll: async () => {
    const response = await api.get('/landlords')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/landlords/${id}`)
    return response.data
  },
  
  create: async (landlord: any) => {
    const response = await api.post('/landlords', landlord)
    return response.data
  },
  
  update: async (id: number, landlord: any) => {
    const response = await api.put(`/landlords/${id}`, landlord)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/landlords/${id}`)
    return response.data
  },
}

// Estates API
export const estatesAPI = {
  getAll: async () => {
    const response = await api.get('/estates')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/estates/${id}`)
    return response.data
  },
  
  create: async (estate: any) => {
    const response = await api.post('/estates', estate)
    return response.data
  },
  
  update: async (id: number, estate: any) => {
    const response = await api.put(`/estates/${id}`, estate)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/estates/${id}`)
    return response.data
  },
}

// Properties API
export const propertiesAPI = {
  getAll: async () => {
    const response = await api.get('/properties')
    return response.data
  },
  
  getVacant: async () => {
    const response = await api.get('/properties/vacant')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/properties/${id}`)
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

// Tenants API
export const tenantsAPI = {
  getAll: async () => {
    const response = await api.get('/tenants')
    return response.data
  },
  
  getActive: async () => {
    const response = await api.get('/tenants/active')
    return response.data
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/tenants/${id}`)
    return response.data
  },
  
  create: async (tenant: any) => {
    const response = await api.post('/tenants', tenant)
    return response.data
  },
  
  update: async (id: number, tenant: any) => {
    const response = await api.put(`/tenants/${id}`, tenant)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/tenants/${id}`)
    return response.data
  },
}

// Rent Payments API
export const rentPaymentsAPI = {
  getAll: async () => {
    const response = await api.get('/rent-payments')
    return response.data
  },
  
  getByTenant: async (tenantId: number) => {
    const response = await api.get(`/rent-payments/tenant/${tenantId}`)
    return response.data
  },
  
  getDefaulters: async () => {
    const response = await api.get('/rent-payments/defaulters')
    return response.data
  },
  
  create: async (payment: any) => {
    const response = await api.post('/rent-payments', payment)
    return response.data
  },
  
  update: async (id: number, payment: any) => {
    const response = await api.put(`/rent-payments/${id}`, payment)
    return response.data
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/rent-payments/${id}`)
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