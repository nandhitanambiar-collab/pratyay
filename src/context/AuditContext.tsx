import React, { useState, useEffect, useCallback } from 'react';
import type { AuditEvent } from '../types';
import { AuditContext } from './AuditContextInstance';

const STORAGE_KEY_AUDIT = 'pratyay_audit_events_v1';

function isSampleAuditEvent(e: AuditEvent): boolean {
  if (e.isSyntheticDemo) return true;
  const sampleIds = ['AUD-1001', 'AUD-1002', 'AUD-1003', 'AUD-1004', 'AUD-1005', 'AUD-1006'];
  if (sampleIds.includes(e.id)) return true;
  const lower = `${e.reviewTitle || ''} ${e.summary || ''} ${e.comment || ''}`.toLowerCase();
  return (
    lower.includes('chikmeshra') ||
    lower.includes('avo botanicals') ||
    lower.includes('aura botanicals') ||
    lower.includes('hair-fall defense') ||
    lower.includes('hairfall defense') ||
    lower.includes('apex cloud') ||
    lower.includes('nexus health') ||
    lower.includes('veloce mobility') ||
    lower.includes('kavach fintech') ||
    lower.includes('lumina smart')
  );
}

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<AuditEvent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (stored) {
        const parsed: AuditEvent[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((e) => !isSampleAuditEvent(e));
        }
      }
    } catch {
      // Fallback on storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(events));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [events]);

  const logEvent = useCallback(
    (eventData: Omit<AuditEvent, 'id' | 'timestamp' | 'isoTimestamp'>): AuditEvent => {
      const now = new Date();
      const newEvent: AuditEvent = {
        ...eventData,
        id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: 'Just now',
        isoTimestamp: now.toISOString(),
      };

      setEvents((prev) => [newEvent, ...prev]);
      return newEvent;
    },
    []
  );

  const resetAuditLog = useCallback(() => {
    setEvents([]);
    try {
      localStorage.removeItem(STORAGE_KEY_AUDIT);
    } catch {
      // Ignore
    }
  }, []);

  const getEventsForReview = useCallback(
    (reviewId: string): AuditEvent[] => {
      return events.filter((e) => e.reviewId === reviewId);
    },
    [events]
  );

  return (
    <AuditContext.Provider
      value={{
        events,
        logEvent,
        resetAuditLog,
        getEventsForReview,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};
