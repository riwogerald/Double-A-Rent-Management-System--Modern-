import React, { useState } from 'react'
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react'

const TestDataGenerator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [accounts, setAccounts] = useState<string[]>([])

  const generateMockData = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('http://localhost:5000/api/generate-mock-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setAccounts(data.accounts || [])
      } else {
        setError(data.error || 'Failed to generate mock data')
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center mb-6">
          <div className="bg-primary-50 p-3 rounded-xl">
            <Database className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-secondary-900 ml-3">
            Generate Test Data
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-secondary-600 text-sm leading-relaxed">
            This will create comprehensive mock data including users, properties, tenants, 
            landlords, agents, and rent payment records for testing purposes.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-xl flex items-center">
            <AlertCircle className="h-5 w-5 text-error-600 mr-2" />
            <span className="text-sm text-error-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-success-50 border border-success-200 rounded-xl">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
              <span className="text-sm font-medium text-success-700">
                Mock data generated successfully!
              </span>
            </div>
            <div className="mt-3">
              <p className="text-xs text-success-600 font-medium mb-2">Test Accounts:</p>
              <div className="space-y-1">
                {accounts.map((account, index) => (
                  <div key={index} className="text-xs text-success-700 bg-success-100 px-2 py-1 rounded font-mono">
                    {account}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            onClick={generateMockData}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Generate Data
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 font-medium rounded-xl transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestDataGenerator
