import React from 'react';
import { Clock, Filter } from 'lucide-react';
import { useAuditStore } from '../../store/useAuditStore';
import { formatDate } from '../../utils/formatters';
import { AuditAction } from '../../types/audit';

const actionLabels: Record<AuditAction, string> = {
  assessment_created: 'Assessment Created',
  assessment_updated: 'Assessment Updated',
  assessment_approved: 'Assessment Approved',
  assessment_denied: 'Assessment Denied',
  document_uploaded: 'Document Uploaded',
  document_deleted: 'Document Deleted',
  compliance_check: 'Compliance Check',
  risk_assessment: 'Risk Assessment',
};

const AuditLogViewer: React.FC = () => {
  const [selectedAction, setSelectedAction] = React.useState<AuditAction | 'all'>('all');
  const logs = useAuditStore((state) => 
    selectedAction === 'all' 
      ? state.getLogs() 
      : state.getLogs({ action: selectedAction })
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Audit Log</h2>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value as AuditAction | 'all')}
            className="text-sm border rounded-md px-2 py-1"
          >
            <option value="all">All Actions</option>
            {Object.entries(actionLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-medium">
                  {actionLabels[log.action]}
                </span>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(log.timestamp)}</span>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                User: {log.userId}
              </span>
            </div>

            {Object.entries(log.details).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Details
                </h4>
                <pre className="text-sm bg-gray-50 p-2 rounded">
                  {JSON.stringify(log.details, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogViewer;