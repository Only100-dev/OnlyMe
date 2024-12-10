import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Upload, File, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const requiredDocuments = [
  { type: 'driver_license', label: "Driver's License" },
  { type: 'vehicle_registration', label: 'Vehicle Registration' },
  { type: 'insurance_certificate', label: 'Insurance Certificate' },
];

const DocumentStep: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const documents = watch('documents') || [];

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setValue('documents', [...documents, ...acceptedFiles]);
  }, [documents, setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeDocument = (index: number) => {
    setValue('documents', documents.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Required Documents</h3>

      <div className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Required Documents:</h4>
          <ul className="list-disc list-inside text-sm text-yellow-700">
            {requiredDocuments.map((doc) => (
              <li key={doc.type}>{doc.label}</li>
            ))}
          </ul>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop files here, or click to select files
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>

        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((file: File, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentStep;