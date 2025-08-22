import React, { useState, useEffect } from 'react';
import { Download, AlertCircle, TrendingDown, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ReportService, DefaulterData } from '../../services/reportService';
import DataTable from '../DataTable';

const DefaultersReport: React.FC = () => {
  const [data, setData] = useState<DefaulterData[]>([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: 'tenant', label: 'Tenant' },
    { key: 'property', label: 'Property' },
    { 
      key: 'rentAmount', 
      label: 'Rent Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'lastPayment', label: 'Last Payment' },
    { 
      key: 'outstandingAmount', 
      label: 'Outstanding Amount',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    { key: 'daysOverdue', label: 'Days Overdue' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const reportData = await ReportService.getDefaultersData();
      setData(reportData);
    } catch (error) {
      console.error('Error loading defaulters data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const { generateDefaultersReport } = await import('../../utils/pdfGenerator');
      await generateDefaultersReport(
        data.map(item => ({
          tenant: item.tenant,
          property: item.property,
          rentAmount: item.rentAmount,
          lastPayment: item.lastPayment,
          outstandingAmount: item.outstandingAmount,
          daysOverdue: item.daysOverdue
        }))
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const totalOutstanding = data.reduce((sum, item) => sum + item.outstandingAmount, 0);
  const totalDefaulters = data.length;
  const avgOutstanding = totalDefaulters > 0 ? totalOutstanding / totalDefaulters : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Defaulters Report</h2>
          <p className="text-sm text-secondary-600">
            Identify tenants with overdue rent payments
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="btn-primary flex items-center gap-2"
          disabled={loading || data.length === 0}
        >
          <FileText className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Defaulters</p>
              <p className="text-2xl font-bold text-red-600">{totalDefaulters}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-secondary-900">
                ${totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Avg Outstanding</p>
              <p className="text-2xl font-bold text-secondary-900">
                ${avgOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-secondary-900">Defaulters List</h3>
          <p className="text-sm text-secondary-600">
            Detailed breakdown of tenants with outstanding payments
          </p>
        </div>
        
        <DataTable
          data={data}
          columns={columns}
          loading={loading}
          emptyMessage="No defaulters data found."
        />
      </div>
    </div>
  );
};

export default DefaultersReport;
