import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, Building, Users, DollarSign } from 'lucide-react';
import { ReportService, FinancialSummary } from '../../services/reportService';
import {
  RentCollectionChart,
  PropertyStatusChart,
  PaymentTrendChart,
  OccupancyRateChart,
  RevenueBreakdownChart
} from '../charts/ReportCharts';

const AnalyticsDashboard: React.FC = () => {
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpected: 0,
    collectionRate: 0,
    outstandingAmount: 0,
    totalProperties: 0,
    occupiedProperties: 0,
    vacantProperties: 0,
    occupancyRate: 0
  });

  const [rentCollectionData, setRentCollectionData] = useState<any[]>([]);
  const [propertyStatusData, setPropertyStatusData] = useState<any[]>([]);
  const [paymentTrendData, setPaymentTrendData] = useState<any[]>([]);
  const [occupancyRateData, setOccupancyRateData] = useState<any[]>([]);
  const [revenueBreakdownData, setRevenueBreakdownData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data concurrently
      const [
        summary,
        rentCollection,
        propertyStatus,
        paymentTrend,
        occupancyRate,
        revenueBreakdown
      ] = await Promise.all([
        ReportService.getFinancialSummary(),
        ReportService.getRentCollectionChartData(6),
        ReportService.getPropertyStatusChartData(),
        ReportService.getPaymentTrendData(12),
        ReportService.getOccupancyRateData(12),
        ReportService.getRevenueBreakdownData()
      ]);

      setFinancialSummary(summary);
      setRentCollectionData(rentCollection);
      setPropertyStatusData(propertyStatus);
      setPaymentTrendData(paymentTrend);
      setOccupancyRateData(occupancyRate);
      setRevenueBreakdownData(revenueBreakdown);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h2>
        <p className="text-sm text-secondary-600">
          Comprehensive overview of your property management performance
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${financialSummary.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-500 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Collection Rate</p>
              <p className="text-2xl font-bold text-secondary-900">
                {financialSummary.collectionRate.toFixed(1)}%
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-500">+2.3%</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${
              financialSummary.collectionRate >= 90 ? 'bg-green-100' : 
              financialSummary.collectionRate >= 70 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={`w-6 h-6 ${
                financialSummary.collectionRate >= 90 ? 'text-green-600' : 
                financialSummary.collectionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-secondary-900">
                {financialSummary.occupancyRate.toFixed(1)}%
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                {financialSummary.occupiedProperties} of {financialSummary.totalProperties} units
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                ${financialSummary.outstandingAmount.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                <span className="text-xs text-red-500">Needs attention</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RentCollectionChart 
          data={rentCollectionData}
          title="6-Month Rent Collection Trend"
        />
        <PropertyStatusChart 
          data={propertyStatusData}
          title="Property Occupancy Status"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentTrendChart 
          data={paymentTrendData}
          title="12-Month Payment Trends"
        />
        <OccupancyRateChart 
          data={occupancyRateData}
          title="12-Month Occupancy Rate"
        />
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueBreakdownChart 
            data={revenueBreakdownData}
            title="Revenue Breakdown"
          />
        </div>
        
        {/* Quick Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Insights</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-secondary-800">Performance Status</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Collection Rate</span>
                  <span className={`font-medium ${
                    financialSummary.collectionRate >= 90 ? 'text-green-600' : 
                    financialSummary.collectionRate >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {financialSummary.collectionRate >= 90 ? 'Excellent' : 
                     financialSummary.collectionRate >= 70 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Occupancy Rate</span>
                  <span className={`font-medium ${
                    financialSummary.occupancyRate >= 95 ? 'text-green-600' : 
                    financialSummary.occupancyRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {financialSummary.occupancyRate >= 95 ? 'Excellent' : 
                     financialSummary.occupancyRate >= 85 ? 'Good' : 'Low'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-800">Key Metrics</h4>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Properties</span>
                  <span className="font-medium">{financialSummary.totalProperties}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vacant Units</span>
                  <span className="font-medium text-orange-600">{financialSummary.vacantProperties}</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Efficiency</span>
                  <span className="font-medium">
                    ${(financialSummary.totalRevenue / financialSummary.totalProperties || 0).toLocaleString()}/unit
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-800">Recommendations</h4>
              <div className="mt-2 text-sm text-secondary-600">
                {financialSummary.collectionRate < 85 && (
                  <p className="mb-2">• Focus on improving rent collection processes</p>
                )}
                {financialSummary.occupancyRate < 90 && (
                  <p className="mb-2">• Consider marketing strategies to reduce vacancy</p>
                )}
                {financialSummary.outstandingAmount > 10000 && (
                  <p className="mb-2">• Review payment reminder procedures</p>
                )}
                {financialSummary.collectionRate >= 90 && financialSummary.occupancyRate >= 90 && (
                  <p className="text-green-600">• Excellent performance! Keep up the good work.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
