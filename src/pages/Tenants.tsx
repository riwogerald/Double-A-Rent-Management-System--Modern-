import React from 'react'

const Tenants: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tenants</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage tenant information and leases
          </p>
        </div>
        <button className="btn-primary">
          Add Tenant
        </button>
      </div>

      <div className="card">
        <p className="text-secondary-600">Tenant management coming in Phase 2...</p>
      </div>
    </div>
  )
}

export default Tenants