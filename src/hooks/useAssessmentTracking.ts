import { useState, useCallback } from 'react';
import { Assessment } from '../types/assessment';
import { useAuditLogger } from './useAuditLogger';

interface TrackingEvent {
  id: string;
  type: 'status_change' | 'document_upload' | 'risk_assessment' | 'compliance_check';
  timestamp: Date;
  details: Record<string, any>;
}

export function useAssessmentTracking(assessment: Assessment) {
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const logAction = useAuditLogger();

  const trackEvent = useCallback(
    (type: TrackingEvent['type'], details: Record<string, any>) => {
      const newEvent: TrackingEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        timestamp: new Date(),
        details,
      };

      setEvents((prev) => [...prev, newEvent]);
      logAction('tracking_event_added', {
        assessmentId: assessment.id,
        eventType: type,
        eventId: newEvent.id,
      });
    },
    [assessment.id, logAction]
  );

  const getEvents = useCallback(() => events, [events]);

  return {
    events,
    trackEvent,
    getEvents,
  };
}