import { Assessment } from '../types/assessment';
import { Regulation } from '../types/compliance';
import { fetchRegulations } from './regulatoryApi';

interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  requirements: string[];
  score: number;
  details: {
    category: string;
    status: 'passed' | 'failed';
    description: string;
  }[];
}

export async function checkRegulationCompliance(assessment: Assessment): Promise<ComplianceResult> {
  const regulations = await fetchRegulations();
  const result: ComplianceResult = {
    isCompliant: true,
    violations: [],
    requirements: [],
    score: 100,
    details: [],
  };

  // Check UAE Insurance Authority requirements
  checkInsuranceRequirements(assessment, result);
  
  // Check vehicle requirements
  checkVehicleRequirements(assessment, result);
  
  // Check driver requirements
  checkDriverRequirements(assessment, result);
  
  // Check coverage requirements
  checkCoverageRequirements(assessment, result);

  // Calculate final compliance score
  result.score = calculateComplianceScore(result.details);
  result.isCompliant = result.score >= 80;

  return result;
}

function checkInsuranceRequirements(assessment: Assessment, result: ComplianceResult) {
  // Minimum third-party liability
  if (assessment.coverageDetails.type === 'liability' && 
      assessment.coverageDetails.amount < 250000) {
    result.violations.push('Minimum third-party liability coverage not met (250,000 AED required)');
    result.details.push({
      category: 'Insurance',
      status: 'failed',
      description: 'Insufficient liability coverage',
    });
  } else {
    result.details.push({
      category: 'Insurance',
      status: 'passed',
      description: 'Liability coverage requirements met',
    });
  }

  // Required documentation
  const requiredDocs = ['insurance_policy', 'vehicle_registration'];
  const missingDocs = requiredDocs.filter(doc => 
    !assessment.documents.some(d => d.toLowerCase().includes(doc))
  );

  if (missingDocs.length > 0) {
    result.violations.push(`Missing required documents: ${missingDocs.join(', ')}`);
    result.details.push({
      category: 'Documentation',
      status: 'failed',
      description: 'Missing mandatory documents',
    });
  }
}

function checkVehicleRequirements(assessment: Assessment, result: ComplianceResult) {
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  
  // Vehicle age restrictions
  if (vehicleAge > 15) {
    result.violations.push('Vehicle exceeds maximum age limit of 15 years');
    result.details.push({
      category: 'Vehicle',
      status: 'failed',
      description: 'Vehicle age non-compliant',
    });
  } else {
    result.details.push({
      category: 'Vehicle',
      status: 'passed',
      description: 'Vehicle age requirements met',
    });
  }
}

function checkDriverRequirements(assessment: Assessment, result: ComplianceResult) {
  // Age requirements
  if (assessment.driverDetails.age < 18) {
    result.violations.push('Driver must be at least 18 years old');
    result.details.push({
      category: 'Driver',
      status: 'failed',
      description: 'Driver age below minimum requirement',
    });
  }

  // Experience requirements
  if (assessment.driverDetails.experience < 1) {
    result.violations.push('Minimum 1 year driving experience required');
    result.details.push({
      category: 'Driver',
      status: 'failed',
      description: 'Insufficient driving experience',
    });
  }
}

function checkCoverageRequirements(assessment: Assessment, result: ComplianceResult) {
  const { coverageDetails } = assessment;

  // Coverage type requirements
  if (coverageDetails.type === 'comprehensive') {
    if (coverageDetails.amount < 500000) {
      result.violations.push('Minimum comprehensive coverage amount not met');
      result.details.push({
        category: 'Coverage',
        status: 'failed',
        description: 'Insufficient comprehensive coverage',
      });
    }
  }

  // Additional coverage requirements
  const requiredCoverages = ['Personal Accident Cover', 'Medical Payments'];
  const missingCoverages = requiredCoverages.filter(
    coverage => !coverageDetails.additionalCoverages.includes(coverage)
  );

  if (missingCoverages.length > 0) {
    result.violations.push(`Missing required coverages: ${missingCoverages.join(', ')}`);
    result.details.push({
      category: 'Coverage',
      status: 'failed',
      description: 'Missing mandatory coverage options',
    });
  }
}

function calculateComplianceScore(details: ComplianceResult['details']): number {
  const totalChecks = details.length;
  const passedChecks = details.filter(detail => detail.status === 'passed').length;
  return Math.round((passedChecks / totalChecks) * 100);
}

export function generateComplianceReport(result: ComplianceResult): string {
  let report = '# Regulatory Compliance Report\n\n';
  
  report += `## Overall Status: ${result.isCompliant ? 'Compliant' : 'Non-Compliant'}\n`;
  report += `Compliance Score: ${result.score}%\n\n`;

  if (result.violations.length > 0) {
    report += '## Violations\n';
    result.violations.forEach(violation => {
      report += `- ${violation}\n`;
    });
    report += '\n';
  }

  report += '## Detailed Results\n';
  result.details.forEach(detail => {
    report += `### ${detail.category}\n`;
    report += `Status: ${detail.status.toUpperCase()}\n`;
    report += `${detail.description}\n\n`;
  });

  return report;
}