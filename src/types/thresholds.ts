import { z } from 'zod';

export interface FinancialThreshold {
  id: string;
  role: 'underwriter' | 'senior_underwriter' | 'manager';
  maxPolicyValue: number;
  maxRiskScore: number;
  requiresEscalation: boolean;
  createdAt: Date;
  updatedAt: Date;
  escalationRules?: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  condition: 'value' | 'risk' | 'claims';
  threshold: number;
  escalateTo: 'senior_underwriter' | 'manager';
  autoEscalate: boolean;
  notifyUsers: string[];
}

export interface ApprovalRequirement {
  id: string;
  condition: 'policy_value' | 'risk_score' | 'claims_history' | 'special_coverage';
  threshold: number;
  requiredRole: 'underwriter' | 'senior_underwriter' | 'manager';
  description: string;
}

export const thresholdSchema = z.object({
  role: z.enum(['underwriter', 'senior_underwriter', 'manager']),
  maxPolicyValue: z.number().min(0, 'Value must be positive'),
  maxRiskScore: z.number().min(0, 'Score must be positive').max(100, 'Maximum score is 100'),
  requiresEscalation: z.boolean(),
  escalationRules: z.array(z.object({
    condition: z.enum(['value', 'risk', 'claims']),
    threshold: z.number(),
    escalateTo: z.enum(['senior_underwriter', 'manager']),
    autoEscalate: z.boolean(),
    notifyUsers: z.array(z.string()),
  })).optional(),
});

export type ThresholdFormData = z.infer<typeof thresholdSchema>;