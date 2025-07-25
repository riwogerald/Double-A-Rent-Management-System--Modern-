import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesAPI, formatCurrency } from '../lib/api'
import DataTable, { Column, Action } from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import PropertyForm from '../components/forms/PropertyForm'
import { Edit, Trash2, Eye, Building } from 'lucide-react'

const Properties: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const queryClient = useQueryClient()

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: propertiesAPI.getAll,
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: propertiesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setIsFormOpen(false)
      setEditingProperty(null)
      alert('Property created successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create property')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => propertiesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      setIsFormOpen(false)
      setEditingProperty(null)
      alert('Property updated successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to update property')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: propertiesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      alert('Property deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to delete property')
    },
  })

  // Define table columns
  const columns: Column[] = [
    {
      key: 'property_no',
      label: 'Property #',
      sortable: true,
    },
    {
      key: 'estate_name',
      label: 'Estate',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'house_number',
      label: 'House #',
      sortable: true,
    },
    {
      key: 'house_type',
      label: 'Type',
      sortable: true,
    },
    {
      key: 'rent_amount',
      label: 'Rent',
      sortable: true,
      render: (value) => formatCurrency(value || 0),
    },
    {
      key: 'landlord_name',
      label: 'Landlord',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'agent_name',
      label: 'Agent',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value || 'Vacant'} />,
    },
    {
      key: 'tenant_name',
      label: 'Tenant',
      render: (value, row) => {
        if (row.tenant_active && value) {
          return (
            <span className="text-success-600 font-medium">{value}</span>
          )
        }
        return <span className="text-secondary-400">No tenant</span>
      },
    },
  ]

  // Define table actions
  const actions: Action[] = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: (property) => {
        setSelectedProperty(property)
        // TODO: Open property details modal
        console.log('View property:', property)
      },
      variant: 'primary',
    },
    {
      icon: Edit,
      label: 'Edit Property',
      onClick: (property) => {
        setEditingProperty(property)
        setIsFormOpen(true)
      },
      variant: 'secondary',
    },
    {
      icon: Trash2,
      label: 'Delete Property',
      onClick: (property) => {
        if (window.confirm(`Are you sure you want to delete property ${property.property_no}?`)) {
          deleteMutation.mutate(property.id)
        }
      },
      variant: 'danger',
    },
  ]

  const handleAddProperty = () => {
    setEditingProperty(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    if (editingProperty) {
      updateMutation.mutate({ id: editingProperty.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingProperty(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Properties</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage your property portfolio
          </p>
        </div>
      </div>

      {/* Properties Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Properties</p>
              <p className="text-2xl font-bold text-secondary-900">{properties.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-success-50">
              <Building className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Occupied</p>
              <p className="text-2xl font-bold text-secondary-900">
                {properties.filter(p => p.status === 'Occupied').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-warning-50">
              <Building className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Vacant</p>
              <p className="text-2xl font-bold text-secondary-900">
                {properties.filter(p => p.status === 'Vacant').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Monthly Rent</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(properties.reduce((sum, p) => sum + (p.rent_amount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Data Table */}
      <DataTable
        data={properties}
        columns={columns}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search properties..."
        onAdd={handleAddProperty}
        addButtonText="Add Property"
        emptyMessage="No properties found. Add your first property to get started."
      />

      {/* Property Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormCancel}
        title={editingProperty ? 'Edit Property' : 'Add New Property'}
        size="lg"
      >
        <PropertyForm
          property={editingProperty}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default Properties
