import React from 'react'

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Reports</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Generate and view financial reports
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Rent Collection Report
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Monthly rent collection summary
          </p>
          <button className="btn-secondary">Generate Report</button>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Agent Earnings Report
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Commission tracking for agents
          </p>
          <button className="btn-secondary">Generate Report</button>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Defaulters Report
          </h3>
          <p className="text-sm text-secondary-600 mb-4">
            Tenants with outstanding balances
          </p>
          <button className="btn-secondary">Generate Report</button>
        </div>
      </div>
    </div>
  )
}

export default Reports