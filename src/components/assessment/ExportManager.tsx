import React from 'react';
import { FileText, Download, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { Assessment } from '../../types/assessment';
import { generateAssessmentPDF } from '../../utils/pdfExport';
import { useAuditLogger } from '../../hooks/useAuditLogger';

interface ExportManagerProps {
  assessment: Assessment;
}

const ExportManager: React.FC<ExportManagerProps> = ({ assessment }) => {
  const logAction = useAuditLogger();

  const handleExport = async (format: 'pdf' | 'email') => {
    try {
      if (format === 'pdf') {
        await generateAssessmentPDF(assessment);
        logAction('assessment_exported', {
          assessmentId: assessment.id,
          format: 'pdf',
        });
      } else {
        // Implement email export functionality
        logAction('assessment_exported', {
          assessmentId: assessment.id,
          format: 'email',
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        onClick={() => handleExport('pdf')}
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>Export PDF</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => handleExport('email')}
        className="flex items-center space-x-2"
      >
        <Mail className="w-4 h-4" />
        <span>Send via Email</span>
      </Button>

      <Button
        onClick={() => window.print()}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Download className="w-4 h-4" />
        <span>Print</span>
      </Button>
    </div>
  );
};

export default ExportManager;