import React, { useState } from 'react';
import { FileText, Download, Trash2, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/Button';
import { processDocument } from '../../utils/documentProcessor';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface DocumentManagerProps {
  assessmentId: string;
  onDocumentsUpdate: (files: File[]) => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ assessmentId, onDocumentsUpdate }) => {
  const [documents, setDocuments] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const logAction = useAuditLogger();

  const onDrop = async (acceptedFiles: File[]) => {
    setProcessing(true);
    try {
      const processedDocs = await Promise.all(
        acceptedFiles.map(async (file) => {
          await processDocument({ ...file, id: file.name, category: 'other', status: 'pending', uploadedAt: new Date(), url: URL.createObjectURL(file) });
          return file;
        })
      );

      setDocuments((prev) => [...prev, ...processedDocs]);
      onDocumentsUpdate([...documents, ...processedDocs]);
      
      logAction('documents_uploaded', {
        assessmentId,
        count: acceptedFiles.length,
      });
    } catch (error) {
      console.error('Document processing failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeDocument = (index: number) => {
    const newDocs = documents.filter((_, i) => i !== index);
    setDocuments(newDocs);
    onDocumentsUpdate(newDocs);
    
    logAction('document_removed', {
      assessmentId,
      documentIndex: index,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          {...getRootProps()}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Documents</span>
        </Button>
      </div>

      <input {...getInputProps()} />

      <div
        className={`border-2 border-dashed rounded-lg p-8 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        } ${processing ? 'opacity-50' : ''}`}
      >
        {processing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2" />
            <p className="text-sm text-gray-600">Processing documents...</p>
          </div>
        ) : isDragActive ? (
          <p className="text-center text-blue-600">Drop files here...</p>
        ) : (
          <p className="text-center text-gray-600">
            Drag and drop files here, or click the upload button
          </p>
        )}
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">{doc.name}</span>
                <span className="text-sm text-gray-500">
                  ({Math.round(doc.size / 1024)} KB)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.open(URL.createObjectURL(doc))}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeDocument(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentManager;