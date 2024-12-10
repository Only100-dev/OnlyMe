import { create } from 'zustand';
import { AuditStore, AuditLog } from '../types/audit';

export const useAuditStore = create<AuditStore>((set, get) => ({
  logs: [],
  
  addLog: (log) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...log,
    };
    
    set((state) => ({
      logs: [newLog, ...state.logs],
    }));
  },
  
  getLogs: (filters) => {
    const logs = get().logs;
    if (!filters) return logs;
    
    return logs.filter((log) =>
      Object.entries(filters).every(([key, value]) => log[key as keyof AuditLog] === value)
    );
  },
  
  clearLogs: () => set({ logs: [] }),
}));