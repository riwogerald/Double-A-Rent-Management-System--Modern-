import React, { useState, useEffect } from 'react'

interface AgentFormProps {
  agent?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const AgentForm: React.FC<AgentFormProps> = ({
  agent,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    commission_rate: '1.00',
    is_active: true
  })

  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || '',
        phone: agent.phone || '',
        email: agent.email || '',
        gender: agent.gender || '',
        commission_rate: agent.commission_rate || '1.00',
        is_active: agent.is_active !== undefined ? agent.is_active : true
      })
    }
  }, [agent])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      commission_rate: parseFloat(formData.commission_rate) || 1.00
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

        {/* Commission Rate */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Commission Rate (%) <span className="text-error-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="commission_rate"
              value={formData.commission_rate}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.01"
              className="input pr-8"
              placeholder="1.00"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-secondary-500 text-sm">%</span>
            </div>
          </div>
          <p className="mt-1 text-xs text-secondary-500">
            Default commission rate is 1.00%. This can be customized per agent.
          </p>
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
          Active Agent
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
          {isLoading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  )
}

export default AgentForm
