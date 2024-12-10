import { useCallback } from 'react';
import { useAuditStore } from '../store/useAuditStore';
import { AuditAction } from '../types/audit';

export function useAuditLogger() {
  const addLog = useAuditStore((state) => state.addLog);

  const logAction = useCallback(
    (action: AuditAction, details: Record<string, any>, metadata?: Record<string, any>) => {
      // In a real app, you'd get the actual user ID from authentication
      const userId = 'system';
      
      addLog({
        action,
        userId,
        details,
        metadata,
      });
    },
    [addLog]
  );

  return logAction;
}