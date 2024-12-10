import { Assessment, RiskFactor } from '../types/assessment';

export function assessRisk(assessment: Assessment): RiskFactor[] {
  const riskFactors: RiskFactor[] = [];

  // Driver Risk Factors
  if (assessment.driverDetails.age < 25) {
    riskFactors.push({
      id: 'young-driver',
      name: 'Young Driver',
      severity: 'high',
      description: 'Driver is under 25 years old, which statistically indicates higher risk.',
    });
  }

  if (assessment.driverDetails.experience < 2) {
    riskFactors.push({
      id: 'inexperienced-driver',
      name: 'Inexperienced Driver',
      severity: 'medium',
      description: 'Driver has less than 2 years of driving experience.',
    });
  }

  if (assessment.driverDetails.previousAccidents > 0) {
    riskFactors.push({
      id: 'accident-history',
      name: 'Accident History',
      severity: assessment.driverDetails.previousAccidents > 2 ? 'high' : 'medium',
      description: `Driver has ${assessment.driverDetails.previousAccidents} previous accident(s).`,
    });
  }

  // Vehicle Risk Factors
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  if (vehicleAge > 10) {
    riskFactors.push({
      id: 'old-vehicle',
      name: 'Older Vehicle',
      severity: 'medium',
      description: 'Vehicle is over 10 years old, which may indicate higher maintenance needs.',
    });
  }

  // Coverage Risk Factors
  if (assessment.coverageDetails.type === 'liability') {
    riskFactors.push({
      id: 'basic-coverage',
      name: 'Basic Coverage Only',
      severity: 'low',
      description: 'Only liability coverage selected, which provides minimal protection.',
    });
  }

  if (assessment.coverageDetails.deductible < 1000) {
    riskFactors.push({
      id: 'low-deductible',
      name: 'Low Deductible',
      severity: 'low',
      description: 'Low deductible may indicate higher claim frequency.',
    });
  }

  return riskFactors;
}

export function calculateRiskScore(riskFactors: RiskFactor[]): number {
  const severityWeights = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const totalWeight = riskFactors.reduce(
    (sum, factor) => sum + severityWeights[factor.severity],
    0
  );

  return Math.min(100, Math.max(0, 100 - (totalWeight * 10)));
}

export function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 70) return 'low';
  if (score >= 40) return 'medium';
  return 'high';
}

export function getRecommendation(assessment: Assessment): string {
  const riskFactors = assessRisk(assessment);
  const riskScore = calculateRiskScore(riskFactors);
  const riskLevel = getRiskLevel(riskScore);

  if (riskLevel === 'low') {
    return 'Recommended for approval. Standard terms and conditions apply.';
  }

  if (riskLevel === 'medium') {
    return 'Recommended for approval with additional conditions: higher premium and/or deductible may apply.';
  }

  return 'Not recommended for approval. Risk factors exceed acceptable threshold.';
}