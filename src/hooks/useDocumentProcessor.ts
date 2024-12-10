import { useState, useCallback } from 'react';
import { Document } from '../types/document';
import { processDocument, validateDocumentCompliance } from '../utils/documentProcessor';
import { useAuditLogger } from './useAuditLogger';

interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
  results?: {
    confidence: number;
    fields: Record<string, string>;
  };
}

export function useDocumentProcessor() {
  const [processingStatus, setProcessingStatus] = useState<Record<string, ProcessingStatus>>({});
  const logAction = useAuditLogger();

  const processDocuments = useCallback(async (documents: Document[]) => {
    for (const document of documents) {
      setProcessingStatus((prev) => ({
        ...prev,
        [document.id]: { status: 'processing', progress: 0 },
      }));

      try {
        // Simulate processing progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setProcessingStatus((prev) => ({
            ...prev,
            [document.id]: { ...prev[document.id], progress },
          }));
        }

        const result = await processDocument(document);

        setProcessingStatus((prev) => ({
          ...prev,
          [document.id]: {
            status: 'completed',
            results: {
              confidence: result.confidence,
              fields: result.fields,
            },
          },
        }));

        logAction('document_processed', {
          documentId: document.id,
          category: document.category,
          confidence: result.confidence,
        });
      } catch (error) {
        setProcessingStatus((prev) => ({
          ...prev,
          [document.id]: {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Processing failed',
          },
        }));

        logAction('document_processing_failed', {
          documentId: document.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }, [logAction]);

  const getStatus = useCallback((documentId: string) => {
    return processingStatus[documentId];
  }, [processingStatus]);

  return {
    processDocuments,
    getStatus,
    processingStatus,
  };
};