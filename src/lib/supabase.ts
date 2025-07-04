import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

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