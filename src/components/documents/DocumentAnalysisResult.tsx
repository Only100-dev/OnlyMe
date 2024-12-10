import React from 'react';
import { AlertTriangle, CheckCircle2, FileSearch } from 'lucide-react';
import { Document } from '../../types/document';
import { useDocumentAnalysis } from '../../hooks/useDocumentAnalysis';
import { formatDate } from '../../utils/formatters';

interface DocumentAnalysisResultProps {
  document: Document;
}

const DocumentAnalysisResult: React.FC<DocumentAnalysisResultProps> = ({ document }) => {
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
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Analysis Failed</span>
        </div>
        <p className="mt-2 text-sm text-red-500">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileSearch className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium">Analysis Results</h4>
      </div>

      {Object.keys(result.extracted).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-3">
            Extracted Information
          </h5>
          <dl className="grid grid-cols-2 gap-4">
            {Object.entries(result.extracted).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm text-gray-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </dt>
                <dd className="text-sm font-medium">
                  {value instanceof Date ? formatDate(value) : value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h5 className="text-sm font-medium text-yellow-700">Warnings</h5>
          </div>
          <ul className="space-y-1">
            {result.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-600 flex items-start space-x-2">
                <span>•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.compliance.length > 0 && (
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <h5 className="text-sm font-medium text-green-700">Compliance Checks</h5>
          </div>
          <ul className="space-y-1">
            {result.compliance.map((check, index) => (
              <li key={index} className="text-sm text-green-600 flex items-start space-x-2">
                <span>•</span>
                <span>{check}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalysisResult;