import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAssessmentStore } from '../store/useAssessmentStore';
import AssessmentSummary from '../components/assessment/AssessmentSummary';
import RiskModelResults from '../components/assessment/RiskModelResults';
import DocumentList from '../components/documents/DocumentList';
import WorkflowTracker from '../components/workflow/WorkflowTracker';
import AssessmentActions from '../components/assessment/AssessmentActions';
import CommentsSection from '../components/assessment/CommentsSection';
import Button from '../components/ui/Button';
import { CommentFormData } from '../types/assessment';
import { useAuditLogger } from '../hooks/useAuditLogger';

const AssessmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const logAction = useAuditLogger();
  
  const { assessment, addComment } = useAssessmentStore((state) => ({
    assessment: state.assessments.find((a) => a.id === id),
    addComment: state.addComment,
  }));

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-semibold mb-4">Assessment Not Found</h2>
        <Button onClick={() => navigate('/')} variant="outline">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const handleAddComment = (data: CommentFormData) => {
    addComment(assessment.id, data);
    logAction('comment_added', {
      assessmentId: assessment.id,
      isInternal: data.isInternal,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Assessment Details</h1>
            <p className="text-gray-600">
              Tracking Number: {assessment.trackingNumber}
            </p>
          </div>
        </div>
        <AssessmentActions assessment={assessment} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <AssessmentSummary assessment={assessment} />
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Documents</h3>
            <DocumentList
              documents={assessment.documents.map((name) => ({
                id: name,
                name,
                type: 'application/pdf',
                size: 0,
                uploadedAt: new Date(),
                category: 'other',
                status: 'pending',
                url: '#',
              }))}
            />
          </div>

          <RiskModelResults assessment={assessment} />
          
          <CommentsSection
            comments={assessment.comments}
            onAddComment={handleAddComment}
          />
        </div>

        <div className="space-y-8">
          <WorkflowTracker
            assessmentId={assessment.id}
            steps={[]} // Add workflow steps here
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetails;