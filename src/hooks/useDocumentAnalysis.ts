import { useState, useCallback } from 'react';
import { Document } from '../types/document';
import { useAuditLogger } from './useAuditLogger';

interface AnalysisResult {
  extracted: Record<string, any>;
  compliance: string[];
  warnings: string[];
  loading: boolean;
  error: string | null;
}

export function useDocumentAnalysis() {
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});
  const logAction = useAuditLogger();

  const analyzeDocument = useCallback(async (document: Document) => {
    setResults((prev) => ({
      ...prev,
      [document.id]: {
        extracted: {},
        compliance: [],
        warnings: [],
        loading: true,
        error: null,
      },
    }));

    try {
      // Simulate document analysis with different results based on document type
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result: AnalysisResult = {
        extracted: {},
        compliance: [],
        warnings: [],
        loading: false,
        error: null,
      };

      switch (document.category) {
        case 'driver_license':
          result.extracted = {
            name: 'Sample Name',
            licenseNumber: 'DL-123456',
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            issueDate: new Date(),
          };
          break;

        case 'vehicle_registration':
          result.extracted = {
            plateNumber: 'ABC-1234',
            make: 'Toyota',
            model: 'Camry',
            year: 2023,
            chassisNumber: 'CHASIS123456789',
          };
          break;

        case 'insurance_policy':
          result.extracted = {
            policyNumber: 'POL-123456',
            insurer: 'Sample Insurance Co.',
            startDate: new Date(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            coverage: ['Third Party', 'Comprehensive'],
          };
          break;
      }

      // Add sample compliance checks and warnings
      if (document.type !== 'application/pdf') {
        result.warnings.push('Document should be in PDF format for better analysis');
      }

      if (document.size > 5 * 1024 * 1024) {
        result.warnings.push('Large file size may affect processing time');
      }

      setResults((prev) => ({
        ...prev,
        [document.id]: result,
      }));

      logAction('document_analyzed', {
        documentId: document.id,
        category: document.category,
        warnings: result.warnings.length,
      });

      return result;
    } catch (error) {
      const errorResult = {
        extracted: {},
        compliance: [],
        warnings: [],
        loading: false,
        error: 'Failed to analyze document',
      };

      setResults((prev) => ({
        ...prev,
        [document.id]: errorResult,
      }));

      logAction('document_analysis_failed', {
        documentId: document.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return errorResult;
    }
  }, [logAction]);

  const getAnalysisResult = useCallback((documentId: string) => {
    return results[documentId];
  }, [results]);

  return {
    analyzeDocument,
    getAnalysisResult,
    results,
  };
}