import React from 'react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { formatCurrency } from '../lib/api';

interface ReceiptData {
  receiptNumber: string;
  tenantName: string;
  propertyDetails: string;
  rentMonth: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDate: string;
  balanceBefore: number;
  balanceAfter: number;
  penaltyAmount?: number;
  notes?: string;
}

export const generateRentReceipt = async (receiptData: ReceiptData): Promise<void> => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Company Header
  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Company Logo/Name
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOUBLE A', 20, 25);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Rent Management System', 20, 32);
  
  // Receipt Title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RENT RECEIPT', pageWidth - 80, 25);
  
  // Receipt Details Box
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(pageWidth - 90, 30, 80, 25);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Receipt #: ${receiptData.receiptNumber}`, pageWidth - 85, 38);
  pdf.text(`Date: ${format(new Date(receiptData.paymentDate), 'dd/MM/yyyy')}`, pageWidth - 85, 45);
  pdf.text(`Time: ${format(new Date(), 'HH:mm')}`, pageWidth - 85, 52);
  
  // Tenant Information
  let currentY = 70;
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TENANT INFORMATION', 20, currentY);
  
  currentY += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Name: ${receiptData.tenantName}`, 20, currentY);
  
  currentY += 8;
  pdf.text(`Property: ${receiptData.propertyDetails}`, 20, currentY);
  
  currentY += 8;
  pdf.text(`Rent Period: ${format(new Date(receiptData.rentMonth), 'MMMM yyyy')}`, 20, currentY);
  
  // Payment Details Section
  currentY += 20;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PAYMENT DETAILS', 20, currentY);
  
  // Payment table
  currentY += 15;
  const tableData = [
    ['Description', 'Amount'],
    ['Previous Balance', formatCurrency(receiptData.balanceBefore)],
    ...(receiptData.penaltyAmount && receiptData.penaltyAmount > 0 
      ? [['Late Payment Penalty', formatCurrency(receiptData.penaltyAmount)]] 
      : []
    ),
    ['Payment Received', `(${formatCurrency(receiptData.amountPaid)})`],
    ['Current Balance', formatCurrency(receiptData.balanceAfter)]
  ];
  
  // Draw table
  const colWidths = [100, 60];
  const rowHeight = 8;
  
  tableData.forEach((row, index) => {
    if (index === 0) {
      // Header row
      pdf.setFillColor(240, 240, 240);
      pdf.rect(20, currentY - 2, colWidths[0] + colWidths[1], rowHeight, 'F');
      pdf.setFont('helvetica', 'bold');
    } else if (index === tableData.length - 1) {
      // Total row
      pdf.setFillColor(37, 99, 235);
      pdf.rect(20, currentY - 2, colWidths[0] + colWidths[1], rowHeight, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
    }
    
    // Draw borders
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, currentY - 2, colWidths[0], rowHeight);
    pdf.rect(20 + colWidths[0], currentY - 2, colWidths[1], rowHeight);
    
    // Add text
    pdf.text(row[0], 25, currentY + 3);
    pdf.text(row[1], 25 + colWidths[0] + 5, currentY + 3);
    
    currentY += rowHeight;
    pdf.setTextColor(0, 0, 0);
  });
  
  // Payment Method
  currentY += 15;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Payment Method: ${receiptData.paymentMethod}`, 20, currentY);
  
  // Notes if any
  if (receiptData.notes) {
    currentY += 10;
    pdf.text(`Notes: ${receiptData.notes}`, 20, currentY);
  }
  
  // Status
  currentY += 15;
  const status = receiptData.balanceAfter <= 0 ? 'PAID IN FULL' : 'PARTIAL PAYMENT';
  const statusColor = receiptData.balanceAfter <= 0 ? [34, 197, 94] : [249, 115, 22];
  
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  pdf.rect(20, currentY - 5, 80, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(status, 25, currentY + 2);
  
  // Footer
  currentY = pdf.internal.pageSize.getHeight() - 40;
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  pdf.text('Thank you for your payment!', 20, currentY);
  pdf.text('For inquiries, contact: info@doublearms.com | +254 700 123 456', 20, currentY + 8);
  
  // Signature line
  pdf.line(pageWidth - 100, currentY + 10, pageWidth - 20, currentY + 10);
  pdf.text('Authorized Signature', pageWidth - 90, currentY + 18);
  
  // Save the PDF
  pdf.save(`rent-receipt-${receiptData.receiptNumber}.pdf`);
};

interface ReceiptGeneratorProps {
  receiptData: ReceiptData;
  onGenerate?: () => void;
}

const ReceiptGenerator: React.FC<ReceiptGeneratorProps> = ({ receiptData, onGenerate }) => {
  const handleGenerateReceipt = async () => {
    try {
      await generateRentReceipt(receiptData);
      if (onGenerate) {
        onGenerate();
      }
    } catch (error) {
      console.error('Error generating receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  return (
    <button
      onClick={handleGenerateReceipt}
      className="btn-primary flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Generate Receipt
    </button>
  );
};

export default ReceiptGenerator;