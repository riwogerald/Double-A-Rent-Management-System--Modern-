import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { landlordsAPI } from '../lib/api'
import DataTable, { Column, Action } from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { Edit, Trash2, Eye, Users, Phone, Mail, CreditCard } from 'lucide-react'

const Landlords: React.FC = () => {
  const [selectedLandlord, setSelectedLandlord] = useState<any>(null)
  const queryClient = useQueryClient()

  // Fetch landlords
  const { data: landlords = [], isLoading } = useQuery({
    queryKey: ['landlords'],
    queryFn: landlordsAPI.getAll,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: landlordsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landlords'] })
      alert('Landlord deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to delete landlord')
    },
  })

  // Define table columns
  const columns: Column[] = [
    {
      key: 'landlord_no',
      label: 'Landlord #',
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
          <span className="truncate max-w-xs">{value}</span>
        </div>
      ) : 'N/A',
    },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'bank_name',
      label: 'Bank',
      render: (value, row) => {
        if (value && row.bank_account) {
          return (
            <div>
              <div className="font-medium text-sm">{value}</div>
              <div className="flex items-center text-xs text-secondary-500">
                <CreditCard className="h-3 w-3 mr-1" />
                {row.bank_account}
              </div>
            </div>
          )
        }
        return <span className="text-secondary-400">No bank details</span>
      },
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
      key: 'property_count',
      label: 'Properties',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary-600">
          {value || 0} properties
        </span>
      ),
    },
  ]

  // Define table actions
  const actions: Action[] = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: (landlord) => {
        setSelectedLandlord(landlord)
        // TODO: Open landlord details modal
        console.log('View landlord:', landlord)
      },
      variant: 'primary',
    },
    {
      icon: Edit,
      label: 'Edit Landlord',
      onClick: (landlord) => {
        // TODO: Open edit form
        console.log('Edit landlord:', landlord)
      },
      variant: 'secondary',
    },
    {
      icon: Trash2,
      label: 'Delete Landlord',
      onClick: (landlord) => {
        if (window.confirm(`Are you sure you want to delete landlord ${landlord.name}?`)) {
          deleteMutation.mutate(landlord.id)
        }
      },
      variant: 'danger',
    },
  ]

  const handleAddLandlord = () => {
    // TODO: Open add landlord form
    console.log('Add new landlord')
    alert('Add Landlord form coming soon!')
  }

  const activeLandlords = landlords.filter(l => l.is_active)
  const totalProperties = landlords.reduce((sum, l) => sum + (l.property_count || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Landlords</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage landlord information and accounts
          </p>
        </div>
      </div>

      {/* Landlords Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Landlords</p>
              <p className="text-2xl font-bold text-secondary-900">{landlords.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-success-50">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active</p>
              <p className="text-2xl font-bold text-secondary-900">{activeLandlords.length}</p>
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
                {landlords.length - activeLandlords.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <CreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Properties</p>
              <p className="text-2xl font-bold text-secondary-900">{totalProperties}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Landlords Data Table */}
      <DataTable
        data={landlords}
        columns={columns}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search landlords..."
        onAdd={handleAddLandlord}
        addButtonText="Add Landlord"
        emptyMessage="No landlords found. Add your first landlord to get started."
      />
    </div>
  )
}

export default Landlords
