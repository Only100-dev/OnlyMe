import { create } from 'zustand';
import { FinancialThreshold, ApprovalRequirement } from '../types/thresholds';

interface ThresholdStore {
  thresholds: FinancialThreshold[];
  requirements: ApprovalRequirement[];
  addThreshold: (threshold: Omit<FinancialThreshold, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateThreshold: (id: string, updates: Partial<FinancialThreshold>) => void;
  deleteThreshold: (id: string) => void;
  checkApprovalRequirements: (policyValue: number, riskScore: number, claimsCount: number) => ApprovalRequirement[];
}

export const useThresholdStore = create<ThresholdStore>((set, get) => ({
  thresholds: [
    {
      id: 'th-1',
      role: 'underwriter',
      maxPolicyValue: 250000,
      maxRiskScore: 40,
      requiresEscalation: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'th-2',
      role: 'senior_underwriter',
      maxPolicyValue: 500000,
      maxRiskScore: 60,
      requiresEscalation: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'th-3',
      role: 'manager',
      maxPolicyValue: 1000000,
      maxRiskScore: 80,
      requiresEscalation: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  requirements: [
    {
      id: 'req-1',
      condition: 'policy_value',
      threshold: 250000,
      requiredRole: 'underwriter',
      description: 'Standard policies up to 250,000 AED',
    },
    {
      id: 'req-2',
      condition: 'risk_score',
      threshold: 60,
      requiredRole: 'senior_underwriter',
      description: 'High-risk policies (score > 60)',
    },
    {
      id: 'req-3',
      condition: 'claims_history',
      threshold: 2,
      requiredRole: 'manager',
      description: 'Multiple claims history',
    },
    {
      id: 'req-4',
      condition: 'special_coverage',
      threshold: 0,
      requiredRole: 'senior_underwriter',
      description: 'Non-standard coverage requirements',
    },
  ],

  addThreshold: (threshold) => {
    const newThreshold: FinancialThreshold = {
      id: `th-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...threshold,
    };

    set((state) => ({
      thresholds: [...state.thresholds, newThreshold],
    }));
  },

  updateThreshold: (id, updates) => {
    set((state) => ({
      thresholds: state.thresholds.map((threshold) =>
        threshold.id === id
          ? { ...threshold, ...updates, updatedAt: new Date() }
          : threshold
      ),
    }));
  },

  deleteThreshold: (id) => {
    set((state) => ({
      thresholds: state.thresholds.filter((threshold) => threshold.id !== id),
    }));
  },

  checkApprovalRequirements: (policyValue, riskScore, claimsCount) => {
    const { requirements } = get();
    return requirements.filter((req) => {
      switch (req.condition) {
        case 'policy_value':
          return policyValue > req.threshold;
        case 'risk_score':
          return riskScore > req.threshold;
        case 'claims_history':
          return claimsCount > req.threshold;
        case 'special_coverage':
          return true; // Special coverage always requires review
        default:
          return false;
      }
    });
  },
}));