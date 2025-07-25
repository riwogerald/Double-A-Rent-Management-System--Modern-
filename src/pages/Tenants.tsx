import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tenantsAPI, formatCurrency, formatDate } from '../lib/api'
import DataTable, { Column, Action } from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { Edit, Trash2, Eye, Users, Phone, Mail, Calendar } from 'lucide-react'

const Tenants: React.FC = () => {
  const [selectedTenant, setSelectedTenant] = useState<any>(null)
  const queryClient = useQueryClient()

  // Fetch tenants
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['tenants'],
    queryFn: tenantsAPI.getAll,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: tenantsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      alert('Tenant deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to delete tenant')
    },
  })

  // Define table columns
  const columns: Column[] = [
    {
      key: 'tenant_no',
      label: 'Tenant #',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-secondary-900">{value}</div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Phone className="h-3 w-3 mr-1 text-secondary-400" />
          {value}
        </div>
      ) : 'N/A',
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Mail className="h-3 w-3 mr-1 text-secondary-400" />
          {value}
        </div>
      ) : 'N/A',
    },
    {
      key: 'property_details',
      label: 'Property',
      sortable: true,
      render: (value, row) => {
        if (value) {
          return (
            <div>
              <div className="font-medium">{value}</div>
              <div className="text-xs text-secondary-500">
                {formatCurrency(row.rent_amount || 0)}/month
              </div>
            </div>
          )
        }
        return <span className="text-secondary-400">No property assigned</span>
      },
    },
    {
      key: 'move_in_date',
      label: 'Move In',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1 text-secondary-400" />
          {formatDate(value)}
        </div>
      ) : 'N/A',
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value ? 'Active' : 'Inactive'} />
      ),
    },
    {
      key: 'deposit_paid',
      label: 'Deposit',
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
  ]

  // Define table actions
  const actions: Action[] = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: (tenant) => {
        setSelectedTenant(tenant)
        // TODO: Open tenant details modal
        console.log('View tenant:', tenant)
      },
      variant: 'primary',
    },
    {
      icon: Edit,
      label: 'Edit Tenant',
      onClick: (tenant) => {
        // TODO: Open edit form
        console.log('Edit tenant:', tenant)
      },
      variant: 'secondary',
    },
    {
      icon: Trash2,
      label: 'Delete Tenant',
      onClick: (tenant) => {
        if (window.confirm(`Are you sure you want to delete tenant ${tenant.name}?`)) {
          deleteMutation.mutate(tenant.id)
        }
      },
      variant: 'danger',
    },
  ]

  const handleAddTenant = () => {
    // TODO: Open add tenant form
    console.log('Add new tenant')
    alert('Add Tenant form coming soon!')
  }

  const activeTenants = tenants.filter(t => t.is_active)
  const totalRentCollected = activeTenants.reduce((sum, t) => sum + (t.rent_amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tenants</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage tenant information and leases
          </p>
        </div>
      </div>

      {/* Tenants Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Tenants</p>
              <p className="text-2xl font-bold text-secondary-900">{tenants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-success-50">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active Tenants</p>
              <p className="text-2xl font-bold text-secondary-900">{activeTenants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-warning-50">
              <Users className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Inactive</p>
              <p className="text-2xl font-bold text-secondary-900">
                {tenants.length - activeTenants.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Monthly Rent</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(totalRentCollected)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Data Table */}
      <DataTable
        data={tenants}
        columns={columns}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search tenants..."
        onAdd={handleAddTenant}
        addButtonText="Add Tenant"
        emptyMessage="No tenants found. Add your first tenant to get started."
      />
    </div>
  )
}

export default Tenants
