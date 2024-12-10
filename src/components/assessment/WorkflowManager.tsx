import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import { Assessment } from '../../types/assessment';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface WorkflowManagerProps {
  assessment: Assessment;
  onStatusChange: (status: Assessment['status']) => void;
}

const WorkflowManager: React.FC<WorkflowManagerProps> = ({ assessment, onStatusChange }) => {
  const { getCurrentStage, progressWorkflow } = useWorkflow(assessment.id);
  const logAction = useAuditLogger();
  const currentStage = getCurrentStage();

  const handleAction = async (action: 'approve' | 'deny') => {
    try {
      await progressWorkflow(
        assessment.id,
        action === 'approve' ? 'completed' : 'rejected',
        `Assessment ${action}d by underwriter`
      );

      onStatusChange(action === 'approve' ? 'approved' : 'denied');
      
      logAction('assessment_status_changed', {
        assessmentId: assessment.id,
        status: action,
        stage: currentStage,
      });
    } catch (error) {
      console.error('Workflow action failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {assessment.status === 'approved' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : assessment.status === 'denied' ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
          <span className="font-medium capitalize">{assessment.status}</span>
        </div>

        {assessment.status === 'pending' && (
          <div className="flex space-x-3">
            <Button
              onClick={() => handleAction('deny')}
              variant="outline"
              className="text-red-600 hover:bg-red-50"
            >
              Deny
            </Button>
            <Button
              onClick={() => handleAction('approve')}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium mb-2">Current Stage: {currentStage}</h4>
        <div className="text-sm text-gray-600">
          {assessment.status === 'pending' ? (
            <p>This assessment is awaiting review and approval.</p>
          ) : assessment.status === 'approved' ? (
            <p>This assessment has been approved and processed.</p>
          ) : (
            <p>This assessment has been denied. A new assessment may be required.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowManager;