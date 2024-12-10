import React from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { formatDate } from '../../utils/formatters';

interface HistoryEntry {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'reassessment_request' | 'document_update' | 'comment';
  details: string;
  user: string;
}

interface AssessmentHistoryProps {
  assessment: Assessment;
  history: HistoryEntry[];
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({
  assessment,
  history,
}) => {
  const getStatusIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'status_change':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'reassessment_request':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'document_update':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Assessment History</h3>

      <div className="space-y-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-start space-x-3 bg-white p-4 rounded-lg shadow-sm"
          >
            {getStatusIcon(entry.type)}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {entry.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {formatDate(entry.timestamp)}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">{entry.user}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentHistory;