import React from 'react';
import { FileText, Download, Mail, Share2 } from 'lucide-react';
import { Assessment } from '../../types/assessment';
import { generateAssessmentPDF } from '../../utils/pdfExport';
import { useAuditLogger } from '../../hooks/useAuditLogger';
import Button from '../ui/Button';
import RiskVisualization from './RiskVisualization';
import ComplianceChart from './ComplianceChart';
import RecommendationsList from './RecommendationsList';

interface EnhancedResultsViewerProps {
  assessment: Assessment;
}

const EnhancedResultsViewer: React.FC<EnhancedResultsViewerProps> = ({ assessment }) => {
  const logAction = useAuditLogger();

  const handleExport = async (format: 'pdf' | 'email' | 'excel') => {
    try {
      switch (format) {
        case 'pdf':
          await generateAssessmentPDF(assessment);
          break;
        case 'email':
          // Implement email export
          break;
        case 'excel':
          // Implement Excel export
          break;
      }

      logAction('assessment_exported', {
        assessmentId: assessment.id,
        format,
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assessment Results</h2>
        <div className="flex space-x-3">
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
            <span>Email Report</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Results</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RiskVisualization assessment={assessment} />
        <ComplianceChart assessment={assessment} />
      </div>

      <RecommendationsList assessment={assessment} />
    </div>
  );
};

export default EnhancedResultsViewer;