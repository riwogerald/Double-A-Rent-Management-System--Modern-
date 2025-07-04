export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agents: {
        Row: {
          agent_no: string
          name: string
          phone: string | null
          email: string | null
          gender: 'Male' | 'Female' | 'Other' | null
          commission_rate: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          agent_no?: string
          name: string
          phone?: string | null
          email?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          commission_rate?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          agent_no?: string
          name?: string
          phone?: string | null
          email?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          commission_rate?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      landlords: {
        Row: {
          landlord_no: string
          name: string
          phone: string | null
          email: string | null
          gender: 'Male' | 'Female' | 'Other' | null
          bank_account: string | null
          bank_name: string | null
          id_number: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          landlord_no?: string
          name: string
          phone?: string | null
          email?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          bank_account?: string | null
          bank_name?: string | null
          id_number?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          landlord_no?: string
          name?: string
          phone?: string | null
          email?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          bank_account?: string | null
          bank_name?: string | null
          id_number?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      estates: {
        Row: {
          estate_no: string
          name: string
          location: string | null
          description: string | null
          total_houses: number
          occupied_houses: number
          created_at: string
          updated_at: string
        }
        Insert: {
          estate_no?: string
          name: string
          location?: string | null
          description?: string | null
          total_houses?: number
          occupied_houses?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          estate_no?: string
          name?: string
          location?: string | null
          description?: string | null
          total_houses?: number
          occupied_houses?: number
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          property_no: string
          estate_no: string | null
          landlord_no: string | null
          agent_no: string | null
          house_number: string
          house_type: 'Bedsitter' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | '4+ Bedroom' | 'Commercial'
          rent_amount: number
          deposit_amount: number | null
          status: 'Vacant' | 'Occupied' | 'Under Maintenance' | 'Reserved'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          property_no?: string
          estate_no?: string | null
          landlord_no?: string | null
          agent_no?: string | null
          house_number: string
          house_type: 'Bedsitter' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | '4+ Bedroom' | 'Commercial'
          rent_amount: number
          deposit_amount?: number | null
          status?: 'Vacant' | 'Occupied' | 'Under Maintenance' | 'Reserved'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          property_no?: string
          estate_no?: string | null
          landlord_no?: string | null
          agent_no?: string | null
          house_number?: string
          house_type?: 'Bedsitter' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | '4+ Bedroom' | 'Commercial'
          rent_amount?: number
          deposit_amount?: number | null
          status?: 'Vacant' | 'Occupied' | 'Under Maintenance' | 'Reserved'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          tenant_no: string
          property_no: string | null
          name: string
          phone: string | null
          email: string | null
          id_number: string | null
          gender: 'Male' | 'Female' | 'Other' | null
          occupation: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          move_in_date: string | null
          move_out_date: string | null
          deposit_paid: number | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          tenant_no?: string
          property_no?: string | null
          name: string
          phone?: string | null
          email?: string | null
          id_number?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          occupation?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          move_in_date?: string | null
          move_out_date?: string | null
          deposit_paid?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          tenant_no?: string
          property_no?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          id_number?: string | null
          gender?: 'Male' | 'Female' | 'Other' | null
          occupation?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          move_in_date?: string | null
          move_out_date?: string | null
          deposit_paid?: number | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      rent_payments: {
        Row: {
          payment_no: string
          tenant_no: string | null
          property_no: string | null
          amount_paid: number
          rent_month: string
          payment_date: string
          payment_method: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          penalty_amount: number
          balance_before: number
          balance_after: number
          receipt_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          payment_no?: string
          tenant_no?: string | null
          property_no?: string | null
          amount_paid: number
          rent_month: string
          payment_date?: string
          payment_method?: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          penalty_amount?: number
          balance_before?: number
          balance_after?: number
          receipt_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          payment_no?: string
          tenant_no?: string | null
          property_no?: string | null
          amount_paid?: number
          rent_month?: string
          payment_date?: string
          payment_method?: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          penalty_amount?: number
          balance_before?: number
          balance_after?: number
          receipt_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      company_expenses: {
        Row: {
          receipt_no: string
          description: string
          amount: number
          expense_date: string
          category: 'Maintenance' | 'Utilities' | 'Marketing' | 'Administrative' | 'Legal' | 'Other'
          vendor: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          receipt_no?: string
          description: string
          amount: number
          expense_date?: string
          category?: 'Maintenance' | 'Utilities' | 'Marketing' | 'Administrative' | 'Legal' | 'Other'
          vendor?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          receipt_no?: string
          description?: string
          amount?: number
          expense_date?: string
          category?: 'Maintenance' | 'Utilities' | 'Marketing' | 'Administrative' | 'Legal' | 'Other'
          vendor?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      remittances: {
        Row: {
          remittance_no: string
          landlord_no: string | null
          property_no: string | null
          rent_collected: number
          company_commission: number
          agent_commission: number
          net_amount: number
          remittance_date: string
          payment_method: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          remittance_no?: string
          landlord_no?: string | null
          property_no?: string | null
          rent_collected: number
          company_commission: number
          agent_commission?: number
          net_amount: number
          remittance_date?: string
          payment_method?: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          remittance_no?: string
          landlord_no?: string | null
          property_no?: string | null
          rent_collected?: number
          company_commission?: number
          agent_commission?: number
          net_amount?: number
          remittance_date?: string
          payment_method?: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      employees: {
        Row: {
          employee_no: string
          name: string
          position: string | null
          salary: number | null
          phone: string | null
          email: string | null
          hire_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          employee_no?: string
          name: string
          position?: string | null
          salary?: number | null
          phone?: string | null
          email?: string | null
          hire_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          employee_no?: string
          name?: string
          position?: string | null
          salary?: number | null
          phone?: string | null
          email?: string | null
          hire_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_penalty: {
        Args: {
          outstanding_amount: number
          days_past_due: number
        }
        Returns: number
      }
      calculate_commission: {
        Args: {
          rent_amount: number
          is_agent?: boolean
        }
        Returns: number
      }
    }
    Enums: {
      gender_type: 'Male' | 'Female' | 'Other'
      house_type: 'Bedsitter' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | '4+ Bedroom' | 'Commercial'
      payment_method: 'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Cheque'
      expense_category: 'Maintenance' | 'Utilities' | 'Marketing' | 'Administrative' | 'Legal' | 'Other'
      property_status: 'Vacant' | 'Occupied' | 'Under Maintenance' | 'Reserved'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}