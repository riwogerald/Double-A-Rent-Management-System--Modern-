// Mock API for frontend-only deployment (Netlify)
import bcrypt from 'bcryptjs'

// Mock user database
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@property.com',
    password: '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', // Demo123!
    role: 'admin',
    full_name: 'System Administrator'
  },
  {
    id: 2,
    email: 'manager@property.com',
    password: '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', // Demo123!
    role: 'manager',
    full_name: 'Property Manager'
  },
  {
    id: 3,
    email: 'agent1@property.com',
    password: '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', // Demo123!
    role: 'agent',
    full_name: 'Sarah Johnson'
  },
  {
    id: 4,
    email: 'agent2@property.com',
    password: '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', // Demo123!
    role: 'agent',
    full_name: 'Michael Chen'
  },
  {
    id: 5,
    email: 'test@example.com',
    password: '$2b$10$WcGOKNeedbWg2surioKW4unhJSjjQGuO.Xhdgsj6FXz3KEIo6DgnG', // Demo123!
    role: 'admin',
    full_name: 'Test User'
  }
]

// Mock dashboard stats
const MOCK_DASHBOARD_STATS = {
  totalProperties: 18,
  occupiedProperties: 15,
  vacantProperties: 3,
  totalTenants: 12,
  monthlyCollection: 850000,
  occupancyRate: 87
}

// Mock data generators
const generateMockProperties = () => [
  { id: 1, property_no: 'PROP001', estate_name: 'Sunrise Heights', house_number: 'A101', house_type: '2 Bedroom', rent_amount: 45000, status: 'Occupied', tenant_name: 'Alice Wanjiru' },
  { id: 2, property_no: 'PROP002', estate_name: 'Sunrise Heights', house_number: 'A102', house_type: '1 Bedroom', rent_amount: 32000, status: 'Occupied', tenant_name: 'John Muchiri' },
  { id: 3, property_no: 'PROP003', estate_name: 'Garden View', house_number: 'GV001', house_type: '4+ Bedroom', rent_amount: 85000, status: 'Occupied', tenant_name: 'The Johnson Family' },
  { id: 4, property_no: 'PROP004', estate_name: 'The Mirage', house_number: 'MR101', house_type: '3 Bedroom', rent_amount: 70000, status: 'Occupied', tenant_name: 'Dr. Priya Sharma' },
  { id: 5, property_no: 'PROP005', estate_name: 'Acacia Court', house_number: 'AC001', house_type: '4+ Bedroom', rent_amount: 120000, status: 'Vacant', tenant_name: null },
]

const generateMockTenants = () => [
  { id: 1, tenant_no: 'TEN001', name: 'Alice Wanjiru', phone: '+254701111111', email: 'alice.wanjiru@gmail.com', property_no: 'PROP001', is_active: true },
  { id: 2, tenant_no: 'TEN002', name: 'John Muchiri', phone: '+254702222222', email: 'j.muchiri@outlook.com', property_no: 'PROP002', is_active: true },
  { id: 3, tenant_no: 'TEN003', name: 'The Johnson Family', phone: '+254706666666', email: 'johnson.family@email.com', property_no: 'PROP003', is_active: true },
  { id: 4, tenant_no: 'TEN004', name: 'Dr. Priya Sharma', phone: '+254703333333', email: 'priya.sharma@hospital.com', property_no: 'PROP004', is_active: true },
]

const generateMockAgents = () => [
  { id: 1, agent_no: 'AGT001', name: 'Sarah Johnson', phone: '+254701234567', email: 'sarah.johnson@doubleaprop.com', commission_rate: 2.50, is_active: true, property_count: 5, total_rent_value: 250000 },
  { id: 2, agent_no: 'AGT002', name: 'Michael Chen', phone: '+254702345678', email: 'michael.chen@doubleaprop.com', commission_rate: 2.00, is_active: true, property_count: 4, total_rent_value: 180000 },
  { id: 3, agent_no: 'AGT003', name: 'Aisha Patel', phone: '+254703456789', email: 'aisha.patel@doubleaprop.com', commission_rate: 1.75, is_active: true, property_count: 3, total_rent_value: 150000 },
]

const generateMockLandlords = () => [
  { id: 1, landlord_no: 'LL001', name: 'Dr. Robert Mwangi', phone: '+254711234567', email: 'r.mwangi@email.com', bank_name: 'KCB Bank', is_active: true },
  { id: 2, landlord_no: 'LL002', name: 'Mrs. Elizabeth Ochieng', phone: '+254722345678', email: 'e.ochieng@gmail.com', bank_name: 'Equity Bank', is_active: true },
  { id: 3, landlord_no: 'LL003', name: 'Rajesh Kumar Holdings Ltd', phone: '+254733456789', email: 'properties@rajeshkumar.co.ke', bank_name: 'Standard Chartered', is_active: true },
]

const generateMockRentPayments = () => [
  { id: 1, payment_no: 'PAY001', tenant: 'Alice Wanjiru', property: 'PROP001', amount_paid: 45000, rent_month: '2024-03-01', payment_date: '2024-03-05', payment_method: 'Bank Transfer', status: 'Paid' },
  { id: 2, payment_no: 'PAY002', tenant: 'John Muchiri', property: 'PROP002', amount_paid: 32000, rent_month: '2024-03-01', payment_date: '2024-03-01', payment_method: 'Mobile Money', status: 'Paid' },
  { id: 3, payment_no: 'PAY003', tenant: 'Dr. Priya Sharma', property: 'PROP004', amount_paid: 70000, rent_month: '2024-03-01', payment_date: '2024-03-08', payment_method: 'Bank Transfer', status: 'Paid' },
]

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API implementation
export const mockAPI = {
  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      await delay(800) // Simulate network delay
      
      const user = MOCK_USERS.find(u => u.email === email)
      if (!user) {
        throw new Error('Invalid credentials')
      }

      // For demo purposes, we'll do a simple password check
      // In real app, this would be done server-side
      try {
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
          throw new Error('Invalid credentials')
        }
      } catch (error) {
        // Fallback for frontend-only demo
        if (password !== 'Demo123!') {
          throw new Error('Invalid credentials')
        }
      }

      // Generate mock JWT token
      const token = btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 24 * 60 * 60 * 1000 }))
      
      return {
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name
        }
      }
    },

    register: async (email: string, password: string) => {
      await delay(800)
      
      const existingUser = MOCK_USERS.find(u => u.email === email)
      if (existingUser) {
        throw new Error('User already exists')
      }

      const newUser = {
        id: MOCK_USERS.length + 1,
        email,
        password: await bcrypt.hash(password, 10),
        role: 'admin',
        full_name: 'New User'
      }

      MOCK_USERS.push(newUser)
      
      const token = btoa(JSON.stringify({ id: newUser.id, email: newUser.email, exp: Date.now() + 24 * 60 * 60 * 1000 }))
      
      return {
        message: 'User created successfully',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          full_name: newUser.full_name
        }
      }
    }
  },

  // Dashboard endpoints
  dashboard: {
    getStats: async () => {
      await delay(500)
      return MOCK_DASHBOARD_STATS
    }
  },

  // Properties endpoints
  properties: {
    getAll: async () => {
      await delay(600)
      return generateMockProperties()
    }
  },

  // Tenants endpoints
  tenants: {
    getAll: async () => {
      await delay(600)
      return generateMockTenants()
    }
  },

  // Agents endpoints
  agents: {
    getAll: async () => {
      await delay(600)
      return generateMockAgents()
    }
  },

  // Landlords endpoints
  landlords: {
    getAll: async () => {
      await delay(600)
      return generateMockLandlords()
    }
  },

  // Rent payments endpoints
  rentPayments: {
    getAll: async () => {
      await delay(600)
      return generateMockRentPayments()
    }
  }
}

// Helper function to check if we're in development or production
export const isProduction = () => {
  return process.env.NODE_ENV === 'production' || window.location.hostname !== 'localhost'
}
