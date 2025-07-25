import React, { useState } from 'react'
import { Search, Plus } from 'lucide-react'

export interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export interface Action {
  icon: React.ComponentType<any>
  label: string
  onClick: (row: any) => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  actions?: Action[]
  searchable?: boolean
  searchPlaceholder?: string
  onAdd?: () => void
  addButtonText?: string
  loading?: boolean
  emptyMessage?: string
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  actions = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  onAdd,
  addButtonText = 'Add New',
  loading = false,
  emptyMessage = 'No data available'
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Filter data based on search term
  const filteredData = data.filter(row =>
    columns.some(column => {
      const value = row[column.key]
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    })
  )

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key)
    if (!column?.sortable) return

    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return {
          key,
          direction: prevConfig.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const getActionButtonClass = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'text-primary-600 hover:text-primary-900 hover:bg-primary-50'
      case 'danger':
        return 'text-error-600 hover:text-error-900 hover:bg-error-50'
      default:
        return 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {searchable && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        )}

        {onAdd && (
          <button onClick={onAdd} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            {addButtonText}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-secondary-100' : ''
                  }`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="text-primary-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="px-6 py-12 text-center text-secondary-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-secondary-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            className={`p-2 rounded-md transition-colors ${getActionButtonClass(action.variant)}`}
                            title={action.label}
                          >
                            <action.icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
