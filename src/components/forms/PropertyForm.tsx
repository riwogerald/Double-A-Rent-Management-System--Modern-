import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { landlordsAPI, agentsAPI, estatesAPI } from '../../lib/api'

interface PropertyFormProps {
  property?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const PropertyForm: React.FC<PropertyFormProps> = ({
  property,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    estate_id: '',
    landlord_id: '',
    agent_id: '',
    house_number: '',
    house_type: 'Bedsitter',
    rent_amount: '',
    deposit_amount: '',
    status: 'Vacant',
    description: ''
  })

  // Fetch related data
  const { data: landlords = [] } = useQuery({
    queryKey: ['landlords'],
    queryFn: landlordsAPI.getAll,
  })

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsAPI.getAll,
  })

  const { data: estates = [] } = useQuery({
    queryKey: ['estates'],
    queryFn: estatesAPI.getAll,
  })

  useEffect(() => {
    if (property) {
      setFormData({
        estate_id: property.estate_id || '',
        landlord_id: property.landlord_id || '',
        agent_id: property.agent_id || '',
        house_number: property.house_number || '',
        house_type: property.house_type || 'Bedsitter',
        rent_amount: property.rent_amount || '',
        deposit_amount: property.deposit_amount || '',
        status: property.status || 'Vacant',
        description: property.description || ''
      })
    }
  }, [property])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      rent_amount: parseFloat(formData.rent_amount) || 0,
      deposit_amount: parseFloat(formData.deposit_amount) || 0,
      estate_id: formData.estate_id || null,
      landlord_id: formData.landlord_id || null,
      agent_id: formData.agent_id || null,
    })
  }

  const houseTypes = [
    'Bedsitter',
    '1 Bedroom',
    '2 Bedroom',
    '3 Bedroom',
    '4+ Bedroom',
    'Commercial'
  ]

  const statusTypes = [
    'Vacant',
    'Occupied',
    'Under Maintenance',
    'Reserved'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estate Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Estate
          </label>
          <select
            name="estate_id"
            value={formData.estate_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Estate</option>
            {estates.map((estate: any) => (
              <option key={estate.id} value={estate.id}>
                {estate.name}
              </option>
            ))}
          </select>
        </div>

        {/* House Number */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            House Number <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="house_number"
            value={formData.house_number}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., A1, B2, House 10"
          />
        </div>

        {/* House Type */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            House Type <span className="text-error-500">*</span>
          </label>
          <select
            name="house_type"
            value={formData.house_type}
            onChange={handleChange}
            required
            className="input"
          >
            {houseTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Rent Amount */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Monthly Rent (KSh) <span className="text-error-500">*</span>
          </label>
          <input
            type="number"
            name="rent_amount"
            value={formData.rent_amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="input"
            placeholder="25000"
          />
        </div>

        {/* Deposit Amount */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Deposit Amount (KSh)
          </label>
          <input
            type="number"
            name="deposit_amount"
            value={formData.deposit_amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="25000"
          />
        </div>

        {/* Landlord Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Landlord
          </label>
          <select
            name="landlord_id"
            value={formData.landlord_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Landlord</option>
            {landlords.map((landlord: any) => (
              <option key={landlord.id} value={landlord.id}>
                {landlord.name}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Agent
          </label>
          <select
            name="agent_id"
            value={formData.agent_id}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Agent</option>
            {agents.map((agent: any) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
          >
            {statusTypes.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Additional details about the property..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-secondary-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : property ? 'Update Property' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}

export default PropertyForm
