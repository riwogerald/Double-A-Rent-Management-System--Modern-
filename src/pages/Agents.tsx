import React from 'react'

const Agents: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Agents</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage real estate agents and commissions
          </p>
        </div>
        <button className="btn-primary">
          Add Agent
        </button>
      </div>

      <div className="card">
        <p className="text-secondary-600">Agent management coming in Phase 2...</p>
      </div>
    </div>
  )
}

export default Agents