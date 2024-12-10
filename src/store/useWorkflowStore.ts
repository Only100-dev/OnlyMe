import { create } from 'zustand';
import { WorkflowStore, WorkflowStep, WorkflowStage } from '../types/workflow';

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  steps: [],

  addStep: (step) => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date(),
      ...step,
    };

    set((state) => ({
      steps: [...state.steps, newStep],
    }));
  },

  updateStep: (id, updates) => {
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
    }));
  },

  getStepsByAssessment: (assessmentId) => {
    return get().steps.filter((step) => step.assessmentId === assessmentId);
  },

  getCurrentStage: (assessmentId) => {
    const steps = get().steps.filter((step) => step.assessmentId === assessmentId);
    if (steps.length === 0) return null;

    const pendingStep = steps.find((step) => step.status !== 'completed');
    return pendingStep?.stage || null;
  },

  getWorkflowHistory: (assessmentId) => {
    return get().steps
      .filter((step) => step.assessmentId === assessmentId)
      .sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime());
  },

  escalateWorkflow: (assessmentId, reason) => {
    const currentStage = get().getCurrentStage(assessmentId);
    if (!currentStage) return;

    const steps = get().steps.filter((step) => step.assessmentId === assessmentId);
    const currentStep = steps.find((step) => step.stage === currentStage);

    if (currentStep) {
      get().updateStep(currentStep.id, {
        status: 'on_hold',
        comments: `Escalated: ${reason}`,
        priority: 'high',
      });
    }

    // Add manager approval step if not already present
    if (!steps.some((step) => step.stage === 'manager_approval')) {
      get().addStep({
        assessmentId,
        stage: 'manager_approval',
        status: 'pending',
        priority: 'high',
        requirements: ['Review escalation reason', 'Verify documentation'],
        documents: [],
      });
    }
  },
}));