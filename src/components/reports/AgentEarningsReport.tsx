import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Download, Filter, Users, DollarSign, TrendingUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ReportService, AgentEarningsData } from '../../services/reportService';
import { AgentPerformanceChart } from '../charts/ReportCharts';
import DataTable from '../DataTable';

const AgentEarningsReport: React.FC = () => {
  const [data, setData] = useState<AgentEarningsData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const chartRef = useRef<HTMLDivElement>(null);

  const columns = [
    { key: 'agent', label: 'Agent' },
    { 
      key: 'properties', 
      label: 'Properties',
      render: (value: number) => value.toString()
    },
    { 
      key: 'totalRentCollected', 
      label: 'Rent Collected',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'commissionRate', 
      label: 'Commission Rate',
      render: (value: number) => `${value}%`
    },
    { 
      key: 'commissionEarned', 
      label: 'Commission Earned',
      render: (value: number) => `$${value.toLocaleString()}`
    }
  ];

  useEffect(() => {
    loadData();
    loadChartData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const reportData = await ReportService.getAgentEarningsData(start, end);
      setData(reportData);
    } catch (error) {
      console.error('Error loading agent earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const chartData = await ReportService.getAgentPerformanceChartData();
      setChartData(chartData);
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  };

  const handleFilterChange = () => {
    loadData();
  };

  const handleExportPDF = async () => {
    try {
      await ReportService.exportAgentEarningsReport(data);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const getSummaryStats = () => {
    const totalAgents = data.length;
    const totalCommissions = data.reduce((sum, item) => sum + item.commissionEarned, 0);
    const totalRentCollected = data.reduce((sum, item) => sum + item.totalRentCollected, 0);
    const averageCommission = totalAgents > 0 ? totalCommissions / totalAgents : 0;
    const totalProperties = data.reduce((sum, item) => sum + item.properties, 0);
    
    return {
      totalAgents,
      totalCommissions,
      totalRentCollected,
      averageCommission,
      totalProperties
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Agent Earnings Report</h2>
          <p className="text-sm text-secondary-600">
            Track agent performance and commission earnings
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="btn-primary flex items-center gap-2"
          disabled={loading || data.length === 0}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 input"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-4 h-4" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 input"
              />
            </div>
          </div>
          <button
            onClick={handleFilterChange}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Apply Filter
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Agents</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalAgents}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Properties</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalProperties}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Rent Collected</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalRentCollected.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Commissions</p>
              <p className="text-2xl font-bold text-purple-600">
                ${stats.totalCommissions.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg Commission</p>
              <p className="text-2xl font-bold text-secondary-900">
                ${stats.averageCommission.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef}>
        <AgentPerformanceChart 
          data={chartData} 
          title="Top 10 Agent Performance (Commission Earned)"
          className="w-full"
        />
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Agent Earnings Details</h3>
          <p className="text-sm text-secondary-600">
            Detailed breakdown of agent earnings and performance for the selected period
          </p>
        </div>
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="No agent earnings data found for the selected period."
        />
      </div>

      {/* Performance Insights */}
      {data.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Top Performer</h4>
              <p className="text-sm text-blue-700">
                {data.sort((a, b) => b.commissionEarned - a.commissionEarned)[0]?.agent}
              </p>
              <p className="text-lg font-bold text-blue-900">
                ${data.sort((a, b) => b.commissionEarned - a.commissionEarned)[0]?.commissionEarned.toLocaleString()}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Most Properties</h4>
              <p className="text-sm text-green-700">
                {data.sort((a, b) => b.properties - a.properties)[0]?.agent}
              </p>
              <p className="text-lg font-bold text-green-900">
                {data.sort((a, b) => b.properties - a.properties)[0]?.properties} properties
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Highest Collection</h4>
              <p className="text-sm text-purple-700">
                {data.sort((a, b) => b.totalRentCollected - a.totalRentCollected)[0]?.agent}
              </p>
              <p className="text-lg font-bold text-purple-900">
                ${data.sort((a, b) => b.totalRentCollected - a.totalRentCollected)[0]?.totalRentCollected.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentEarningsReport;
