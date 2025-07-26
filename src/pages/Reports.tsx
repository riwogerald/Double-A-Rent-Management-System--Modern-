import React, { useState } from 'react';
import { BarChart3, FileText, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import AnalyticsDashboard from '../components/reports/AnalyticsDashboard';
import RentCollectionReport from '../components/reports/RentCollectionReport';
import AgentEarningsReport from '../components/reports/AgentEarningsReport';
import DefaultersReport from '../components/reports/DefaultersReport';

type ReportTab = 'analytics' | 'rent-collection' | 'agent-earnings' | 'defaulters';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportTab>('analytics');

  const tabs = [
    {
      id: 'analytics' as ReportTab,
      name: 'Analytics Dashboard',
      icon: BarChart3,
      description: 'Comprehensive performance overview'
    },
    {
      id: 'rent-collection' as ReportTab,
      name: 'Rent Collection',
      icon: FileText,
      description: 'Monthly rent collection summary'
    },
    {
      id: 'agent-earnings' as ReportTab,
      name: 'Agent Earnings',
      icon: Users,
      description: 'Commission tracking for agents'
    },
    {
      id: 'defaulters' as ReportTab,
      name: 'Defaulters',
      icon: AlertTriangle,
      description: 'Tenants with outstanding balances'
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'rent-collection':
        return <RentCollectionReport />;
      case 'agent-earnings':
        return <AgentEarningsReport />;
      case 'defaulters':
        return <DefaultersReport />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Comprehensive reporting and analytics for your property management business
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <Icon className={`mr-2 h-5 w-5 ${
                  activeTab === tab.id ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                }`} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Reports;
