import * as tf from '@tensorflow/tfjs';
import { Assessment } from '../types/assessment';

// Define the risk assessment model architecture
async function createModel() {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    inputShape: [10],
    units: 16,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 8,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'sigmoid'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

// Convert assessment data to tensor format
function preprocessAssessment(assessment: Assessment): tf.Tensor {
  const features = [
    assessment.driverDetails.age / 100, // Normalize age
    assessment.driverDetails.experience / 50, // Normalize experience
    assessment.driverDetails.previousAccidents / 5, // Normalize accidents
    (new Date().getFullYear() - assessment.vehicleYear) / 30, // Normalize vehicle age
    assessment.coverageDetails.amount / 1000000, // Normalize coverage amount
    assessment.coverageDetails.deductible / 10000, // Normalize deductible
    assessment.coverageDetails.type === 'comprehensive' ? 1 : 0,
    assessment.coverageDetails.type === 'collision' ? 1 : 0,
    assessment.coverageDetails.type === 'liability' ? 1 : 0,
    assessment.coverageDetails.additionalCoverages.length / 10 // Normalize additional coverages
  ];

  return tf.tensor2d([features]);
}

// Predict risk score using the model
export async function predictRiskScore(assessment: Assessment): Promise<number> {
  const model = await createModel();
  const input = preprocessAssessment(assessment);
  const prediction = await model.predict(input) as tf.Tensor;
  const score = (await prediction.data())[0];
  
  // Cleanup tensors
  input.dispose();
  prediction.dispose();
  
  return score;
}

// Analyze document features
export function analyzeDocumentFeatures(text: string): Record<string, any> {
  const features = {
    hasLicenseNumber: /license.{0,10}\d{5,}/i.test(text),
    hasVehicleInfo: /vehicle|car|model/i.test(text),
    hasDateInfo: /\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(text),
    hasMonetaryValue: /\$|AED|\d+,\d{3}/.test(text),
    documentQuality: calculateDocumentQuality(text)
  };

  return features;
}

// Calculate document quality score
function calculateDocumentQuality(text: string): number {
  const wordCount = text.split(/\s+/).length;
  const hasStructure = /^.+[\r\n].+$/m.test(text);
  const hasFormatting = /[A-Z][a-z]+:/.test(text);
  
  let score = 0;
  if (wordCount > 100) score += 0.3;
  if (hasStructure) score += 0.3;
  if (hasFormatting) score += 0.4;
  
  return score;
}

// Generate detailed risk analysis
export function generateRiskAnalysis(assessment: Assessment): {
  riskFactors: string[];
  recommendations: string[];
  complianceIssues: string[];
} {
  const riskFactors = [];
  const recommendations = [];
  const complianceIssues = [];

  // Analyze driver risk
  if (assessment.driverDetails.age < 25) {
    riskFactors.push('Young driver (under 25)');
    recommendations.push('Consider additional driver training programs');
  }

  if (assessment.driverDetails.previousAccidents > 0) {
    riskFactors.push(`${assessment.driverDetails.previousAccidents} previous accidents`);
    recommendations.push('Require defensive driving course completion');
  }

  // Analyze vehicle risk
  const vehicleAge = new Date().getFullYear() - assessment.vehicleYear;
  if (vehicleAge > 10) {
    riskFactors.push('Vehicle over 10 years old');
    recommendations.push('Request comprehensive vehicle inspection');
    complianceIssues.push('Vehicle age exceeds standard guidelines');
  }

  // Analyze coverage risk
  if (assessment.coverageDetails.amount < 250000) {
    riskFactors.push('Coverage amount below recommended minimum');
    complianceIssues.push('Coverage does not meet minimum requirements');
  }

  return {
    riskFactors,
    recommendations,
    complianceIssues
  };
}