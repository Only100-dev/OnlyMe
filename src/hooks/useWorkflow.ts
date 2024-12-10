import { useCallback } from 'react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { WorkflowStage, WorkflowStatus } from '../types/workflow';
import { useAuditLogger } from './useAuditLogger';
import { sendAssessmentNotification } from '../utils/notifications';

export function useWorkflow(assessmentId: string) {
  const { addStep, updateStep, getStepsByAssessment, getCurrentStage, escalateWorkflow } = useWorkflowStore();
  const logAction = useAuditLogger();

  const initializeWorkflow = useCallback(() => {
    const stages: WorkflowStage[] = [
      'document_verification',
      'risk_assessment',
      'compliance_check',
      'underwriter_review',
      'manager_approval',
      'final_decision',
      'client_notification'
    ];

    stages.forEach((stage, index) => {
      addStep({
        assessmentId,
        stage,
        status: index === 0 ? 'in_progress' : 'pending',
        assignedTo: 'system',
        priority: 'medium',
        requirements: [],
        documents: [],
      });
    });

    logAction('workflow_initialized', { assessmentId });
    sendAssessmentNotification({ id: assessmentId } as any, 'created');
  }, [assessmentId, addStep, logAction]);

  const progressWorkflow = useCallback(async (
    stepId: string,
    status: WorkflowStatus,
    comments?: string
  ) => {
    const steps = getStepsByAssessment(assessmentId);
    const currentIndex = steps.findIndex(step => step.id === stepId);
    
    // Update current step
    updateStep(stepId, {
      status,
      comments,
      completedAt: new Date()
    });

    // If step was completed successfully, start next step
    if (status === 'completed' && currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      updateStep(nextStep.id, {
        status: 'in_progress',
        startedAt: new Date()
      });

      // Send notification for next step
      await sendAssessmentNotification({ id: assessmentId } as any, 'updated');
    }

    logAction('workflow_progressed', {
      assessmentId,
      stepId,
      status,
      comments
    });
  }, [assessmentId, updateStep, getStepsByAssessment, logAction]);

  const handleEscalation = useCallback((reason: string) => {
    escalateWorkflow(assessmentId, reason);
    logAction('workflow_escalated', {
      assessmentId,
      reason
    });
  }, [assessmentId, escalateWorkflow, logAction]);

  return {
    initializeWorkflow,
    progressWorkflow,
    handleEscalation,
    getCurrentStage: () => getCurrentStage(assessmentId),
    getSteps: () => getStepsByAssessment(assessmentId)
  };
}