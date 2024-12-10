import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import { WorkflowStage } from '../../types/workflow';

interface WorkflowStageActionsProps {
  stage: WorkflowStage;
  onComplete: (approved: boolean, comments?: string) => void;
}

const WorkflowStageActions: React.FC<WorkflowStageActionsProps> = ({
  stage,
  onComplete,
}) => {
  const [comments, setComments] = React.useState('');

  return (
    <div className="space-y-4">
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Add comments about your decision..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        rows={3}
      />

      <div className="flex justify-end space-x-3">
        <Button
          onClick={() => onComplete(false, comments)}
          variant="outline"
          className="flex items-center space-x-2 text-red-600 hover:bg-red-50"
        >
          <XCircle className="w-4 h-4" />
          <span>Reject</span>
        </Button>
        <Button
          onClick={() => onComplete(true, comments)}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Approve</span>
        </Button>
      </div>
    </div>
  );
};

export default WorkflowStageActions;