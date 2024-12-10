import { useEffect, useCallback } from 'react';
import { wsClient } from '../utils/websocket';
import { useAuditLogger } from './useAuditLogger';

export function useWebSocket(url: string) {
  const logAction = useAuditLogger();

  useEffect(() => {
    const socket = wsClient.connect(url);

    return () => {
      wsClient.disconnect();
    };
  }, [url]);

  const subscribe = useCallback((event: string, callback: (data: any) => void) => {
    wsClient.subscribe(event, (data) => {
      logAction('websocket_event_received', { event, data });
      callback(data);
    });

    return () => wsClient.unsubscribe(event, callback);
  }, [logAction]);

  const emit = useCallback((event: string, data: any) => {
    wsClient.emit(event, data);
    logAction('websocket_event_sent', { event, data });
  }, [logAction]);

  return { subscribe, emit };
}