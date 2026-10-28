import React, { useState, useEffect, useCallback } from 'react';
import type { Finding, FindingStatus, ReviewItem } from '../types';
import { runDeterministicRuleChecks } from '../utils/ruleChecker';
import { useGuidelines } from '../hooks/useGuidelines';
import { useAudit } from '../hooks/useAudit';
import { FindingContext, type FindingDecision } from './FindingContextInstance';

const STORAGE_KEY_DECISIONS = 'pratyay_finding_decisions_v1';
const STORAGE_KEY_WORKING_DRAFTS = 'pratyay_working_drafts_v1';

export const FindingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { guidelines, factsEvidence } = useGuidelines();
  const { logEvent } = useAudit();

  // Storage of user decisions: reviewId -> { findingId -> FindingDecision }
  const [decisions, setDecisions] = useState<Record<string, Record<string, FindingDecision>>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DECISIONS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback on storage errors
    }
    return {};
  });

  // Storage of separate editable working revision drafts: reviewId -> string
  const [workingDrafts, setWorkingDrafts] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WORKING_DRAFTS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback on storage errors
    }
    return {};
  });

  // Persist decisions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DECISIONS, JSON.stringify(decisions));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [decisions]);

  // Persist working drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WORKING_DRAFTS, JSON.stringify(workingDrafts));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [workingDrafts]);

  // Evaluates findings deterministically and merges any user decisions
  const getFindingsForReview = useCallback(
    (review: ReviewItem): Finding[] => {
      const rawFindings = runDeterministicRuleChecks(review, guidelines, factsEvidence);
      const reviewDecisions = decisions[review.id] || {};

      return rawFindings.map((finding) => {
        const decision = reviewDecisions[finding.id];
        if (decision) {
          return {
            ...finding,
            status: decision.status,
            dismissReason: decision.dismissReason,
          };
        }
        return finding;
      });
    },
    [guidelines, factsEvidence, decisions]
  );

  const getWorkingDraft = useCallback(
    (reviewId: string, fallbackOriginal: string): string => {
      if (workingDrafts[reviewId] !== undefined) {
        return workingDrafts[reviewId];
      }
      return fallbackOriginal;
    },
    [workingDrafts]
  );

  const setWorkingDraft = useCallback((reviewId: string, draftText: string) => {
    setWorkingDrafts((prev) => ({
      ...prev,
      [reviewId]: draftText,
    }));
  }, []);

  const updateFindingStatus = useCallback(
    (
      reviewId: string,
      findingId: string,
      status: FindingStatus,
      dismissReason?: string,
      actorName?: string
    ) => {
      setDecisions((prev) => {
        const existingReviewDecisions = prev[reviewId] || {};
        return {
          ...prev,
          [reviewId]: {
            ...existingReviewDecisions,
            [findingId]: {
              status,
              dismissReason,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });

      const reviewer = actorName || 'Editorial Reviewer (Demo)';
      if (status === 'accepted') {
        logEvent({
          eventType: 'finding_accepted',
          reviewId,
          actor: reviewer,
          actorRole: 'Reviewer (Demo Identity)',
          summary: `Accepted finding ${findingId} for review ${reviewId}.`,
        });
      } else if (status === 'dismissed') {
        logEvent({
          eventType: 'finding_dismissed',
          reviewId,
          actor: reviewer,
          actorRole: 'Reviewer (Demo Identity)',
          summary: `Dismissed finding ${findingId} for review ${reviewId}.`,
          comment: dismissReason || 'Dismissed by reviewer',
        });
      } else if (status === 'resolved') {
        logEvent({
          eventType: 'finding_resolved',
          reviewId,
          actor: reviewer,
          actorRole: 'Reviewer (Demo Identity)',
          summary: `Marked finding ${findingId} as resolved.`,
        });
      } else if (status === 'open') {
        logEvent({
          eventType: 'finding_reopened',
          reviewId,
          actor: reviewer,
          actorRole: 'Reviewer (Demo Identity)',
          summary: `Reopened finding ${findingId}.`,
        });
      }
    },
    [logEvent]
  );

  const applySuggestionToWorkingDraft = useCallback(
    (
      reviewId: string,
      findingId: string,
      originalDraft: string,
      suggestedText: string,
      matchedText?: string
    ) => {
      setWorkingDrafts((prev) => {
        const currentDraft = prev[reviewId] !== undefined ? prev[reviewId] : originalDraft;
        let updatedDraft = currentDraft;

        if (matchedText && currentDraft.includes(matchedText)) {
          updatedDraft = currentDraft.replace(matchedText, suggestedText);
        } else if (suggestedText.startsWith(currentDraft)) {
          // If suggestion was appending missing disclaimer
          updatedDraft = suggestedText;
        } else {
          // Fallback replacement if matchedText was slightly modified or not found directly
          updatedDraft = `${currentDraft}\n\n[Applied Revision]: ${suggestedText}`;
        }

        return {
          ...prev,
          [reviewId]: updatedDraft,
        };
      });

      // Mark the finding as accepted once applied
      updateFindingStatus(reviewId, findingId, 'accepted');
    },
    [updateFindingStatus]
  );

  const resetFindingsForReview = useCallback((reviewId: string) => {
    setDecisions((prev) => {
      const copy = { ...prev };
      delete copy[reviewId];
      return copy;
    });
    setWorkingDrafts((prev) => {
      const copy = { ...prev };
      delete copy[reviewId];
      return copy;
    });
  }, []);

  return (
    <FindingContext.Provider
      value={{
        getFindingsForReview,
        getWorkingDraft,
        setWorkingDraft,
        applySuggestionToWorkingDraft,
        updateFindingStatus,
        resetFindingsForReview,
      }}
    >
      {children}
    </FindingContext.Provider>
  );
};
