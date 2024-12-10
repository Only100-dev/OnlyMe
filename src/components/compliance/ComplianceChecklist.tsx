import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { ComplianceCheck } from '../../types/compliance';
import { useComplianceStore } from '../../store/useComplianceStore';
import { formatDate } from '../../utils/formatters';

interface ComplianceChecklistProps {
  assessmentId: string;
}

const ComplianceChecklist: React.FC<ComplianceChecklistProps> = ({ assessmentId }) => {
  const { regulations, getChecksByAssessment } = useComplianceStore();
  const checks = getChecksByAssessment(assessmentId);

  const getStatusIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'non_compliant':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Compliance Checklist</h3>
      
      <div className="space-y-4">
        {checks.map((check) => {
          const regulation = regulations.find((r) => r.id === check.regulationId);
          if (!regulation) return null;

          return (
            <div
              key={check.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{regulation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {regulation.description}
                  </p>
                </div>
                {getStatusIcon(check.status)}
              </div>

              {check.details && (
                <p className={`mt-2 text-sm ${
                  check.status === 'non_compliant' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {check.details}
                </p>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last checked: {formatDate(check.checkedAt)}</span>
                  <span>Source: {regulation.source}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplianceChecklist;