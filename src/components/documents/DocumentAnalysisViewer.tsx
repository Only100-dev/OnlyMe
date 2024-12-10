import React from 'react';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Document } from '../../types/document';
import { useDocumentAnalysis } from '../../hooks/useDocumentAnalysis';

interface DocumentAnalysisViewerProps {
  document: Document;
}

const DocumentAnalysisViewer: React.FC<DocumentAnalysisViewerProps> = ({ document }) => {
  const { getAnalysisResult, analyzeDocument } = useDocumentAnalysis();
  const result = getAnalysisResult(document.id);

  React.useEffect(() => {
    if (!result) {
      analyzeDocument(document);
    }
  }, [document, result, analyzeDocument]);

  if (!result || result.loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Document Analysis</h3>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Confidence Score</span>
          <span className="text-sm">{Math.round(result.confidence * 100)}%</span>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Extracted Information</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(result.metadata).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {result.validationResults.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">Validation Issues</span>
            </div>
            <ul className="space-y-1">
              {result.validationResults.map((issue: string, index: number) => (
                <li key={index} className="text-sm text-yellow-600">• {issue}</li>
              ))}
            </ul>
          </div>
        )}

        {result.validationResults.length === 0 && (
          <div className="bg-green-50 rounded-lg p-3 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700">Document validation passed</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalysisViewer;