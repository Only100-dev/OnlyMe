import React from 'react';
import { XCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: Record<string, string[]>;
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-red-800">Please correct the following errors:</h4>
          <ul className="mt-2 space-y-1">
            {Object.entries(errors).map(([field, messages]) => (
              <li key={field} className="text-sm text-red-700">
                {messages.map((message, index) => (
                  <div key={index}>• {message}</div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationErrors;