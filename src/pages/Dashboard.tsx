import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { Building2, Users, CreditCard, TrendingUp } from 'lucide-react'

const Dashboard: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [
        { count: totalProperties },
        { count: occupiedProperties },
        { count: totalTenants },
        { data: recentPayments },
      ] = await Promise.all([
        supabase.from('properties').select('*', { count: 'exact', head: true }),
        supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'Occupied'),
        supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase
          .from('rent_payments')
          .select('amount_paid')
          .gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      ])

      const monthlyCollection = recentPayments?.reduce((sum, payment) => sum + payment.amount_paid, 0) || 0

      return {
        totalProperties: totalProperties || 0,
        occupiedProperties: occupiedProperties || 0,
        vacantProperties: (totalProperties || 0) - (occupiedProperties || 0),
        totalTenants: totalTenants || 0,
        monthlyCollection,
        occupancyRate: totalProperties ? Math.round((occupiedProperties / totalProperties) * 100) : 0,
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Building2,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      name: 'Active Tenants',
      value: stats?.totalTenants || 0,
      icon: Users,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
    },
    {
      name: 'Monthly Collection',
      value: `KSh ${(stats?.monthlyCollection || 0).toLocaleString()}`,
      icon: CreditCard,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      name: 'Occupancy Rate',
      value: `${stats?.occupancyRate || 0}%`,
      icon: TrendingUp,
      color: 'text-error-600',
      bgColor: 'bg-error-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Welcome to your property management system
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Property Overview
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Total Properties</span>
              <span className="font-medium">{stats?.totalProperties || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Occupied</span>
              <span className="font-medium text-success-600">{stats?.occupiedProperties || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary-600">Vacant</span>
              <span className="font-medium text-warning-600">{stats?.vacantProperties || 0}</span>
            </div>
            <div className="pt-2 border-t border-secondary-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-secondary-700">Occupancy Rate</span>
                <span className="font-bold text-primary-600">{stats?.occupancyRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full btn-primary text-left">
              Record Rent Payment
            </button>
            <button className="w-full btn-secondary text-left">
              Add New Tenant
            </button>
            <button className="w-full btn-secondary text-left">
              Add New Property
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard