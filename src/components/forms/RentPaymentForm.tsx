import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { tenantsAPI, formatCurrency } from '../../lib/api'

interface RentPaymentFormProps {
  payment?: any
  onSubmit: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}

const RentPaymentForm: React.FC<RentPaymentFormProps> = ({
  payment,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    tenant_id: '',
    property_id: '',
    amount_paid: '',
    rent_month: '',
    payment_method: 'Cash',
    penalty_amount: '0',
    balance_before: '0',
    receipt_number: '',
    notes: ''
  })

  const [selectedTenant, setSelectedTenant] = useState<any>(null)

  // Fetch active tenants
  const { data: tenants = [] } = useQuery({
    queryKey: ['tenants-active'],
    queryFn: tenantsAPI.getActive,
  })

  useEffect(() => {
    if (payment) {
      setFormData({
        tenant_id: payment.tenant_id || '',
        property_id: payment.property_id || '',
        amount_paid: payment.amount_paid || '',
        rent_month: payment.rent_month ? payment.rent_month.split('T')[0] : '',
        payment_method: payment.payment_method || 'Cash',
        penalty_amount: payment.penalty_amount || '0',
        balance_before: payment.balance_before || '0',
        receipt_number: payment.receipt_number || '',
        notes: payment.notes || ''
      })
    }
  }, [payment])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tenantId = e.target.value
    const tenant = tenants.find((t: any) => t.id.toString() === tenantId)
    
    setSelectedTenant(tenant)
    setFormData(prev => ({
      ...prev,
      tenant_id: tenantId,
      property_id: tenant?.property_id || '',
      balance_before: tenant?.rent_amount || '0'
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const balanceBefore = parseFloat(formData.balance_before) || 0
    const amountPaid = parseFloat(formData.amount_paid) || 0
    const penaltyAmount = parseFloat(formData.penalty_amount) || 0
    
    onSubmit({
      ...formData,
      tenant_id: formData.tenant_id || null,
      property_id: formData.property_id || null,
      amount_paid: amountPaid,
      penalty_amount: penaltyAmount,
      balance_before: balanceBefore,
      balance_after: Math.max(0, balanceBefore + penaltyAmount - amountPaid),
      rent_month: formData.rent_month || null,
    })
  }

  const paymentMethods = [
    'Cash',
    'Bank Transfer',
    'Mobile Money',
    'Cheque'
  ]


  const balanceAfter = Math.max(0, 
    (parseFloat(formData.balance_before) || 0) + 
    (parseFloat(formData.penalty_amount) || 0) - 
    (parseFloat(formData.amount_paid) || 0)
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tenant Selection */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Tenant <span className="text-error-500">*</span>
          </label>
          <select
            name="tenant_id"
            value={formData.tenant_id}
            onChange={handleTenantChange}
            required
            className="input"
          >
            <option value="">Select Tenant</option>
            {tenants.map((tenant: any) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name} - {tenant.property_details} ({formatCurrency(tenant.rent_amount || 0)}/month)
              </option>
            ))}
          </select>
          {selectedTenant && (
            <div className="mt-2 p-3 bg-primary-50 rounded-md">
              <p className="text-sm text-primary-700">
                <strong>Property:</strong> {selectedTenant.property_details}
              </p>
              <p className="text-sm text-primary-700">
                <strong>Monthly Rent:</strong> {formatCurrency(selectedTenant.rent_amount || 0)}
              </p>
            </div>
          )}
        </div>

        {/* Rent Month */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Rent Month <span className="text-error-500">*</span>
          </label>
          <input
            type="date"
            name="rent_month"
            value={formData.rent_month}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Payment Method <span className="text-error-500">*</span>
          </label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
            className="input"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Balance Before */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Outstanding Balance (KSh)
          </label>
          <input
            type="number"
            name="balance_before"
            value={formData.balance_before}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="0"
          />
        </div>

        {/* Penalty Amount */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Penalty Amount (KSh)
          </label>
          <input
            type="number"
            name="penalty_amount"
            value={formData.penalty_amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="input"
            placeholder="0"
          />
          <p className="mt-1 text-xs text-secondary-500">
            0.5% daily penalty rate applied for late payments
          </p>
        </div>

        {/* Amount Paid */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Amount Paid (KSh) <span className="text-error-500">*</span>
          </label>
          <input
            type="number"
            name="amount_paid"
            value={formData.amount_paid}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="input"
            placeholder="25000"
          />
        </div>

        {/* Receipt Number */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Receipt Number
          </label>
          <input
            type="text"
            name="receipt_number"
            value={formData.receipt_number}
            onChange={handleChange}
            className="input"
            placeholder="RCP001"
          />
        </div>
      </div>

      {/* Balance Calculation */}
      <div className="p-4 bg-secondary-50 rounded-lg">
        <h4 className="text-sm font-medium text-secondary-900 mb-2">Payment Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-secondary-600">Outstanding Balance:</span>
            <span className="float-right font-medium">{formatCurrency(parseFloat(formData.balance_before) || 0)}</span>
          </div>
          <div>
            <span className="text-secondary-600">Penalty:</span>
            <span className="float-right font-medium text-error-600">+{formatCurrency(parseFloat(formData.penalty_amount) || 0)}</span>
          </div>
          <div>
            <span className="text-secondary-600">Amount Paid:</span>
            <span className="float-right font-medium text-success-600">-{formatCurrency(parseFloat(formData.amount_paid) || 0)}</span>
          </div>
          <div className="pt-2 border-t border-secondary-200">
            <span className="text-secondary-900 font-medium">Remaining Balance:</span>
            <span className={`float-right font-bold ${balanceAfter > 0 ? 'text-error-600' : 'text-success-600'}`}>
              {formatCurrency(balanceAfter)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="input"
          placeholder="Additional notes about this payment..."
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
          {isLoading ? 'Recording...' : payment ? 'Update Payment' : 'Record Payment'}
        </button>
      </div>
    </form>
  )
}

export default RentPaymentForm
