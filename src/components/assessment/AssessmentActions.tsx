import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import Button from '../ui/Button';
import { Assessment } from '../../types/assessment';
import { useAssessmentStore } from '../../store/useAssessmentStore';
import { generateAssessmentPDF } from '../../utils/pdfExport';

interface AssessmentActionsProps {
  assessment: Assessment;
}

const AssessmentActions: React.FC<AssessmentActionsProps> = ({ assessment }) => {
  const navigate = useNavigate();
  const updateAssessment = useAssessmentStore((state) => state.updateAssessment);

  const handleStatusUpdate = (status: Assessment['status']) => {
    updateAssessment(assessment.id, {
      status,
      updatedAt: new Date(),
    });
  };

  const handleExportPDF = () => {
    generateAssessmentPDF(assessment);
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        onClick={handleExportPDF}
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </Button>

      {assessment.status === 'pending' && (
        <>
          <Button
            onClick={() => handleStatusUpdate('approved')}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </Button>

          <Button
            onClick={() => handleStatusUpdate('denied')}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            <XCircle className="w-4 h-4" />
            <span>Deny</span>
          </Button>
        </>
      )}
    </div>
  );
};

export default AssessmentActions;