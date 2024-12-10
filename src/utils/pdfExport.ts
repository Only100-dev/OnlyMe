import { jsPDF } from 'jspdf';
import { Assessment } from '../types/assessment';
import { formatDate, formatCurrency } from './formatters';

export async function generateAssessmentPDF(assessment: Assessment): Promise<void> {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Motor Risk Assessment Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Reference: ${assessment.id}`, 20, 30);
  doc.text(`Date: ${formatDate(assessment.createdAt)}`, 20, 40);

  // Assessment Details
  doc.setFontSize(16);
  doc.text('Assessment Details', 20, 60);
  
  doc.setFontSize(12);
  addSection(doc, 70, [
    ['Status', assessment.status.toUpperCase()],
    ['Vehicle Model', assessment.vehicleModel],
    ['Vehicle Year', assessment.vehicleYear.toString()],
  ]);

  // Driver Information
  doc.setFontSize(16);
  doc.text('Driver Information', 20, 120);
  
  doc.setFontSize(12);
  addSection(doc, 130, [
    ['Name', assessment.driverDetails.name],
    ['License Number', assessment.driverDetails.licenseNumber],
    ['Age', `${assessment.driverDetails.age} years`],
    ['Experience', `${assessment.driverDetails.experience} years`],
  ]);

  // Coverage Details
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Coverage Details', 20, 20);
  
  doc.setFontSize(12);
  addSection(doc, 30, [
    ['Type', assessment.coverageDetails.type],
    ['Amount', formatCurrency(assessment.coverageDetails.amount)],
    ['Deductible', formatCurrency(assessment.coverageDetails.deductible)],
  ]);

  // Risk Factors
  if (assessment.riskFactors.length > 0) {
    doc.setFontSize(16);
    doc.text('Risk Factors', 20, 80);
    
    doc.setFontSize(12);
    let yPos = 90;
    assessment.riskFactors.forEach((factor) => {
      doc.text(`• ${factor.name} (${factor.severity.toUpperCase()})`, 25, yPos);
      doc.text(factor.description, 30, yPos + 7);
      yPos += 20;
    });
  }

  // Documents
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Attached Documents', 20, 20);
  
  doc.setFontSize(12);
  let yPos = 30;
  assessment.documents.forEach((doc, index) => {
    doc.text(`${index + 1}. ${doc}`, 25, yPos);
    yPos += 10;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  doc.save(`assessment-${assessment.id}.pdf`);
}

function addSection(doc: jsPDF, startY: number, data: [string, string][]) {
  let yPos = startY;
  data.forEach(([label, value]) => {
    doc.text(`${label}:`, 25, yPos);
    doc.text(value, 100, yPos);
    yPos += 10;
  });
}