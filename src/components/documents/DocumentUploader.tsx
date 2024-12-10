import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { DocumentCategory } from '../../types/document';
import { useDocumentStore } from '../../store/useDocumentStore';

interface DocumentUploaderProps {
  category: DocumentCategory;
  onUpload?: (files: File[]) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  category,
  onUpload,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
}) => {
  const addDocument = useDocumentStore((state) => state.addDocument);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newDocuments = acceptedFiles.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        category,
        status: 'pending' as const,
        url: URL.createObjectURL(file),
      }));

      newDocuments.forEach((doc) => addDocument(doc));
      if (onUpload) {
        onUpload(acceptedFiles);
      }
    },
    [category, addDocument, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : isDragReject
          ? 'border-red-500 bg-red-50'
          : 'border-gray-300 hover:border-blue-500'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        {isDragReject ? (
          <>
            <X className="h-12 w-12 text-red-400 mb-4" />
            <span className="text-sm font-medium text-red-600">
              File type not supported
            </span>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-sm font-medium text-gray-900">
              Drop files here or click to upload
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Supported formats: {acceptedTypes.join(', ')} (Max {maxSize}MB)
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;