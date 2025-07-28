import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { dashboardAPI } from '../lib/api'
import { Building2, Users, CreditCard, TrendingUp, Database } from 'lucide-react'
import TestDataGenerator from '../components/TestDataGenerator'

const Dashboard: React.FC = () => {
  const [showTestDataGenerator, setShowTestDataGenerator] = useState(false)
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardAPI.getStats,
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
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 shadow-xl">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
          <p className="mt-2 text-primary-100">
            Here's what's happening with your properties today.
          </p>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <Building2 className="h-24 w-24 text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div 
            key={stat.name} 
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-secondary-100 hover:border-primary-200 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600 group-hover:text-secondary-700 transition-colors">{stat.name}</p>
                <p className="text-2xl font-bold text-secondary-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Property Overview Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-primary-50 p-3 rounded-xl">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 ml-3">
              Property Overview
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-xl">
              <span className="text-sm font-medium text-secondary-600">Total Properties</span>
              <span className="font-bold text-lg text-secondary-900">{stats?.totalProperties || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-success-50 rounded-xl">
              <span className="text-sm font-medium text-secondary-600">Occupied</span>
              <span className="font-bold text-lg text-success-600">{stats?.occupiedProperties || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-warning-50 rounded-xl">
              <span className="text-sm font-medium text-secondary-600">Vacant</span>
              <span className="font-bold text-lg text-warning-600">{stats?.vacantProperties || 0}</span>
            </div>
            <div className="pt-4 border-t border-secondary-200">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl">
                <span className="text-sm font-semibold text-secondary-700">Occupancy Rate</span>
                <span className="font-bold text-xl text-primary-600">{stats?.occupancyRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-secondary-100 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-success-50 p-3 rounded-xl">
              <CreditCard className="h-6 w-6 text-success-600" />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 ml-3">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              💳 Record Rent Payment
            </button>
            <button className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
              👤 Add New Tenant
            </button>
            <button className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
              🏢 Add New Property
            </button>
            <button className="w-full bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105">
              📊 Generate Report
            </button>
            <div className="border-t border-secondary-200 pt-3 mt-4">
              <button 
                onClick={() => setShowTestDataGenerator(true)}
                className="w-full bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Database className="h-4 w-4 inline mr-2" />
                Generate Test Data
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Test Data Generator Modal */}
      {showTestDataGenerator && (
        <TestDataGenerator onClose={() => setShowTestDataGenerator(false)} />
      )}
    </div>
  )
}

export default Dashboard