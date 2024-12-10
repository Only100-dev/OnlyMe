import React from 'react';
import { FileText, Download, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Document } from '../../types/document';
import { formatDate } from '../../utils/formatters';

interface DocumentListProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onDownload?: (document: Document) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onDelete,
  onDownload,
}) => {
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{doc.name}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatFileSize(doc.size)}</span>
                <span>•</span>
                <span>{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusIcon(doc.status)}
            
            <button
              onClick={() => onDownload?.(doc)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {onDelete && (
              <button
                onClick={() => onDelete(doc.id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;