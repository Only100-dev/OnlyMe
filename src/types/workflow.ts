import { Assessment } from './assessment';

export type WorkflowStage = 
  | 'document_verification'
  | 'risk_assessment'
  | 'compliance_check'
  | 'underwriter_review'
  | 'manager_approval'
  | 'final_decision'
  | 'client_notification';

export type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';

export interface WorkflowStep {
  id: string;
  assessmentId: string;
  stage: WorkflowStage;
  status: WorkflowStatus;
  assignedTo?: string;
  comments?: string;
  startedAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  requirements: string[];
  documents: string[];
}

export interface WorkflowStore {
  steps: WorkflowStep[];
  addStep: (step: Omit<WorkflowStep, 'id' | 'startedAt'>) => void;
  updateStep: (id: string, updates: Partial<WorkflowStep>) => void;
  getStepsByAssessment: (assessmentId: string) => WorkflowStep[];
  getCurrentStage: (assessmentId: string) => WorkflowStage | null;
  getWorkflowHistory: (assessmentId: string) => WorkflowStep[];
  escalateWorkflow: (assessmentId: string, reason: string) => void;
}