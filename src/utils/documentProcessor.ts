import { Document } from '../types/document';
import * as pdfjs from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ExtractedData {
  text: string;
  fields: Record<string, string>;
  confidence: number;
}

export async function processDocument(document: Document): Promise<ExtractedData> {
  let text = '';
  let fields: Record<string, string> = {};
  let confidence = 0;

  try {
    if (document.type === 'application/pdf') {
      const result = await extractFromPDF(document);
      text = result.text;
      confidence = result.confidence;
    } else if (document.type.startsWith('image/')) {
      const result = await extractFromImage(document);
      text = result.text;
      confidence = result.confidence;
    }

    fields = extractFields(text, document.category);
    
    return { text, fields, confidence };
  } catch (error) {
    console.error('Document processing failed:', error);
    throw new Error('Failed to process document');
  }
}

async function extractFromPDF(document: Document): Promise<{ text: string; confidence: number }> {
  const pdf = await pdfjs.getDocument(document.url).promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item: any) => item.str).join(' ');
  }

  return {
    text: fullText,
    confidence: 0.9, // PDF text extraction usually has high confidence
  };
}

async function extractFromImage(document: Document): Promise<{ text: string; confidence: number }> {
  const result = await Tesseract.recognize(document.url, 'eng');
  
  return {
    text: result.data.text,
    confidence: result.data.confidence / 100,
  };
}

function extractFields(text: string, category: string): Record<string, string> {
  const fields: Record<string, string> = {};
  
  switch (category) {
    case 'driver_license':
      fields.name = extractPattern(text, /Name:\s*([^\n]+)/i);
      fields.licenseNumber = extractPattern(text, /License No:\s*([^\n]+)/i);
      fields.expiryDate = extractPattern(text, /Expiry Date:\s*([^\n]+)/i);
      break;
      
    case 'vehicle_registration':
      fields.plateNumber = extractPattern(text, /Plate No:\s*([^\n]+)/i);
      fields.make = extractPattern(text, /Make:\s*([^\n]+)/i);
      fields.model = extractPattern(text, /Model:\s*([^\n]+)/i);
      break;
      
    case 'insurance_policy':
      fields.policyNumber = extractPattern(text, /Policy No:\s*([^\n]+)/i);
      fields.coverage = extractPattern(text, /Coverage:\s*([^\n]+)/i);
      fields.premium = extractPattern(text, /Premium:\s*([^\n]+)/i);
      break;
  }
  
  return fields;
}

function extractPattern(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match ? match[1].trim() : '';
}