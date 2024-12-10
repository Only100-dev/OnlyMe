import { Document } from '../types/document';
import * as tf from '@tensorflow/tfjs';
import Tesseract from 'tesseract.js';

interface ProcessingResult {
  text: string;
  metadata: Record<string, any>;
  classification: string;
  confidence: number;
  validationResults: string[];
  securityCheck: SecurityCheckResult;
}

interface SecurityCheckResult {
  isValid: boolean;
  issues: string[];
  signatureDetected: boolean;
  tampering: boolean;
}

export async function processDocument(document: Document): Promise<ProcessingResult> {
  try {
    // Extract text using OCR
    const textResult = await extractText(document);
    
    // Classify document
    const classification = await classifyDocument(textResult.text);
    
    // Extract metadata
    const metadata = extractMetadata(textResult.text, document.category);
    
    // Perform security checks
    const securityCheck = await performSecurityCheck(document);
    
    // Validate document
    const validationResults = validateDocument({
      text: textResult.text,
      metadata,
      classification,
      securityCheck,
    });

    return {
      text: textResult.text,
      metadata,
      classification,
      confidence: textResult.confidence,
      validationResults,
      securityCheck,
    };
  } catch (error) {
    console.error('Document processing failed:', error);
    throw new Error('Failed to process document');
  }
}

async function extractText(document: Document): Promise<{ text: string; confidence: number }> {
  if (document.type.startsWith('image/')) {
    const result = await Tesseract.recognize(document.url, 'eng', {
      logger: m => console.log(m)
    });
    return {
      text: result.data.text,
      confidence: result.data.confidence / 100,
    };
  }
  
  // For PDFs and other document types
  return {
    text: 'Sample text extraction',
    confidence: 0.9,
  };
}

async function classifyDocument(text: string): Promise<string> {
  // Load pre-trained model
  const model = await tf.loadLayersModel('/models/document-classifier.json');
  
  // Preprocess text
  const processedText = preprocessText(text);
  
  // Make prediction
  const prediction = await model.predict(processedText) as tf.Tensor;
  const probabilities = await prediction.data();
  
  // Cleanup
  prediction.dispose();
  processedText.dispose();
  
  // Get highest probability class
  const classIndex = probabilities.indexOf(Math.max(...probabilities));
  const documentTypes = ['license', 'registration', 'insurance', 'inspection'];
  
  return documentTypes[classIndex];
}

function preprocessText(text: string): tf.Tensor {
  // Convert text to lowercase and remove special characters
  const processed = text.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Convert to tensor
  return tf.tensor2d([Array.from(processed)]);
}

function extractMetadata(text: string, category: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  const patterns = {
    driver_license: {
      name: /Name:\s*([^\n]+)/i,
      number: /License No:\s*([^\n]+)/i,
      expiry: /Expiry Date:\s*([^\n]+)/i,
      nationality: /Nationality:\s*([^\n]+)/i,
    },
    vehicle_registration: {
      plate: /Plate No:\s*([^\n]+)/i,
      vin: /VIN:\s*([^\n]+)/i,
      make: /Make:\s*([^\n]+)/i,
      model: /Model:\s*([^\n]+)/i,
      year: /Year:\s*([^\n]+)/i,
    },
    insurance_policy: {
      policy: /Policy No:\s*([^\n]+)/i,
      insurer: /Insurer:\s*([^\n]+)/i,
      coverage: /Coverage:\s*([^\n]+)/i,
      premium: /Premium:\s*([^\n]+)/i,
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

async function performSecurityCheck(document: Document): Promise<SecurityCheckResult> {
  const result: SecurityCheckResult = {
    isValid: true,
    issues: [],
    signatureDetected: false,
    tampering: false,
  };

  // Check file integrity
  if (document.size === 0) {
    result.isValid = false;
    result.issues.push('Invalid file size');
  }

  // Check file type
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!validTypes.includes(document.type)) {
    result.isValid = false;
    result.issues.push('Invalid file type');
  }

  // Additional security checks can be implemented here
  
  return result;
}

function validateDocument(result: any): string[] {
  const validationResults: string[] = [];

  // Check confidence score
  if (result.confidence < 0.8) {
    validationResults.push('Low confidence in text extraction');
  }

  // Check required fields
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

  // Check security issues
  if (!result.securityCheck.isValid) {
    validationResults.push(...result.securityCheck.issues);
  }

  return validationResults;
}