import React from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { WorkflowStatus } from '../../types/workflow';
import { formatDate } from '../../utils/formatters';

interface WorkflowProgressProps {
  assessmentId: string;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ assessmentId }) => {
  const { getSteps, getCurrentStage } = useWorkflow(assessmentId);
  const steps = getSteps();
  const currentStage = getCurrentStage();

  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Assessment Progress</h3>
      
      <div className="relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-start mb-8 ${
              index === steps.length - 1 ? '' : 'pb-8 border-l-2 border-gray-200 ml-2.5'
            }`}
          >
            <div className="absolute -left-1 mt-1.5">
              {getStatusIcon(step.status)}
            </div>
            
            <div className="ml-8">
              <h4 className="font-medium text-gray-900">{step.stage}</h4>
              {step.assignedTo && (
                <p className="text-sm text-gray-500">
                  Assigned to: {step.assignedTo}
                </p>
              )}
              {step.comments && (
                <p className="mt-1 text-sm text-gray-600">{step.comments}</p>
              )}
              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                <span>Started: {formatDate(step.startedAt)}</span>
                {step.completedAt && (
                  <span>Completed: {formatDate(step.completedAt)}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowProgress;