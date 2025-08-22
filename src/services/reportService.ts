import api from '../lib/api';
import { format, startOfMonth, endOfMonth, subMonths, parseISO, differenceInDays } from 'date-fns';

export interface RentCollectionData {
  tenant: string;
  property: string;
  rentAmount: number;
  amountPaid: number;
  status: 'Paid' | 'Partial' | 'Overdue';
  paymentDate: string;
  dueDate: string;
}

export interface AgentEarningsData {
  agent: string;
  properties: number;
  totalRentCollected: number;
  commissionRate: number;
  commissionEarned: number;
}

export interface DefaulterData {
  tenant: string;
  property: string;
  rentAmount: number;
  lastPayment: string;
  outstandingAmount: number;
  daysOverdue: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpected: number;
  collectionRate: number;
  outstandingAmount: number;
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  occupancyRate: number;
}

export class ReportService {
  // Rent Collection Reports
  static async getRentCollectionData(startDate?: Date, endDate?: Date): Promise<RentCollectionData[]> {
    try {
      const start = startDate || startOfMonth(new Date());
      const end = endDate || endOfMonth(new Date());
      
      const response = await api.get('/reports/rent-collection', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      });

      return response.data.map((item: any) => ({
        tenant: `${item.tenant_first_name} ${item.tenant_last_name}`,
        property: item.property_address,
        rentAmount: parseFloat(item.rent_amount) || 0,
        amountPaid: parseFloat(item.amount_paid) || 0,
        status: this.getPaymentStatus(item.amount_paid, item.rent_amount, item.due_date),
        paymentDate: item.payment_date ? format(parseISO(item.payment_date), 'yyyy-MM-dd') : 'Not paid',
        dueDate: format(parseISO(item.due_date), 'yyyy-MM-dd')
      }));
    } catch (error) {
      console.error('Error fetching rent collection data:', error);
      return [];
    }
  }

  // Agent Earnings Reports
  static async getAgentEarningsData(startDate?: Date, endDate?: Date): Promise<AgentEarningsData[]> {
    try {
      const start = startDate || startOfMonth(new Date());
      const end = endDate || endOfMonth(new Date());

      const response = await api.get('/reports/agent-earnings', {
        params: {
          startDate: format(start, 'yyyy-MM-dd'),
          endDate: format(end, 'yyyy-MM-dd')
        }
      });

      return response.data.map((item: any) => ({
        agent: `${item.agent_first_name} ${item.agent_last_name}`,
        properties: parseInt(item.property_count) || 0,
        totalRentCollected: parseFloat(item.total_rent_collected) || 0,
        commissionRate: parseFloat(item.commission_rate) || 0,
        commissionEarned: parseFloat(item.commission_earned) || 0
      }));
    } catch (error) {
      console.error('Error fetching agent earnings data:', error);
      return [];
    }
  }

  // Defaulters Report
  static async getDefaultersData(): Promise<DefaulterData[]> {
    try {
      const response = await api.get('/reports/defaulters');

      return response.data.map((item: any) => ({
        tenant: `${item.tenant_first_name} ${item.tenant_last_name}`,
        property: item.property_address,
        rentAmount: parseFloat(item.rent_amount) || 0,
        lastPayment: item.last_payment_date ? format(parseISO(item.last_payment_date), 'yyyy-MM-dd') : 'Never',
        outstandingAmount: parseFloat(item.outstanding_amount) || 0,
        daysOverdue: this.calculateDaysOverdue(item.due_date)
      }));
    } catch (error) {
      console.error('Error fetching defaulters data:', error);
      return [];
    }
  }

  // Financial Summary
  static async getFinancialSummary(month?: Date): Promise<FinancialSummary> {
    try {
      const targetMonth = month || new Date();
      const response = await api.get('/reports/financial-summary', {
        params: {
          month: format(targetMonth, 'yyyy-MM')
        }
      });

      const data = response.data;
      return {
        totalRevenue: parseFloat(data.total_revenue) || 0,
        totalExpected: parseFloat(data.total_expected) || 0,
        collectionRate: parseFloat(data.collection_rate) || 0,
        outstandingAmount: parseFloat(data.outstanding_amount) || 0,
        totalProperties: parseInt(data.total_properties) || 0,
        occupiedProperties: parseInt(data.occupied_properties) || 0,
        vacantProperties: parseInt(data.vacant_properties) || 0,
        occupancyRate: parseFloat(data.occupancy_rate) || 0
      };
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      return {
        totalRevenue: 0,
        totalExpected: 0,
        collectionRate: 0,
        outstandingAmount: 0,
        totalProperties: 0,
        occupiedProperties: 0,
        vacantProperties: 0,
        occupancyRate: 0
      };
    }
  }

  // Chart Data Generators
  static async getRentCollectionChartData(months = 6): Promise<any[]> {
    try {
      const data: any[] = [];
      for (let i = months - 1; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const rentData = await this.getRentCollectionData(startOfMonth(month), endOfMonth(month));
        
        const expected = rentData.reduce((sum, item) => sum + item.rentAmount, 0);
        const collected = rentData.reduce((sum, item) => sum + item.amountPaid, 0);
        
        data.push({
          month: format(month, 'MMM yyyy'),
          expected,
          collected
        });
      }
      return data;
    } catch (error) {
      console.error('Error generating rent collection chart data:', error);
      return [];
    }
  }

  static async getPropertyStatusChartData(): Promise<any[]> {
    try {
      const summary = await this.getFinancialSummary();
      return [
        { name: 'Occupied', value: summary.occupiedProperties },
        { name: 'Vacant', value: summary.vacantProperties }
      ];
    } catch (error) {
      console.error('Error generating property status chart data:', error);
      return [];
    }
  }

  static async getAgentPerformanceChartData(): Promise<any[]> {
    try {
      const agentData = await this.getAgentEarningsData();
      return agentData
        .sort((a, b) => b.commissionEarned - a.commissionEarned)
        .slice(0, 10)
        .map(agent => ({
          agent: agent.agent.split(' ')[0], // First name only for chart
          commission: agent.commissionEarned
        }));
    } catch (error) {
      console.error('Error generating agent performance chart data:', error);
      return [];
    }
  }

  static async getPaymentTrendData(months = 12): Promise<any[]> {
    try {
      const data: any[] = [];
      for (let i = months - 1; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const rentData = await this.getRentCollectionData(startOfMonth(month), endOfMonth(month));
        
        const payments = rentData.reduce((sum, item) => sum + item.amountPaid, 0);
        const arrears = rentData.reduce((sum, item) => sum + Math.max(0, item.rentAmount - item.amountPaid), 0);
        
        data.push({
          date: format(month, 'MMM yy'),
          payments,
          arrears
        });
      }
      return data;
    } catch (error) {
      console.error('Error generating payment trend data:', error);
      return [];
    }
  }

  static async getOccupancyRateData(months = 12): Promise<any[]> {
    try {
      const data: any[] = [];
      for (let i = months - 1; i >= 0; i--) {
        const month = subMonths(new Date(), i);
        const summary = await this.getFinancialSummary(month);
        
        data.push({
          month: format(month, 'MMM yy'),
          occupancy: summary.occupancyRate
        });
      }
      return data;
    } catch (error) {
      console.error('Error generating occupancy rate data:', error);
      return [];
    }
  }

  static async getRevenueBreakdownData(): Promise<any[]> {
    try {
      const response = await api.get('/reports/revenue-breakdown');
      return response.data.map((item: any) => ({
        name: item.category,
        amount: parseFloat(item.amount) || 0
      }));
    } catch (error) {
      console.error('Error generating revenue breakdown data:', error);
      return [
        { name: 'Rent', amount: 0 },
        { name: 'Late Fees', amount: 0 },
        { name: 'Other Income', amount: 0 }
      ];
    }
  }

  // Helper Methods
  private static getPaymentStatus(amountPaid: number, rentAmount: number, dueDate: string): 'Paid' | 'Partial' | 'Overdue' {
    const paid = parseFloat(String(amountPaid)) || 0;
    const rent = parseFloat(String(rentAmount)) || 0;
    const due = parseISO(dueDate);
    const today = new Date();

    if (paid >= rent) return 'Paid';
    if (paid > 0) return 'Partial';
    if (today > due) return 'Overdue';
    return 'Overdue';
  }

  private static calculateDaysOverdue(dueDate: string): number {
    const due = parseISO(dueDate);
    const today = new Date();
    const days = differenceInDays(today, due);
    return Math.max(0, days);
  }

  // Export Methods
  static async exportRentCollectionReport(data: RentCollectionData[]): Promise<void> {
    try {
      const { generateRentCollectionReport } = await import('../utils/pdfGenerator');
      await generateRentCollectionReport(data);
    } catch (error) {
      console.error('Error exporting rent collection report:', error);
      throw new Error('Failed to export rent collection report');
    }
  }

  static async exportAgentEarningsReport(data: AgentEarningsData[]): Promise<void> {
    try {
      const { generateAgentEarningsReport } = await import('../utils/pdfGenerator');
      await generateAgentEarningsReport(data);
    } catch (error) {
      console.error('Error exporting agent earnings report:', error);
      throw new Error('Failed to export agent earnings report');
    }
  }

  static async exportDefaultersReport(data: DefaulterData[]): Promise<void> {
    try {
      const { generateDefaultersReport } = await import('../utils/pdfGenerator');
      await generateDefaultersReport(data);
    } catch (error) {
      console.error('Error exporting defaulters report:', error);
      throw new Error('Failed to export defaulters report');
    }
  }

  static async exportPropertyReport(data: any[]): Promise<void> {
    try {
      const { generatePropertyReport } = await import('../utils/pdfGenerator');
      await generatePropertyReport(data);
    } catch (error) {
      console.error('Error exporting property report:', error);
      throw new Error('Failed to export property report');
    }
  }
}
