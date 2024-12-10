import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
}) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files).filter((file) => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return (
          acceptedTypes.includes(extension) && file.size <= maxSize * 1024 * 1024
        );
      });

      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload, maxSize, acceptedTypes]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        return (
          acceptedTypes.includes(extension) && file.size <= maxSize * 1024 * 1024
        );
      });

      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload, maxSize, acceptedTypes]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Required Documents</h3>
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <span className="text-sm font-medium text-gray-900">
            Drop files here or click to upload
          </span>
          <span className="text-xs text-gray-500 mt-1">
            Supported formats: {acceptedTypes.join(', ')} (Max {maxSize}MB)
          </span>
        </label>
      </div>
    </div>
  );
};

export default DocumentUpload;