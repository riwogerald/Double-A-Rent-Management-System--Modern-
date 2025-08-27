import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agentsAPI } from '../lib/api'
import DataTable, { Column, Action } from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import Modal from '../components/Modal'
import AgentForm from '../components/forms/AgentForm'
import { Edit, Trash2, Eye, Users, Phone, Mail, Percent } from 'lucide-react'

const Agents: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const queryClient = useQueryClient()

  // Fetch agents
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: agentsAPI.getAll,
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: agentsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      setIsFormOpen(false)
      setEditingAgent(null)
      alert('Agent created successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to create agent')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => agentsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      setIsFormOpen(false)
      setEditingAgent(null)
      alert('Agent updated successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to update agent')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: agentsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
      alert('Agent deleted successfully')
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Failed to delete agent')
    },
  })

  // Define table columns
  const columns: Column[] = [
    {
      key: 'agent_no',
      label: 'Agent #',
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value) => (
        <div className="font-medium text-secondary-900">{value}</div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Phone className="h-3 w-3 mr-1 text-secondary-400" />
          {value}
        </div>
      ) : 'N/A',
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value ? (
        <div className="flex items-center text-sm">
          <Mail className="h-3 w-3 mr-1 text-secondary-400" />
          <span className="truncate max-w-xs">{value}</span>
        </div>
      ) : 'N/A',
    },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      render: (value) => value || 'N/A',
    },
    {
      key: 'commission_rate',
      label: 'Commission',
      sortable: true,
      render: (value) => (
        <div className="flex items-center text-sm font-medium text-success-600">
          <Percent className="h-3 w-3 mr-1" />
          {value || 1.00}%
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <StatusBadge status={value ? 'Active' : 'Inactive'} />
      ),
    },
    {
      key: 'property_count',
      label: 'Properties',
      sortable: true,
      render: (value) => (
        <span className="font-medium text-primary-600">
          {value || 0} properties
        </span>
      ),
    },
  ]

  // Define table actions
  const actions: Action[] = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: (agent) => {
        setSelectedAgent(agent)
        // TODO: Open agent details modal
        console.log('View agent:', agent)
      },
      variant: 'primary',
    },
    {
      icon: Edit,
      label: 'Edit Agent',
      onClick: (agent) => {
        setEditingAgent(agent)
        setIsFormOpen(true)
      },
      variant: 'secondary',
    },
    {
      icon: Trash2,
      label: 'Delete Agent',
      onClick: (agent) => {
        if (window.confirm(`Are you sure you want to delete agent ${agent.name}?`)) {
          deleteMutation.mutate(agent.id)
        }
      },
      variant: 'danger',
    },
  ]

  const handleAddAgent = () => {
    setEditingAgent(null)
    setIsFormOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    if (editingAgent) {
      updateMutation.mutate({ id: editingAgent.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleCancel = () => {
    setIsFormOpen(false)
    setEditingAgent(null)
  }

  const activeAgents = agents.filter(a => a.is_active)
  const totalProperties = agents.reduce((sum, a) => sum + (a.property_count || 0), 0)
  const avgCommissionRate = agents.length > 0 
    ? agents.reduce((sum, a) => sum + (a.commission_rate || 1.00), 0) / agents.length 
    : 1.00

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Agents</h1>
          <p className="mt-1 text-sm text-secondary-600">
            Manage agent information and commissions
          </p>
        </div>
      </div>

      {/* Agents Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Agents</p>
              <p className="text-2xl font-bold text-secondary-900">{agents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-success-50">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Active</p>
              <p className="text-2xl font-bold text-secondary-900">{activeAgents.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-warning-50">
              <Percent className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Avg Commission</p>
              <p className="text-2xl font-bold text-secondary-900">{avgCommissionRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-primary-50">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Managed Properties</p>
              <p className="text-2xl font-bold text-secondary-900">{totalProperties}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Data Table */}
      <DataTable
        data={agents}
        columns={columns}
        actions={actions}
        loading={isLoading}
        searchPlaceholder="Search agents..."
        onAdd={handleAddAgent}
        addButtonText="Add Agent"
        emptyMessage="No agents found. Add your first agent to get started."
      />

      {/* Agent Form Modal */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={handleCancel}
        title={editingAgent ? 'Edit Agent' : 'Add New Agent'}
        size="lg"
      >
        <AgentForm
          agent={editingAgent}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default Agents
