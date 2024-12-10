import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { formatDate } from '../../utils/formatters';

interface AssessmentStatusProps {
  assessment: Assessment;
}

const AssessmentStatus: React.FC<AssessmentStatusProps> = ({ assessment }) => {
  const getStatusIcon = () => {
    switch (assessment.status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (assessment.status) {
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'denied':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium capitalize">{assessment.status}</span>
        </div>
        <div className="text-sm">
          Last Updated: {formatDate(assessment.updatedAt)}
        </div>
      </div>
      
      {assessment.comments && (
        <p className="mt-2 text-sm">{assessment.comments}</p>
      )}
    </div>
  );
};

export default AssessmentStatus;