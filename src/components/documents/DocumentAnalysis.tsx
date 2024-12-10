import React from 'react';
import { FileSearch, AlertTriangle } from 'lucide-react';
import { Document } from '../../types/document';
import { analyzeDocument } from '../../utils/documentAnalysis';

interface DocumentAnalysisProps {
  document: Document;
}

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ document }) => {
  const [analysis, setAnalysis] = React.useState<{
    extracted: Record<string, any>;
    compliance: string[];
    warnings: string[];
  } | null>(null);

  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const performAnalysis = async () => {
      setLoading(true);
      try {
        const result = await analyzeDocument(document);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing document:', error);
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [document]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Analyzing document...</div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileSearch className="w-5 h-5 text-blue-500" />
        <h4 className="font-medium">Document Analysis</h4>
      </div>

      {Object.keys(analysis.extracted).length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            Extracted Information
          </h5>
          <dl className="grid grid-cols-2 gap-2">
            {Object.entries(analysis.extracted).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm text-gray-500">{key}</dt>
                <dd className="text-sm font-medium">
                  {value instanceof Date ? value.toLocaleDateString() : value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {analysis.warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <h5 className="text-sm font-medium text-yellow-700">Warnings</h5>
          </div>
          <ul className="space-y-1">
            {analysis.warnings.map((warning, index) => (
              <li key={index} className="text-sm text-yellow-600">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentAnalysis;