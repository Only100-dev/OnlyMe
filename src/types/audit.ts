export type AuditAction =
  | 'assessment_created'
  | 'assessment_updated'
  | 'assessment_approved'
  | 'assessment_denied'
  | 'document_uploaded'
  | 'document_deleted'
  | 'compliance_check'
  | 'risk_assessment';

export interface AuditLog {
  id: string;
  timestamp: Date;
  action: AuditAction;
  userId: string;
  details: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface AuditStore {
  logs: AuditLog[];
  addLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getLogs: (filters?: Partial<AuditLog>) => AuditLog[];
  clearLogs: () => void;
}