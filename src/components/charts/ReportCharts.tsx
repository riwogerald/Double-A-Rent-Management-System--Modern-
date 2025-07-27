import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ChartProps {
  data: any[];
  title?: string;
  className?: string;
}

export const RentCollectionChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
          <Legend />
          <Bar dataKey="expected" fill="#8884d8" name="Expected" />
          <Bar dataKey="collected" fill="#82ca9d" name="Collected" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PropertyStatusChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AgentPerformanceChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="agent" type="category" width={80} />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Commission']} />
          <Bar dataKey="commission" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PaymentTrendChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
          <Legend />
          <Line type="monotone" dataKey="payments" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="arrears" stroke="#ff7300" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const OccupancyRateChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, 'Occupancy Rate']} />
          <Area type="monotone" dataKey="occupancy" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueBreakdownChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="amount"
            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : 0}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const MaintenanceRequestsChart: React.FC<ChartProps> = ({ data, title, className }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" stackId="a" fill="#ff7300" name="Pending" />
          <Bar dataKey="inProgress" stackId="a" fill="#ffc658" name="In Progress" />
          <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
