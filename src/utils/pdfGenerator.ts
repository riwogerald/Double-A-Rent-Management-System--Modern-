import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export interface ReportData {
  title: string;
  subtitle?: string;
  data: any[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  summary?: Record<string, any>;
  chartElement?: HTMLElement;
  insights?: string[];
}

export class PDFGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number = 20;
  private currentY: number = 20;

  constructor() {
    this.pdf = new jsPDF();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
  }

  private checkPageBreak(requiredHeight: number): void {
    if (this.currentY + requiredHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addHeader(title: string, subtitle?: string): void {
    // Company logo area (placeholder)
    this.pdf.setFillColor(37, 99, 235); // Primary blue
    this.pdf.rect(this.margin, 10, 30, 15, 'F');
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DA', this.margin + 12, 20);

    // Company info
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Double A Rent Management System', this.margin + 35, 15);
    this.pdf.text(`Generated: ${format(new Date(), 'PPP p')}`, this.margin + 35, 22);

    // Report title
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(37, 99, 235);
    this.pdf.text(title, this.margin, 40);

    if (subtitle) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(subtitle, this.margin, 50);
      this.currentY = 60;
    } else {
      this.currentY = 50;
    }

    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  private addSummaryCards(summary: Record<string, any>): void {
    this.checkPageBreak(40);
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Executive Summary', this.margin, this.currentY);
    this.currentY += 15;

    const entries = Object.entries(summary);
    const cardWidth = (this.pageWidth - 2 * this.margin - 10) / 2;
    const cardHeight = 25;

    entries.forEach((entry, index) => {
      const [key, value] = entry;
      const col = index % 2;
      const row = Math.floor(index / 2);
      
      if (col === 0) {
        this.checkPageBreak(cardHeight + 5);
      }

      const x = this.margin + col * (cardWidth + 10);
      const y = this.currentY + row * (cardHeight + 5);

      // Card background
      this.pdf.setFillColor(248, 250, 252);
      this.pdf.setDrawColor(226, 232, 240);
      this.pdf.rect(x, y, cardWidth, cardHeight, 'FD');

      // Card content
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(100, 116, 139);
      this.pdf.text(key, x + 5, y + 8);

      this.pdf.setFontSize(16);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text(String(value), x + 5, y + 18);

      if (col === 1 || index === entries.length - 1) {
        this.currentY = y + cardHeight + 10;
      }
    });
  }

  private addTable(data: any[], columns: { key: string; label: string; format?: (value: any) => string }[]): void {
    if (data.length === 0) return;

    this.checkPageBreak(50);

    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidth = tableWidth / columns.length;
    const rowHeight = 8;

    // Table header
    this.pdf.setFillColor(37, 99, 235);
    this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(255, 255, 255);
    
    columns.forEach((col, index) => {
      const x = this.margin + (index * colWidth) + 3;
      this.pdf.text(col.label, x, this.currentY + 5);
    });

    this.currentY += rowHeight;

    // Table rows
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    
    data.forEach((row, rowIndex) => {
      this.checkPageBreak(rowHeight);

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        this.pdf.setFillColor(248, 250, 252);
        this.pdf.rect(this.margin, this.currentY, tableWidth, rowHeight, 'F');
      }

      columns.forEach((col, colIndex) => {
        const x = this.margin + (colIndex * colWidth) + 3;
        let value = row[col.key] || '';
        
        if (col.format && value) {
          value = col.format(value);
        }

        // Truncate long text
        const maxWidth = colWidth - 6;
        const text = this.pdf.splitTextToSize(String(value), maxWidth);
        this.pdf.text(text[0] || '', x, this.currentY + 5);
      });

      this.currentY += rowHeight;
    });

    this.currentY += 5;
  }

  async addChart(chartElement: HTMLElement): Promise<void> {
    this.checkPageBreak(100);

    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      this.checkPageBreak(imgHeight);

      this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 10;
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      // Add placeholder text if chart fails
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(150, 150, 150);
      this.pdf.text('Chart could not be generated', this.margin, this.currentY);
      this.currentY += 20;
    }
  }

  private addInsights(insights: string[]): void {
    if (insights.length === 0) return;

    this.checkPageBreak(30);

    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Key Insights', this.margin, this.currentY);
    this.currentY += 15;

    insights.forEach((insight, index) => {
      this.checkPageBreak(15);
      
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(60, 60, 60);
      
      const bulletPoint = `${index + 1}. `;
      const textWidth = this.pageWidth - 2 * this.margin - 10;
      const lines = this.pdf.splitTextToSize(insight, textWidth);
      
      this.pdf.text(bulletPoint, this.margin, this.currentY);
      this.pdf.text(lines, this.margin + 10, this.currentY);
      
      this.currentY += lines.length * 5 + 3;
    });
  }

  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      
      // Footer line
      this.pdf.setDrawColor(200, 200, 200);
      this.pdf.line(this.margin, this.pageHeight - 15, this.pageWidth - this.margin, this.pageHeight - 15);
      
      // Page number
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 8
      );
      
      // Company name
      this.pdf.text(
        'Double A Rent Management System',
        this.margin,
        this.pageHeight - 8
      );
    }
  }

  async generateReport(reportData: ReportData): Promise<void> {
    this.addHeader(reportData.title, reportData.subtitle);
    
    // Add summary cards
    if (reportData.summary) {
      this.addSummaryCards(reportData.summary);
    }

    // Add chart if provided
    if (reportData.chartElement) {
      await this.addChart(reportData.chartElement);
    }

    // Add insights
    if (reportData.insights && reportData.insights.length > 0) {
      this.addInsights(reportData.insights);
    }

    // Add data table
    if (reportData.data.length > 0) {
      this.checkPageBreak(30);
      
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text('Detailed Data', this.margin, this.currentY);
      this.currentY += 15;
      
      this.addTable(reportData.data, reportData.columns);
    }

    // Add footer to all pages
    this.addFooter();
  }

  save(filename: string): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }

  getDataUrl(): string {
    return this.pdf.output('dataurlstring');
  }
}

// Enhanced utility functions for different report types
export const generateRentCollectionReport = async (
  data: any[], 
  chartElement?: HTMLElement,
  dateRange?: { start: string; end: string }
): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalCollected = data.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
  const totalExpected = data.reduce((sum, item) => sum + (item.rentAmount || 0), 0);
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected * 100) : 0;
  const outstanding = totalExpected - totalCollected;

  const columns = [
    { key: 'tenant', label: 'Tenant' },
    { key: 'property', label: 'Property' },
    { 
      key: 'rentAmount', 
      label: 'Expected', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { 
      key: 'amountPaid', 
      label: 'Paid', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { key: 'status', label: 'Status' },
    { key: 'paymentDate', label: 'Payment Date' }
  ];

  const insights = [
    `Collection rate of ${collectionRate.toFixed(1)}% ${collectionRate >= 90 ? 'exceeds' : collectionRate >= 80 ? 'meets' : 'falls below'} industry standards`,
    `Outstanding amount of $${outstanding.toLocaleString()} requires ${outstanding > 50000 ? 'immediate' : 'routine'} follow-up`,
    `${data.filter(d => d.status === 'Paid').length} out of ${data.length} tenants have paid in full`,
    totalCollected > 0 ? `Average payment amount is $${(totalCollected / data.filter(d => d.amountPaid > 0).length || 0).toLocaleString()}` : 'No payments recorded in this period'
  ];

  await generator.generateReport({
    title: 'Rent Collection Report',
    subtitle: dateRange ? `Period: ${dateRange.start} to ${dateRange.end}` : `Generated on ${format(new Date(), 'PPP')}`,
    data,
    columns,
    summary: {
      'Total Expected': `$${totalExpected.toLocaleString()}`,
      'Total Collected': `$${totalCollected.toLocaleString()}`,
      'Collection Rate': `${collectionRate.toFixed(1)}%`,
      'Outstanding': `$${outstanding.toLocaleString()}`,
      'Properties': data.length.toString(),
      'Paid in Full': data.filter(d => d.status === 'Paid').length.toString()
    },
    chartElement,
    insights
  });

  generator.save(`rent-collection-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateAgentEarningsReport = async (
  data: any[], 
  chartElement?: HTMLElement,
  dateRange?: { start: string; end: string }
): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalCommissions = data.reduce((sum, item) => sum + (item.commissionEarned || 0), 0);
  const totalRentCollected = data.reduce((sum, item) => sum + (item.totalRentCollected || 0), 0);
  const totalProperties = data.reduce((sum, item) => sum + (item.properties || 0), 0);
  const avgCommission = data.length > 0 ? totalCommissions / data.length : 0;

  const columns = [
    { key: 'agent', label: 'Agent Name' },
    { key: 'properties', label: 'Properties' },
    { 
      key: 'totalRentCollected', 
      label: 'Rent Collected', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { 
      key: 'commissionRate', 
      label: 'Rate', 
      format: (value: number) => `${value}%` 
    },
    { 
      key: 'commissionEarned', 
      label: 'Commission', 
      format: (value: number) => `$${value.toLocaleString()}` 
    }
  ];

  const topPerformer = data.sort((a, b) => b.commissionEarned - a.commissionEarned)[0];
  const insights = [
    `${data.length} agents managed a total of ${totalProperties} properties`,
    `Total commissions paid: $${totalCommissions.toLocaleString()}`,
    topPerformer ? `Top performer: ${topPerformer.agent} earned $${topPerformer.commissionEarned.toLocaleString()}` : 'No commission data available',
    `Average commission per agent: $${avgCommission.toLocaleString()}`,
    totalRentCollected > 0 ? `Commission rate averages ${((totalCommissions / totalRentCollected) * 100).toFixed(2)}% of rent collected` : 'No rent collection data available'
  ];

  await generator.generateReport({
    title: 'Agent Earnings Report',
    subtitle: dateRange ? `Period: ${dateRange.start} to ${dateRange.end}` : `Generated on ${format(new Date(), 'PPP')}`,
    data,
    columns,
    summary: {
      'Total Agents': data.length.toString(),
      'Total Properties': totalProperties.toString(),
      'Total Commissions': `$${totalCommissions.toLocaleString()}`,
      'Avg Commission': `$${avgCommission.toLocaleString()}`,
      'Rent Collected': `$${totalRentCollected.toLocaleString()}`,
      'Commission Rate': `${totalRentCollected > 0 ? ((totalCommissions / totalRentCollected) * 100).toFixed(2) : 0}%`
    },
    chartElement,
    insights
  });

  generator.save(`agent-earnings-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateDefaultersReport = async (
  data: any[], 
  chartElement?: HTMLElement
): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalOutstanding = data.reduce((sum, item) => sum + (item.outstandingAmount || 0), 0);
  const avgOutstanding = data.length > 0 ? totalOutstanding / data.length : 0;
  const criticalCases = data.filter(d => d.daysOverdue > 60).length;
  const recentCases = data.filter(d => d.daysOverdue <= 30).length;

  const columns = [
    { key: 'tenant', label: 'Tenant Name' },
    { key: 'property', label: 'Property' },
    { 
      key: 'rentAmount', 
      label: 'Monthly Rent', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { key: 'lastPayment', label: 'Last Payment' },
    { 
      key: 'outstandingAmount', 
      label: 'Outstanding', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { key: 'daysOverdue', label: 'Days Overdue' }
  ];

  const insights = [
    `${data.length} tenants have outstanding payments totaling $${totalOutstanding.toLocaleString()}`,
    `${criticalCases} cases are critical (over 60 days overdue) requiring immediate action`,
    `${recentCases} cases are recent (under 30 days) and may resolve with standard follow-up`,
    `Average outstanding amount per tenant: $${avgOutstanding.toLocaleString()}`,
    data.length > 0 ? `Longest overdue period: ${Math.max(...data.map(d => d.daysOverdue))} days` : 'No overdue cases found'
  ];

  await generator.generateReport({
    title: 'Defaulters Report',
    subtitle: `Outstanding Payments as of ${format(new Date(), 'PPP')}`,
    data,
    columns,
    summary: {
      'Total Defaulters': data.length.toString(),
      'Total Outstanding': `$${totalOutstanding.toLocaleString()}`,
      'Average Outstanding': `$${avgOutstanding.toLocaleString()}`,
      'Critical Cases': criticalCases.toString(),
      'Recent Cases': recentCases.toString(),
      'Collection Priority': criticalCases > 0 ? 'High' : recentCases > 0 ? 'Medium' : 'Low'
    },
    chartElement,
    insights
  });

  generator.save(`defaulters-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generatePropertyReport = async (
  data: any[], 
  chartElement?: HTMLElement
): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalProperties = data.length;
  const occupiedProperties = data.filter(p => p.status === 'Occupied').length;
  const vacantProperties = data.filter(p => p.status === 'Vacant').length;
  const totalRentValue = data.reduce((sum, p) => sum + (p.rent_amount || 0), 0);
  const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties * 100) : 0;

  const columns = [
    { key: 'property_no', label: 'Property #' },
    { key: 'estate_name', label: 'Estate' },
    { key: 'house_number', label: 'Unit' },
    { key: 'house_type', label: 'Type' },
    { 
      key: 'rent_amount', 
      label: 'Monthly Rent', 
      format: (value: number) => `$${value.toLocaleString()}` 
    },
    { key: 'status', label: 'Status' },
    { key: 'tenant_name', label: 'Tenant' }
  ];

  const insights = [
    `Portfolio consists of ${totalProperties} properties with ${occupancyRate.toFixed(1)}% occupancy rate`,
    `${vacantProperties} vacant properties represent potential monthly revenue of $${data.filter(p => p.status === 'Vacant').reduce((sum, p) => sum + (p.rent_amount || 0), 0).toLocaleString()}`,
    `Total monthly rent value: $${totalRentValue.toLocaleString()}`,
    occupancyRate >= 95 ? 'Excellent occupancy rate indicates strong demand' : occupancyRate >= 85 ? 'Good occupancy rate with room for improvement' : 'Low occupancy rate requires marketing attention',
    `Average rent per property: $${totalProperties > 0 ? (totalRentValue / totalProperties).toLocaleString() : 0}`
  ];

  await generator.generateReport({
    title: 'Property Portfolio Report',
    subtitle: `Portfolio Analysis as of ${format(new Date(), 'PPP')}`,
    data,
    columns,
    summary: {
      'Total Properties': totalProperties.toString(),
      'Occupied': occupiedProperties.toString(),
      'Vacant': vacantProperties.toString(),
      'Occupancy Rate': `${occupancyRate.toFixed(1)}%`,
      'Monthly Rent Value': `$${totalRentValue.toLocaleString()}`,
      'Avg Rent/Property': `$${totalProperties > 0 ? Math.round(totalRentValue / totalProperties).toLocaleString() : 0}`
    },
    chartElement,
    insights
  });

  generator.save(`property-portfolio-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateFinancialSummaryReport = async (
  summaryData: any,
  chartElements?: { revenue?: HTMLElement; occupancy?: HTMLElement; trends?: HTMLElement }
): Promise<void> => {
  const generator = new PDFGenerator();

  const insights = [
    `Collection rate of ${summaryData.collectionRate.toFixed(1)}% ${summaryData.collectionRate >= 90 ? 'exceeds industry benchmarks' : 'requires improvement'}`,
    `Occupancy rate of ${summaryData.occupancyRate.toFixed(1)}% ${summaryData.occupancyRate >= 95 ? 'indicates excellent property management' : 'shows potential for growth'}`,
    `Outstanding amount of $${summaryData.outstandingAmount.toLocaleString()} represents ${((summaryData.outstandingAmount / summaryData.totalExpected) * 100).toFixed(1)}% of expected revenue`,
    summaryData.totalRevenue > summaryData.totalExpected * 0.9 ? 'Strong financial performance this period' : 'Revenue collection needs attention',
    `${summaryData.vacantProperties} vacant properties could generate additional $${((summaryData.totalRevenue / summaryData.occupiedProperties) * summaryData.vacantProperties || 0).toLocaleString()} monthly`
  ];

  await generator.generateReport({
    title: 'Financial Summary Report',
    subtitle: `Comprehensive Financial Analysis - ${format(new Date(), 'MMMM yyyy')}`,
    data: [], // No tabular data for summary report
    columns: [],
    summary: {
      'Total Revenue': `$${summaryData.totalRevenue.toLocaleString()}`,
      'Expected Revenue': `$${summaryData.totalExpected.toLocaleString()}`,
      'Collection Rate': `${summaryData.collectionRate.toFixed(1)}%`,
      'Outstanding Amount': `$${summaryData.outstandingAmount.toLocaleString()}`,
      'Total Properties': summaryData.totalProperties.toString(),
      'Occupancy Rate': `${summaryData.occupancyRate.toFixed(1)}%`
    },
    chartElement: chartElements?.revenue,
    insights
  });

  generator.save(`financial-summary-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};