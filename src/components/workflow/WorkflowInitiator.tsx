import React from 'react';
import { useWorkflow } from '../../hooks/useWorkflow';
import Button from '../ui/Button';
import { Play } from 'lucide-react';

interface WorkflowInitiatorProps {
  assessmentId: string;
}

const WorkflowInitiator: React.FC<WorkflowInitiatorProps> = ({ assessmentId }) => {
  const { initializeWorkflow } = useWorkflow(assessmentId);

  return (
    <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Start Assessment Workflow</h3>
      <p className="text-gray-600 mb-6">
        Initialize the assessment process to begin evaluation
      </p>
      <Button
        onClick={initializeWorkflow}
        className="flex items-center justify-center space-x-2"
      >
        <Play className="w-4 h-4" />
        <span>Start Assessment</span>
      </Button>
    </div>
  );
};

export default WorkflowInitiator;