import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { ReportService, RentCollectionData } from '../../services/reportService';
import { RentCollectionChart } from '../charts/ReportCharts';
import DataTable from '../DataTable';
import StatusBadge from '../StatusBadge';

const RentCollectionReport: React.FC = () => {
  const [data, setData] = useState<RentCollectionData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const chartRef = useRef<HTMLDivElement>(null);

  const columns = [
    { key: 'tenant', label: 'Tenant' },
    { key: 'property', label: 'Property' },
    { 
      key: 'rentAmount', 
      label: 'Rent Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'amountPaid', 
      label: 'Amount Paid',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => (
        <StatusBadge 
          status={value.toLowerCase()} 
          variant={
            value === 'Paid' ? 'success' : 
            value === 'Partial' ? 'warning' : 'error'
          }
        />
      )
    },
    { key: 'paymentDate', label: 'Payment Date' },
    { key: 'dueDate', label: 'Due Date' }
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
      const reportData = await ReportService.getRentCollectionData(start, end);
      setData(reportData);
    } catch (error) {
      console.error('Error loading rent collection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const chartData = await ReportService.getRentCollectionChartData(6);
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
      const { generateRentCollectionReport } = await import('../../utils/pdfGenerator');
      await generateRentCollectionReport(
        data.map(item => ({
          tenant: item.tenant,
          property: item.property,
          rentAmount: item.rentAmount,
          amountPaid: item.amountPaid,
          status: item.status,
          paymentDate: item.paymentDate,
          dueDate: item.dueDate
        })),
        chartRef.current || undefined,
        { start: startDate, end: endDate }
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const getSummaryStats = () => {
    const totalExpected = data.reduce((sum, item) => sum + item.rentAmount, 0);
    const totalCollected = data.reduce((sum, item) => sum + item.amountPaid, 0);
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    
    return {
      totalExpected,
      totalCollected,
      outstanding: totalExpected - totalCollected,
      collectionRate
    };
  };

  const stats = getSummaryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Rent Collection Report</h2>
          <p className="text-sm text-secondary-600">
            Track rent collection performance and payment status
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportPDF}
            className="btn-primary flex items-center gap-2"
            disabled={loading || data.length === 0}
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Expected</p>
              <p className="text-2xl font-bold text-secondary-900">
                ${stats.totalExpected.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">
                ${stats.totalCollected.toLocaleString()}
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
              <p className="text-sm font-medium text-secondary-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                ${stats.outstanding.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Collection Rate</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.collectionRate.toFixed(1)}%
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              stats.collectionRate >= 90 ? 'bg-green-100' : 
              stats.collectionRate >= 70 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                stats.collectionRate >= 90 ? 'text-green-600' : 
                stats.collectionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div ref={chartRef}>
        <RentCollectionChart 
          data={chartData} 
          title="6-Month Rent Collection Trend"
          className="w-full"
        />
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Payment Details</h3>
          <p className="text-sm text-secondary-600">
            Detailed breakdown of rent payments for the selected period
          </p>
        </div>
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="No rent collection data found for the selected period."
        />
      </div>
    </div>
  );
};

export default RentCollectionReport;
