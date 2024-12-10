import { create } from 'zustand';
import { ComplianceStore, Regulation, ComplianceCheck } from '../types/compliance';

export const useComplianceStore = create<ComplianceStore>((set, get) => ({
  regulations: [
    {
      id: 'reg-001',
      title: 'Mandatory Third Party Liability',
      description: 'Minimum coverage requirements for third party liability insurance',
      category: 'coverage',
      requirements: [
        'Minimum coverage of AED 250,000 for property damage',
        'Unlimited coverage for bodily injury or death',
        'Coverage must extend to all GCC countries'
      ],
      lastUpdated: new Date('2024-01-01'),
      source: 'UAE Insurance Authority'
    },
    {
      id: 'reg-002',
      title: 'Driver Age Requirements',
      description: 'Age restrictions and requirements for motor insurance coverage',
      category: 'general',
      requirements: [
        'Minimum driver age of 18 years',
        'Additional premium for drivers under 25 years',
        'Special requirements for commercial vehicle drivers'
      ],
      lastUpdated: new Date('2024-01-01'),
      source: 'UAE Insurance Authority'
    }
  ],
  checks: [],
  
  addRegulation: (regulation: Regulation) =>
    set((state) => ({
      regulations: [...state.regulations, regulation],
    })),
    
  updateRegulation: (id: string, updates: Partial<Regulation>) =>
    set((state) => ({
      regulations: state.regulations.map((reg) =>
        reg.id === id ? { ...reg, ...updates } : reg
      ),
    })),
    
  addCheck: (check: ComplianceCheck) =>
    set((state) => ({
      checks: [...state.checks, check],
    })),
    
  getChecksByAssessment: (assessmentId: string) =>
    get().checks.filter((check) => check.assessmentId === assessmentId),
}));