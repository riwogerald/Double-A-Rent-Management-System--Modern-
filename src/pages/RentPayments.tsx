import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rentPaymentsAPI, formatCurrency, formatDate } from '../lib/api'
import DataTable, { Column, Action } from '../components/DataTable'
import { Edit, Trash2, Eye, CreditCard, Calendar, AlertTriangle, Receipt } from 'lucide-react'

const RentPayments: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const queryClient = useQueryClient()

  // Fetch rent payments
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['rent-payments'],
    queryFn: rentPaymentsAPI.getAll,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: rentPaymentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] })
      alert('Payment deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to delete payment')
    },
  })

  // Define table columns
  const columns: Column[] = [
    {
      key: 'payment_no',
      label: 'Payment #',
      sortable: true,
    },
    {
      key: 'tenant_name',
      label: 'Tenant',
      sortable: true,
      render: (value, row) => {
        if (value) {
          return (
            <div>
              <div className="font-medium text-secondary-900">{value}</div>
              <div className="text-xs text-secondary-500">
                {row.property_details || 'Property not assigned'}
              </div>
            </div>
          )
        }
        return <span className="text-secondary-400">No tenant</span>
      },
    },
    {
      key: 'rent_month',
      label: 'Rent Month',
      sortable: true,
      render: (value) => {
        if (value) {
          const date = new Date(value)
          return (
            <div className="flex items-center text-sm">
              <Calendar className="h-3 w-3 mr-1 text-secondary-400" />
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          )
        }
        return 'N/A'
      },
    },
    {
      key: 'amount_paid',
      label: 'Amount Paid',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-success-600">
          {formatCurrency(value || 0)}
        </span>
      ),
    },
    {
      key: 'penalty_amount',
      label: 'Penalty',
      sortable: true,
      render: (value) => {
        if (value && value > 0) {
          return (
            <div className="flex items-center text-sm font-medium text-error-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {formatCurrency(value)}
            </div>
          )
        }
        return <span className="text-secondary-400">No penalty</span>
      },
    },
    {
      key: 'payment_date',
      label: 'Payment Date',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Calendar className="h-3 w-3 mr-1 text-secondary-400" />
          {formatDate(value)}
        </div>
      ) : 'N/A',
    },
    {
      key: 'payment_method',
      label: 'Method',
      sortable: true,
      render: (value) => {
        const getMethodIcon = (method: string) => {
          switch (method?.toLowerCase()) {
            case 'cash':
              return '💵'
            case 'bank transfer':
              return '🏦'
            case 'mobile money':
              return '📱'
            case 'cheque':
              return '📝'
            default:
              return '💳'
          }
        }
        
        return (
          <div className="flex items-center text-sm">
            <span className="mr-1">{getMethodIcon(value)}</span>
            {value || 'Cash'}
          </div>
        )
      },
    },
    {
      key: 'balance_after',
      label: 'Balance',
      sortable: true,
      render: (value) => {
        if (value && value > 0) {
          return (
            <span className="font-medium text-error-600">
              {formatCurrency(value)}
            </span>
          )
        }
        return (
          <span className="font-medium text-success-600">
            {formatCurrency(0)}
          </span>
        )
      },
    },
  ]

  // Define table actions
  const actions: Action[] = [
    {
      icon: Receipt,
      label: 'View Receipt',
      onClick: (payment) => {
        // TODO: Open receipt modal or generate PDF
        console.log('View receipt:', payment)
        alert('Receipt generation coming soon!')
      },
      variant: 'primary',
    },
    {
      icon: Eye,
      label: 'View Details',
      onClick: (payment) => {
        setSelectedPayment(payment)
        // TODO: Open payment details modal
        console.log('View payment:', payment)
      },
      variant: 'secondary',
    },
    {
      icon: Edit,
      label: 'Edit Payment',
      onClick: (payment) => {
        // TODO: Open edit form
        console.log('Edit payment:', payment)
      },
      variant: 'secondary',
    },
    {
      icon: Trash2,
      label: 'Delete Payment',
      onClick: (payment) => {
        if (window.confirm(`Are you sure you want to delete payment ${payment.payment_no}?`)) {
          deleteMutation.mutate(payment.id)
        }
      },
      variant: 'danger',
    },
  ]

  const handleRecordPayment = () => {
    // TODO: Open record payment form
    console.log('Record new payment')
    alert('Record Payment form coming soon!')
  }

  // Calculate summary statistics
  const totalPayments = payments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)
  const totalPenalties = payments.reduce((sum, p) => sum + (p.penalty_amount || 0), 0)
  const outstandingBalance = payments.reduce((sum, p) => sum + (p.balance_after || 0), 0)
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthlyPayments = payments.filter(p => 
    p.payment_date && p.payment_date.startsWith(currentMonth)
  )
  const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + (p.amount_paid || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Rent Payments</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Record and track rent payments
          </p>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-success-50">
              <CreditCard className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Payments</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(totalPayments)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">This Month</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(monthlyTotal)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-error-50">
              <AlertTriangle className="h-6 w-6 text-error-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Penalties</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(totalPenalties)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-warning-50">
              <CreditCard className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Outstanding</p>
              <p className="text-lg font-bold text-secondary-900">
                {formatCurrency(outstandingBalance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Recent Payments
          </h3>
          <div className="space-y-3">
            {payments.slice(0, 5).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-b-0">
                <div>
                  <div className="font-medium text-sm">{payment.tenant_name || 'Unknown Tenant'}</div>
                  <div className="text-xs text-secondary-500">
                    {payment.payment_date && formatDate(payment.payment_date)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-success-600">
                    {formatCurrency(payment.amount_paid || 0)}
                  </div>
                  <div className="text-xs text-secondary-500">{payment.payment_method}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button onClick={handleRecordPayment} className="w-full btn-primary text-left">
              Record New Payment
            </button>
            <button className="w-full btn-secondary text-left">
              View Defaulters
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Report
            </button>
            <button className="w-full btn-secondary text-left">
              Export Payments
            </button>
          </div>
        </div>
      </div>

      {/* Payments Data Table */}
      <DataTable
        data={payments}
        columns={columns}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search payments..."
        onAdd={handleRecordPayment}
        addButtonText="Record Payment"
        emptyMessage="No payments found. Record your first payment to get started."
      />
    </div>
  )
}

export default RentPayments
