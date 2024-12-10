import { Assessment } from '../types/assessment';
import { formatDate, formatCurrency } from './formatters';

export async function exportToExcel(assessments: Assessment[]): Promise<void> {
  // In a real app, use a library like xlsx
  // This is a simplified CSV generation
  const headers = [
    'ID',
    'Status',
    'Vehicle Model',
    'Vehicle Year',
    'Driver Name',
    'Risk Score',
    'Created Date',
  ];

  const rows = assessments.map(assessment => [
    assessment.id,
    assessment.status,
    assessment.vehicleModel,
    assessment.vehicleYear,
    assessment.driverDetails.name,
    calculateRiskScore(assessment),
    formatDate(assessment.createdAt),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadFile(csv, 'assessments.csv', 'text/csv');
}

function calculateRiskScore(assessment: Assessment): number {
  // Simplified risk score calculation
  return Math.round(Math.random() * 100);
}

function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}