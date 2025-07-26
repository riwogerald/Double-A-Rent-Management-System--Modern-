import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

export interface ReportData {
  title: string;
  subtitle?: string;
  data: any[];
  columns: string[];
  summary?: Record<string, any>;
  chartElement?: HTMLElement;
}

export class PDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
  }

  private addHeader(title: string, subtitle?: string) {
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, 20, 30);

    if (subtitle) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(subtitle, 20, 40);
    }

    // Add company info
    this.pdf.setFontSize(10);
    this.pdf.text('Double A Rent Management System', 20, 15);
    this.pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 20);

    // Add separator line
    this.pdf.line(20, 50, 190, 50);
  }

  private addTable(data: any[], columns: string[], startY: number): number {
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const tableWidth = pageWidth - 40;
    const colWidth = tableWidth / columns.length;
    
    let currentY = startY + 10;

    // Table header
    this.pdf.setFillColor(230, 230, 230);
    this.pdf.rect(20, currentY, tableWidth, 8, 'F');
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    
    columns.forEach((col, index) => {
      this.pdf.text(col, 22 + (index * colWidth), currentY + 5);
    });

    currentY += 8;

    // Table rows
    this.pdf.setFont('helvetica', 'normal');
    data.forEach((row, rowIndex) => {
      if (currentY > 280) {
        this.pdf.addPage();
        currentY = 20;
        
        // Re-add header on new page
        this.pdf.setFillColor(230, 230, 230);
        this.pdf.rect(20, currentY, tableWidth, 8, 'F');
        this.pdf.setFont('helvetica', 'bold');
        columns.forEach((col, index) => {
          this.pdf.text(col, 22 + (index * colWidth), currentY + 5);
        });
        currentY += 8;
        this.pdf.setFont('helvetica', 'normal');
      }

      // Alternate row colors
      if (rowIndex % 2 === 0) {
        this.pdf.setFillColor(248, 248, 248);
        this.pdf.rect(20, currentY, tableWidth, 8, 'F');
      }

      columns.forEach((col, index) => {
        const value = row[col] || '';
        this.pdf.text(String(value), 22 + (index * colWidth), currentY + 5);
      });

      currentY += 8;
    });

    return currentY;
  }

  private addSummary(summary: Record<string, any>, startY: number): number {
    let currentY = startY + 20;

    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Summary', 20, currentY);

    currentY += 10;
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    Object.entries(summary).forEach(([key, value]) => {
      this.pdf.text(`${key}: ${value}`, 20, currentY);
      currentY += 6;
    });

    return currentY;
  }

  async addChart(chartElement: HTMLElement, startY: number): Promise<number> {
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    this.pdf.addImage(imgData, 'PNG', 20, startY, imgWidth, imgHeight);
    return startY + imgHeight + 10;
  }

  async generateReport(reportData: ReportData): Promise<void> {
    this.addHeader(reportData.title, reportData.subtitle);
    
    let currentY = 60;

    // Add chart if provided
    if (reportData.chartElement) {
      currentY = await this.addChart(reportData.chartElement, currentY);
    }

    // Add table
    if (reportData.data.length > 0) {
      currentY = this.addTable(reportData.data, reportData.columns, currentY);
    }

    // Add summary
    if (reportData.summary) {
      this.addSummary(reportData.summary, currentY);
    }
  }

  save(filename: string): void {
    this.pdf.save(filename);
  }

  getBlob(): Blob {
    return this.pdf.output('blob');
  }
}

// Utility functions for different report types
export const generateRentCollectionReport = async (data: any[]): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalCollected = data.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
  const totalExpected = data.reduce((sum, item) => sum + (item.rentAmount || 0), 0);
  const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected * 100).toFixed(2) : '0';

  await generator.generateReport({
    title: 'Rent Collection Report',
    subtitle: `Report for ${format(new Date(), 'MMMM yyyy')}`,
    data,
    columns: ['Tenant', 'Property', 'Rent Amount', 'Amount Paid', 'Status', 'Payment Date'],
    summary: {
      'Total Expected': `$${totalExpected.toLocaleString()}`,
      'Total Collected': `$${totalCollected.toLocaleString()}`,
      'Collection Rate': `${collectionRate}%`,
      'Outstanding': `$${(totalExpected - totalCollected).toLocaleString()}`
    }
  });

  generator.save(`rent-collection-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateAgentEarningsReport = async (data: any[]): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalCommissions = data.reduce((sum, item) => sum + (item.commission || 0), 0);

  await generator.generateReport({
    title: 'Agent Earnings Report',
    subtitle: `Commission Report for ${format(new Date(), 'MMMM yyyy')}`,
    data,
    columns: ['Agent', 'Properties', 'Total Rent Collected', 'Commission Rate', 'Commission Earned'],
    summary: {
      'Total Agents': data.length,
      'Total Commissions Paid': `$${totalCommissions.toLocaleString()}`,
      'Average Commission': `$${(totalCommissions / data.length || 0).toLocaleString()}`
    }
  });

  generator.save(`agent-earnings-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const generateDefaultersReport = async (data: any[]): Promise<void> => {
  const generator = new PDFGenerator();
  
  const totalOutstanding = data.reduce((sum, item) => sum + (item.outstandingAmount || 0), 0);

  await generator.generateReport({
    title: 'Defaulters Report',
    subtitle: `Outstanding Payments as of ${format(new Date(), 'PPP')}`,
    data,
    columns: ['Tenant', 'Property', 'Rent Amount', 'Last Payment', 'Outstanding Amount', 'Days Overdue'],
    summary: {
      'Total Defaulters': data.length,
      'Total Outstanding': `$${totalOutstanding.toLocaleString()}`,
      'Average Outstanding': `$${(totalOutstanding / data.length || 0).toLocaleString()}`
    }
  });

  generator.save(`defaulters-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
