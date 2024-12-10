import { Assessment } from '../types/assessment';
import { RiskFactor } from '../types/assessment';

// Risk weights for different factors
const RISK_WEIGHTS = {
  // Driver Profile
  age: {
    under25: 0.3,
    under35: 0.2,
    under45: 0.1,
    above45: 0.05
  },
  experience: {
    under2: 0.25,
    under5: 0.15,
    under10: 0.1,
    above10: 0.05
  },
  accidents: {
    none: 0,
    one: 0.2,
    two: 0.4,
    moreThanTwo: 0.6
  },
  // Vehicle Risk
  vehicleAge: {
    under3: 0.05,
    under5: 0.1,
    under10: 0.2,
    above10: 0.3
  },
  vehicleValue: {
    standard: 0.05,
    luxury: 0.2,
    highPerformance: 0.3
  },
  // Coverage Risk
  coverage: {
    comprehensive: 0.05,
    collision: 0.15,
    liability: 0.25
  }
};

// Standard coverage limits (in AED)
const COVERAGE_LIMITS = {
  liability: {
    min: 250000,
    recommended: 500000
  },
  comprehensive: {
    min: 500000,
    recommended: 1000000
  },
  collision: {
    min: 350000,
    recommended: 750000
  }
};

// Vehicle value thresholds (in AED)
const VEHICLE_VALUE_THRESHOLDS = {
  standard: 150000,
  luxury: 300000
};

export function calculateRiskScore(assessment: Assessment): number {
  let totalRisk = 0;

  // Driver Profile Risk Factors
  if (assessment.driverDetails.age < 25) {
    totalRisk += RISK_WEIGHTS.age.under25;
  } else if (assessment.driverDetails.age < 35) {
    totalRisk += RISK_WEIGHTS.age.under35;
  } else if (assessment.driverDetails.age < 45) {
    totalRisk += RISK_WEIGHTS.age.under45;
  } else {
    totalRisk += RISK_WEIGHTS.age.above45;
  }

  if (assessment.driverDetails.experience < 2) {
    totalRisk += RISK_WEIGHTS.experience.under2;
  } else if (assessment.driverDetails.experience < 5) {
    totalRisk += RISK_WEIGHTS.experience.under5;
  } else if (assessment.driverDetails.experience < 10) {
    totalRisk += RISK_WEIGHTS.experience.under10;
  } else {
    totalRisk += RISK_WEIGHTS.experience.above10;
  }

  // Previous accidents risk
  switch (assessment.driverDetails.previousAccidents) {
    case 0:
      totalRisk += RISK_WEIGHTS.accidents.none;
      break;
    case 1:
      totalRisk += RISK_WEIGHTS.accidents.one;
      break;
    case 2:
      totalRisk += RISK_WEIGHTS.accidents.two;
      break;
    default:
      totalRisk += RISK_WEIGHTS.accidents.moreThanTwo;
  }

  // Vehicle Risk Factors
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  if (vehicleAge < 3) {
    totalRisk += RISK_WEIGHTS.vehicleAge.under3;
  } else if (vehicleAge < 5) {
    totalRisk += RISK_WEIGHTS.vehicleAge.under5;
  } else if (vehicleAge < 10) {
    totalRisk += RISK_WEIGHTS.vehicleAge.under10;
  } else {
    totalRisk += RISK_WEIGHTS.vehicleAge.above10;
  }

  // Coverage Risk Factors
  switch (assessment.coverageDetails.type) {
    case 'comprehensive':
      totalRisk += RISK_WEIGHTS.coverage.comprehensive;
      break;
    case 'collision':
      totalRisk += RISK_WEIGHTS.coverage.collision;
      break;
    case 'liability':
      totalRisk += RISK_WEIGHTS.coverage.liability;
      break;
  }

  return Math.min(1, totalRisk);
}

export function getRiskFactors(assessment: Assessment): RiskFactor[] {
  const factors: RiskFactor[] = [];
  const currentYear = new Date().getFullYear();

  // Driver Profile Risk Factors
  if (assessment.driverDetails.age < 25) {
    factors.push({
      id: 'young-driver',
      name: 'Young Driver',
      severity: 'high',
      description: 'Driver age under 25 represents higher statistical risk.',
    });
  }

  if (assessment.driverDetails.experience < 2) {
    factors.push({
      id: 'inexperienced',
      name: 'Limited Driving Experience',
      severity: 'high',
      description: 'Less than 2 years of driving experience indicates higher risk.',
    });
  }

  if (assessment.driverDetails.previousAccidents > 0) {
    factors.push({
      id: 'accident-history',
      name: 'Previous Accidents',
      severity: assessment.driverDetails.previousAccidents > 2 ? 'high' : 'medium',
      description: `Driver has ${assessment.driverDetails.previousAccidents} previous accident(s).`,
    });
  }

  // Vehicle Risk Factors
  const vehicleAge = currentYear - assessment.vehicleYear;
  if (vehicleAge > 10) {
    factors.push({
      id: 'old-vehicle',
      name: 'Older Vehicle',
      severity: 'medium',
      description: 'Vehicle is over 10 years old, which may indicate higher maintenance needs.',
    });
  }

  // Coverage Risk Factors
  const coverageLimit = COVERAGE_LIMITS[assessment.coverageDetails.type];
  if (assessment.coverageDetails.amount < coverageLimit.min) {
    factors.push({
      id: 'low-coverage',
      name: 'Below Minimum Coverage',
      severity: 'high',
      description: `Coverage amount is below the minimum requirement of ${coverageLimit.min.toLocaleString()} AED.`,
    });
  } else if (assessment.coverageDetails.amount < coverageLimit.recommended) {
    factors.push({
      id: 'below-recommended-coverage',
      name: 'Below Recommended Coverage',
      severity: 'medium',
      description: `Coverage amount is below the recommended level of ${coverageLimit.recommended.toLocaleString()} AED.`,
    });
  }

  return factors;
}

export function makeUnderwritingDecision(assessment: Assessment): {
  decision: 'approve' | 'deny' | 'review';
  reason: string;
  riskScore: number;
} {
  const riskScore = calculateRiskScore(assessment);
  const factors = getRiskFactors(assessment);
  
  // Automatic Denial Conditions
  if (assessment.driverDetails.previousAccidents > 3) {
    return {
      decision: 'deny',
      reason: 'Too many previous accidents (more than 3)',
      riskScore
    };
  }

  if (assessment.driverDetails.age < 18) {
    return {
      decision: 'deny',
      reason: 'Driver below minimum age requirement',
      riskScore
    };
  }

  // Coverage Requirements Check
  const coverageLimit = COVERAGE_LIMITS[assessment.coverageDetails.type];
  if (assessment.coverageDetails.amount < coverageLimit.min) {
    return {
      decision: 'deny',
      reason: `Coverage amount below minimum requirement of ${coverageLimit.min.toLocaleString()} AED`,
      riskScore
    };
  }

  // Risk-based Decisions
  if (riskScore <= 0.3) {
    return {
      decision: 'approve',
      reason: 'Low risk profile with adequate coverage',
      riskScore
    };
  }

  if (riskScore <= 0.6) {
    return {
      decision: 'review',
      reason: 'Moderate risk requires underwriter review',
      riskScore
    };
  }

  return {
    decision: 'deny',
    reason: 'High risk profile exceeds acceptable threshold',
    riskScore
  };
}

export function generateRecommendations(assessment: Assessment): string[] {
  const recommendations: string[] = [];
  const riskFactors = getRiskFactors(assessment);
  const coverageLimit = COVERAGE_LIMITS[assessment.coverageDetails.type];

  // Coverage Recommendations
  if (assessment.coverageDetails.amount < coverageLimit.recommended) {
    recommendations.push(
      `Consider increasing coverage to recommended level of ${coverageLimit.recommended.toLocaleString()} AED`
    );
  }

  // Driver Risk Recommendations
  if (assessment.driverDetails.age < 25) {
    recommendations.push('Complete defensive driving course');
    recommendations.push('Install telematics device for monitoring');
  }

  if (assessment.driverDetails.experience < 2) {
    recommendations.push('Additional driver training required');
    recommendations.push('Consider higher deductibles');
  }

  if (assessment.driverDetails.previousAccidents > 0) {
    recommendations.push('Submit detailed accident history reports');
    recommendations.push('Provide evidence of corrective measures taken');
  }

  // Vehicle Recommendations
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  if (vehicleAge > 10) {
    recommendations.push('Complete comprehensive vehicle inspection');
    recommendations.push('Provide maintenance history documentation');
  }

  // Additional Coverage Recommendations
  const missingCoverages = [
    'Personal Accident Cover',
    'Roadside Assistance',
    'Natural Disaster Coverage'
  ].filter(coverage => !assessment.coverageDetails.additionalCoverages.includes(coverage));

  if (missingCoverages.length > 0) {
    recommendations.push(`Consider adding additional coverage: ${missingCoverages.join(', ')}`);
  }

  return recommendations;
}