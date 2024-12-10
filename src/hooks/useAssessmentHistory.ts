import { useState, useCallback } from 'react';
import { Assessment } from '../types/assessment';
import { useAuditLogger } from './useAuditLogger';

interface HistoryEntry {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'reassessment_request' | 'document_update' | 'comment';
  details: string;
  user: string;
}

export function useAssessmentHistory(assessment: Assessment) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const logAction = useAuditLogger();

  const addHistoryEntry = useCallback(
    (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
      const newEntry: HistoryEntry = {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        ...entry,
      };

      setHistory((prev) => [newEntry, ...prev]);

      logAction('history_entry_added', {
        assessmentId: assessment.id,
        entryType: entry.type,
        entryId: newEntry.id,
      });

      return newEntry;
    },
    [assessment.id, logAction]
  );

  const getHistory = useCallback(() => history, [history]);

  return {
    history,
    addHistoryEntry,
    getHistory,
  };
}