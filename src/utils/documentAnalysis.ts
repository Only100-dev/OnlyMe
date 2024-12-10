import { Document } from '../types/document';
import * as tf from '@tensorflow/tfjs';
import Tesseract from 'tesseract.js';

export async function analyzeDocument(document: Document) {
  const result = {
    text: '',
    metadata: {},
    classification: '',
    confidence: 0,
    validationResults: [],
  };

  try {
    // Extract text using Tesseract.js
    const { data } = await Tesseract.recognize(document.url, 'eng');
    result.text = data.text;
    result.confidence = data.confidence / 100;

    // Classify document type
    result.classification = await classifyDocument(data.text);

    // Extract metadata based on document type
    result.metadata = extractMetadata(data.text, document.category);

    // Validate document
    result.validationResults = validateDocument(result);

    return result;
  } catch (error) {
    console.error('Document analysis failed:', error);
    throw error;
  }
}

async function classifyDocument(text: string): Promise<string> {
  // Load pre-trained model
  const model = await tf.loadLayersModel('/models/document-classifier.json');
  
  // Preprocess text and make prediction
  const prediction = await model.predict(preprocessText(text));
  const probabilities = await prediction.data();
  
  // Get highest probability class
  const classIndex = probabilities.indexOf(Math.max(...probabilities));
  const documentTypes = ['license', 'registration', 'insurance', 'inspection'];
  
  return documentTypes[classIndex];
}

function extractMetadata(text: string, category: string): Record<string, string> {
  const metadata: Record<string, string> = {};

  const patterns = {
    driver_license: {
      name: /Name:\s*([^\n]+)/i,
      number: /License No:\s*([^\n]+)/i,
      expiry: /Expiry Date:\s*([^\n]+)/i,
    },
    vehicle_registration: {
      plate: /Plate No:\s*([^\n]+)/i,
      vin: /VIN:\s*([^\n]+)/i,
      make: /Make:\s*([^\n]+)/i,
      model: /Model:\s*([^\n]+)/i,
    },
    insurance_policy: {
      policy: /Policy No:\s*([^\n]+)/i,
      insurer: /Insurer:\s*([^\n]+)/i,
      coverage: /Coverage:\s*([^\n]+)/i,
    },
  };

  const categoryPatterns = patterns[category as keyof typeof patterns] || {};
  
  for (const [key, pattern] of Object.entries(categoryPatterns)) {
    const match = text.match(pattern);
    if (match) {
      metadata[key] = match[1].trim();
    }
  }

  return metadata;
}

function validateDocument(result: any): string[] {
  const validationResults = [];

  // Check confidence score
  if (result.confidence < 0.8) {
    validationResults.push('Low confidence in text extraction');
  }

  // Check required fields based on document type
  const requiredFields = {
    driver_license: ['name', 'number', 'expiry'],
    vehicle_registration: ['plate', 'vin', 'make', 'model'],
    insurance_policy: ['policy', 'insurer', 'coverage'],
  };

  const documentType = result.classification;
  const required = requiredFields[documentType as keyof typeof requiredFields] || [];
  
  for (const field of required) {
    if (!result.metadata[field]) {
      validationResults.push(`Missing required field: ${field}`);
    }
  }

  return validationResults;
}

function preprocessText(text: string): tf.Tensor {
  // Convert text to lowercase and remove special characters
  const processed = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Convert to tensor
  return tf.tensor2d([Array.from(processed)]);
}