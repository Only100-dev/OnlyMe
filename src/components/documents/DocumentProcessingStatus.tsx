import React from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Document } from '../../types/document';

interface DocumentProcessingStatusProps {
  document: Document;
  processingStatus: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress?: number;
    error?: string;
    results?: {
      confidence: number;
      fields: Record<string, string>;
    };
  };
}

const DocumentProcessingStatus: React.FC<DocumentProcessingStatusProps> = ({
  document,
  processingStatus,
}) => {
  const getStatusIcon = () => {
    switch (processingStatus.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium capitalize">
            {processingStatus.status}
          </span>
        </div>
        {processingStatus.progress !== undefined && (
          <span className="text-sm text-gray-500">
            {Math.round(processingStatus.progress)}%
          </span>
        )}
      </div>

      {processingStatus.status === 'processing' && (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${processingStatus.progress}%` }}
          />
        </div>
      )}

      {processingStatus.status === 'completed' && processingStatus.results && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">
              Extraction Results
            </span>
            <span className="text-sm text-green-600">
              {Math.round(processingStatus.results.confidence)}% confidence
            </span>
          </div>
          <div className="space-y-2">
            {Object.entries(processingStatus.results.fields).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {processingStatus.status === 'failed' && processingStatus.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <span className="text-sm text-red-600">{processingStatus.error}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessingStatus;