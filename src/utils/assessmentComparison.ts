import { Assessment } from '../types/assessment';

interface ComparisonResult {
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  riskImpact: 'increased' | 'decreased' | 'unchanged';
  significantChanges: boolean;
}

export function compareAssessments(
  oldAssessment: Assessment,
  newAssessment: Assessment
): ComparisonResult {
  const changes = [];
  
  // Compare vehicle details
  if (oldAssessment.vehicleModel !== newAssessment.vehicleModel) {
    changes.push({
      field: 'Vehicle Model',
      oldValue: oldAssessment.vehicleModel,
      newValue: newAssessment.vehicleModel,
    });
  }

  if (oldAssessment.vehicleYear !== newAssessment.vehicleYear) {
    changes.push({
      field: 'Vehicle Year',
      oldValue: oldAssessment.vehicleYear,
      newValue: newAssessment.vehicleYear,
    });
  }

  // Compare driver details
  const driverFields: (keyof Assessment['driverDetails'])[] = [
    'name',
    'licenseNumber',
    'age',
    'experience',
    'previousAccidents',
  ];

  driverFields.forEach((field) => {
    if (oldAssessment.driverDetails[field] !== newAssessment.driverDetails[field]) {
      changes.push({
        field: `Driver ${field.charAt(0).toUpperCase() + field.slice(1)}`,
        oldValue: oldAssessment.driverDetails[field],
        newValue: newAssessment.driverDetails[field],
      });
    }
  });

  // Compare coverage details
  if (oldAssessment.coverageDetails.type !== newAssessment.coverageDetails.type) {
    changes.push({
      field: 'Coverage Type',
      oldValue: oldAssessment.coverageDetails.type,
      newValue: newAssessment.coverageDetails.type,
    });
  }

  if (oldAssessment.coverageDetails.amount !== newAssessment.coverageDetails.amount) {
    changes.push({
      field: 'Coverage Amount',
      oldValue: oldAssessment.coverageDetails.amount,
      newValue: newAssessment.coverageDetails.amount,
    });
  }

  // Compare documents
  const removedDocs = oldAssessment.documents.filter(
    (doc) => !newAssessment.documents.includes(doc)
  );
  const addedDocs = newAssessment.documents.filter(
    (doc) => !oldAssessment.documents.includes(doc)
  );

  if (removedDocs.length > 0) {
    changes.push({
      field: 'Removed Documents',
      oldValue: removedDocs,
      newValue: null,
    });
  }

  if (addedDocs.length > 0) {
    changes.push({
      field: 'Added Documents',
      oldValue: null,
      newValue: addedDocs,
    });
  }

  // Determine risk impact
  const oldRiskScore = calculateRiskScore(oldAssessment);
  const newRiskScore = calculateRiskScore(newAssessment);

  const riskImpact = 
    newRiskScore > oldRiskScore ? 'increased' :
    newRiskScore < oldRiskScore ? 'decreased' : 'unchanged';

  // Determine if changes are significant
  const significantChanges = changes.some(change => 
    isSignificantChange(change.field, change.oldValue, change.newValue)
  );

  return {
    changes,
    riskImpact,
    significantChanges,
  };
}

function calculateRiskScore(assessment: Assessment): number {
  // Simplified risk score calculation
  let score = 0;
  
  // Driver risk factors
  score += assessment.driverDetails.previousAccidents * 10;
  score += assessment.driverDetails.age < 25 ? 20 : 0;
  score += assessment.driverDetails.experience < 2 ? 15 : 0;

  // Vehicle risk factors
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  score += vehicleAge > 10 ? 15 : vehicleAge > 5 ? 10 : 0;

  // Coverage risk factors
  score += assessment.coverageDetails.amount < 250000 ? 20 : 0;

  return score;
}

function isSignificantChange(field: string, oldValue: any, newValue: any): boolean {
  switch (field) {
    case 'Coverage Amount':
      return Math.abs(oldValue - newValue) > 50000;
    case 'Driver Age':
    case 'Driver Experience':
      return Math.abs(oldValue - newValue) > 2;
    case 'Previous Accidents':
      return oldValue !== newValue;
    case 'Coverage Type':
      return true;
    default:
      return false;
  }
}