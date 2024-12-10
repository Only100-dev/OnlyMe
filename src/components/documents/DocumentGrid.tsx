import React from 'react';
import { FileText, Download, Trash2, Edit2 } from 'lucide-react';
import { Document } from '../../types/document';
import { formatDate, formatFileSize } from '../../utils/formatters';

interface DocumentGridProps {
  documents: Document[];
  onDelete?: (id: string) => void;
  onEdit?: (document: Document) => void;
  onDownload?: (document: Document) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  onDelete,
  onEdit,
  onDownload,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 line-clamp-1" title={doc.name}>
                  {doc.name}
                </h4>
                <p className="text-sm text-gray-500">{formatFileSize(doc.size)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(doc)}
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              {onDownload && (
                <button
                  onClick={() => onDownload(doc)}
                  className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(doc.id)}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Uploaded</span>
              <span>{formatDate(doc.uploadedAt)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Category</span>
              <span className="capitalize">{doc.category.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentGrid;