import React, { useState, useEffect } from 'react'

interface LandlordFormProps {
  landlord?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const LandlordForm: React.FC<LandlordFormProps> = ({
  landlord,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gender: '',
    bank_account: '',
    bank_name: '',
    id_number: '',
    address: '',
    is_active: true
  })

  useEffect(() => {
    if (landlord) {
      setFormData({
        name: landlord.name || '',
        phone: landlord.phone || '',
        email: landlord.email || '',
        gender: landlord.gender || '',
        bank_account: landlord.bank_account || '',
        bank_name: landlord.bank_name || '',
        id_number: landlord.id_number || '',
        address: landlord.address || '',
        is_active: landlord.is_active !== undefined ? landlord.is_active : true
      })
    }
  }, [landlord])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const genderOptions = ['Male', 'Female', 'Other']
  
  const kenyanBanks = [
    'KCB Bank',
    'Equity Bank',
    'Cooperative Bank',
    'ABSA Bank Kenya',
    'Standard Chartered Bank',
    'NCBA Bank',
    'DTB Bank',
    'I&M Bank',
    'Family Bank',
    'NIC Bank',
    'Prime Bank',
    'Gulf African Bank',
    'Housing Finance Company',
    'Bank of Baroda',
    'Bank of India',
    'Citibank',
    'Consolidated Bank',
    'Credit Bank',
    'Development Bank of Kenya',
    'Ecobank Kenya',
    'Guardian Bank',
    'Habib Bank AG Zurich',
    'Jamii Bora Bank',
    'M-Shwari',
    'Mayfair Bank',
    'Middle East Bank Kenya',
    'National Bank of Kenya',
    'Paramount Universal Bank',
    'SBM Bank Kenya',
    'Sidian Bank',
    'Spire Bank',
    'Stanbic Bank',
    'Trans National Bank',
    'UBA Kenya Bank',
    'Victoria Commercial Bank'
  ]

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

        {/* Bank Name */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Bank Name
          </label>
          <select
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Bank</option>
            {kenyanBanks.map(bank => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Bank Account */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Bank Account Number
          </label>
          <input
            type="text"
            name="bank_account"
            value={formData.bank_account}
            onChange={handleChange}
            className="input"
            placeholder="1234567890"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="P.O. Box 123, Nairobi, Kenya"
        />
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
          Active Landlord
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
          {isLoading ? 'Saving...' : landlord ? 'Update Landlord' : 'Create Landlord'}
        </button>
      </div>
    </form>
  )
}

export default LandlordForm
