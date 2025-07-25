import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { propertiesAPI } from '../../lib/api'

interface TenantFormProps {
  tenant?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const TenantForm: React.FC<TenantFormProps> = ({
  tenant,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    property_id: '',
    name: '',
    phone: '',
    email: '',
    id_number: '',
    gender: '',
    occupation: '',
    emergency_contact: '',
    emergency_phone: '',
    move_in_date: '',
    move_out_date: '',
    deposit_paid: '',
    is_active: true
  })

  // Fetch vacant properties
  const { data: properties = [] } = useQuery({
    queryKey: ['properties-vacant'],
    queryFn: propertiesAPI.getVacant,
  })

  useEffect(() => {
    if (tenant) {
      setFormData({
        property_id: tenant.property_id || '',
        name: tenant.name || '',
        phone: tenant.phone || '',
        email: tenant.email || '',
        id_number: tenant.id_number || '',
        gender: tenant.gender || '',
        occupation: tenant.occupation || '',
        emergency_contact: tenant.emergency_contact || '',
        emergency_phone: tenant.emergency_phone || '',
        move_in_date: tenant.move_in_date ? tenant.move_in_date.split('T')[0] : '',
        move_out_date: tenant.move_out_date ? tenant.move_out_date.split('T')[0] : '',
        deposit_paid: tenant.deposit_paid || '',
        is_active: tenant.is_active !== undefined ? tenant.is_active : true
      })
    }
  }, [tenant])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      property_id: formData.property_id || null,
      deposit_paid: parseFloat(formData.deposit_paid) || 0,
      move_in_date: formData.move_in_date || null,
      move_out_date: formData.move_out_date || null,
    })
  }

  const genderOptions = ['Male', 'Female', 'Other']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Full Name <span className="text-error-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
            placeholder="John Doe"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="+254700123456"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="john@example.com"
          />
        </div>

        {/* ID Number */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            ID Number
          </label>
          <input
            type="text"
            name="id_number"
            value={formData.id_number}
            onChange={handleChange}
            className="input"
            placeholder="12345678"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Gender</option>
            {genderOptions.map(gender => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            className="input"
            placeholder="Software Engineer"
          />
        </div>

        {/* Property Selection */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Property {!tenant && <span className="text-error-500">*</span>}
          </label>
          <select
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            required={!tenant}
            className="input"
          >
            <option value="">Select Property</option>
            {properties.map((property: any) => (
              <option key={property.id} value={property.id}>
                {property.estate_name} - {property.house_number} ({property.house_type})
              </option>
            ))}
          </select>
        </div>

        {/* Move In Date */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Move In Date
          </label>
          <input
            type="date"
            name="move_in_date"
            value={formData.move_in_date}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Move Out Date */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Move Out Date
          </label>
          <input
            type="date"
            name="move_out_date"
            value={formData.move_out_date}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Deposit Paid */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Deposit Paid (KSh)
          </label>
          <input
            type="number"
            name="deposit_paid"
            value={formData.deposit_paid}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="25000"
          />
        </div>

        {/* Emergency Contact */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergency_contact"
            value={formData.emergency_contact}
            onChange={handleChange}
            className="input"
            placeholder="Jane Doe"
          />
        </div>

        {/* Emergency Phone */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Emergency Contact Phone
          </label>
          <input
            type="tel"
            name="emergency_phone"
            value={formData.emergency_phone}
            onChange={handleChange}
            className="input"
            placeholder="+254700123457"
          />
        </div>
      </div>

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-sm font-medium text-secondary-700">
          Active Tenant
        </label>
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
          {isLoading ? 'Saving...' : tenant ? 'Update Tenant' : 'Create Tenant'}
        </button>
      </div>
    </form>
  )
}

export default TenantForm
