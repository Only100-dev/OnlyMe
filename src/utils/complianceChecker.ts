import { Assessment } from '../types/assessment';

interface ComplianceResult {
  isCompliant: boolean;
  violations: string[];
  requirements: string[];
}

export function checkCompliance(assessment: Assessment): ComplianceResult {
  const result: ComplianceResult = {
    isCompliant: true,
    violations: [],
    requirements: [
      'Valid UAE driving license',
      'Vehicle registration card',
      'Minimum third-party liability coverage',
      'Vehicle inspection certificate',
    ],
  };

  // Check minimum coverage requirements
  const minCoverage = 250000; // AED
  if (assessment.coverageDetails.amount < minCoverage) {
    result.isCompliant = false;
    result.violations.push(
      `Coverage amount (${assessment.coverageDetails.amount} AED) is below minimum requirement of ${minCoverage} AED`
    );
  }

  // Check driver age requirements
  if (assessment.driverDetails.age < 18) {
    result.isCompliant = false;
    result.violations.push('Driver must be at least 18 years old');
  }

  // Check vehicle age requirements
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  if (vehicleAge > 15) {
    result.isCompliant = false;
    result.violations.push('Vehicle exceeds maximum age limit of 15 years');
  }

  // Check required documents
  const requiredDocs = ['driver_license', 'vehicle_registration', 'insurance_policy'];
  const missingDocs = requiredDocs.filter(
    doc => !assessment.documents.some(d => d.toLowerCase().includes(doc))
  );

  if (missingDocs.length > 0) {
    result.isCompliant = false;
    result.violations.push(`Missing required documents: ${missingDocs.join(', ')}`);
  }

  return result;
}

export function generateComplianceReport(assessment: Assessment): string {
  const result = checkCompliance(assessment);
  let report = '# Compliance Assessment Report\n\n';
  
  report += `## Status: ${result.isCompliant ? 'Compliant' : 'Non-Compliant'}\n\n`;
  
  if (result.violations.length > 0) {
    report += '## Violations:\n';
    result.violations.forEach(violation => {
      report += `- ${violation}\n`;
    });
    report += '\n';
  }
  
  report += '## Requirements:\n';
  result.requirements.forEach(requirement => {
    report += `- ${requirement}\n`;
  });
  
  return report;
}