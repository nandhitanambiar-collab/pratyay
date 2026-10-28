import { createContext } from 'react';
import type { AuditEvent } from '../types';

export interface AuditContextType {
  events: AuditEvent[];
  logEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'isoTimestamp'>) => AuditEvent;
  resetAuditLog: () => void;
  getEventsForReview: (reviewId: string) => AuditEvent[];
}

export const AuditContext = createContext<AuditContextType | undefined>(undefined);
