import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { useWorkflowStore } from '../../store/useWorkflowStore';
import { WorkflowStatus, WorkflowStage } from '../../types/workflow';
import { formatDate } from '../../utils/formatters';

interface WorkflowTrackerProps {
  assessmentId: string;
}

const stageLabels: Record<WorkflowStage, string> = {
  document_verification: 'Document Verification',
  risk_assessment: 'Risk Assessment',
  compliance_check: 'Compliance Check',
  underwriter_review: 'Underwriter Review',
  final_decision: 'Final Decision',
};

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ assessmentId }) => {
  const steps = useWorkflowStore((state) => state.getStepsByAssessment(assessmentId));
  const currentStage = useWorkflowStore((state) => state.getCurrentStage(assessmentId));

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Workflow Progress</h3>
      
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-4 rounded-lg border ${
              step.stage === currentStage
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{stageLabels[step.stage]}</h4>
                {step.assignedTo && (
                  <p className="text-sm text-gray-600 mt-1">
                    Assigned to: {step.assignedTo}
                  </p>
                )}
              </div>
              {getStatusIcon(step.status)}
            </div>

            {step.comments && (
              <p className="mt-2 text-sm text-gray-600">{step.comments}</p>
            )}

            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
              <span>Started: {formatDate(step.startedAt)}</span>
              {step.completedAt && (
                <span>Completed: {formatDate(step.completedAt)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTracker;