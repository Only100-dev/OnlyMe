export interface Regulation {
  id: string;
  title: string;
  description: string;
  category: RegulationCategory;
  requirements: string[];
  lastUpdated: Date;
  source: string;
}

export type RegulationCategory =
  | 'general'
  | 'coverage'
  | 'claims'
  | 'documentation'
  | 'pricing';

export interface ComplianceCheck {
  id: string;
  regulationId: string;
  assessmentId: string;
  status: 'compliant' | 'non_compliant' | 'pending';
  details: string;
  checkedAt: Date;
}

export interface ComplianceStore {
  regulations: Regulation[];
  checks: ComplianceCheck[];
  addRegulation: (regulation: Regulation) => void;
  updateRegulation: (id: string, updates: Partial<Regulation>) => void;
  addCheck: (check: ComplianceCheck) => void;
  getChecksByAssessment: (assessmentId: string) => ComplianceCheck[];
}