import { Assessment } from '../types/assessment';
import { formatDate, formatCurrency } from './formatters';

export function generateCSV(assessments: Assessment[]): void {
  const headers = [
    'ID',
    'Status',
    'Vehicle Model',
    'Vehicle Year',
    'Driver Name',
    'Driver Age',
    'Driver Experience',
    'Previous Accidents',
    'Coverage Type',
    'Coverage Amount',
    'Deductible',
    'Created Date',
    'Updated Date',
  ];

  const rows = assessments.map(assessment => [
    assessment.id,
    assessment.status,
    assessment.vehicleModel,
    assessment.vehicleYear,
    assessment.driverDetails.name,
    assessment.driverDetails.age,
    assessment.driverDetails.experience,
    assessment.driverDetails.previousAccidents,
    assessment.coverageDetails.type,
    formatCurrency(assessment.coverageDetails.amount),
    formatCurrency(assessment.coverageDetails.deductible),
    formatDate(assessment.createdAt),
    formatDate(assessment.updatedAt),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `assessments-${formatDate(new Date())}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}