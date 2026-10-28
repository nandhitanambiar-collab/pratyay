import React, { useState, useEffect, useCallback } from 'react';
import type { ReviewItem } from '../types';
import { ReviewContext } from './ReviewContextInstance';
import { useAudit } from '../hooks/useAudit';

const STORAGE_KEY_REVIEWS = 'pratyay_demo_reviews_v1';

function isSampleReview(r: ReviewItem): boolean {
  const sampleIds = ['REV-2026-089', 'REV-2026-088', 'REV-2026-087', 'REV-2026-086', 'REV-2026-085', 'REV-2026-084'];
  if (sampleIds.includes(r.id)) return true;
  const combined = `${r.campaignTitle} ${r.draftText || ''} ${r.brandPackName || ''}`.toLowerCase();
  return (
    combined.includes('chikmeshra') ||
    combined.includes('avo botanicals') ||
    combined.includes('aura botanicals') ||
    combined.includes('hair-fall defense') ||
    combined.includes('hairfall defense') ||
    combined.includes('apex cloud') ||
    combined.includes('nexus health') ||
    combined.includes('veloce mobility') ||
    combined.includes('kavach fintech') ||
    combined.includes('lumina smart')
  );
}

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logEvent } = useAudit();

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (stored) {
        const parsed: ReviewItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((r) => !isSampleReview(r));
        }
      }
    } catch {
      // Fallback on storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [reviews]);

  const addReview = useCallback(
    (item: Omit<ReviewItem, 'id' | 'createdAt' | 'lastUpdated'>): ReviewItem => {
      const newId = `REV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const now = 'Just now';
      const newReview: ReviewItem = {
        ...item,
        id: newId,
        originalDraftText: item.originalDraftText || item.draftText,
        activeRevisionVersion: 1,
        createdAt: now,
        lastUpdated: now,
        submittedAt: item.status === 'In Review' ? now : item.submittedAt,
      };

      setReviews((prev) => [newReview, ...prev]);

      if (item.status === 'In Review') {
        logEvent({
          eventType: 'content_submitted',
          reviewId: newId,
          reviewTitle: item.campaignTitle,
          previousStatus: 'Draft',
          newStatus: 'In Review',
          actor: item.submittedBy.name,
          actorRole: item.submittedBy.role,
          summary: `Created and submitted "${item.campaignTitle}" for brand governance review.`,
          revisionVersion: 1,
        });
      }

      return newReview;
    },
    [logEvent]
  );

  const updateReview = useCallback(
    (id: string, updates: Partial<Omit<ReviewItem, 'id'>>) => {
      const now = 'Just now';
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                lastUpdated: now,
                submittedAt:
                  updates.status === 'In Review' && !item.submittedAt
                    ? now
                    : updates.submittedAt ?? item.submittedAt,
              }
            : item
        )
      );
    },
    []
  );

  const submitReview = useCallback(
    (id: string) => {
      const now = 'Just now';
      setReviews((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            logEvent({
              eventType: 'content_submitted',
              reviewId: item.id,
              reviewTitle: item.campaignTitle,
              previousStatus: item.status,
              newStatus: 'In Review',
              actor: item.submittedBy.name,
              actorRole: item.submittedBy.role,
              summary: `Submitted "${item.campaignTitle}" for brand governance review.`,
              revisionVersion: item.activeRevisionVersion || 1,
            });
            return {
              ...item,
              status: 'In Review',
              lastUpdated: now,
              submittedAt: now,
            };
          }
          return item;
        })
      );
    },
    [logEvent]
  );

  const requestChanges = useCallback(
    (id: string, reviewerName: string, reason: string) => {
      const now = 'Just now';
      setReviews((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            logEvent({
              eventType: 'changes_requested',
              reviewId: item.id,
              reviewTitle: item.campaignTitle,
              previousStatus: item.status,
              newStatus: 'Needs Changes',
              actor: reviewerName,
              actorRole: 'Reviewer (Demo Identity)',
              summary: `Changes requested on "${item.campaignTitle}": ${reason}`,
              comment: reason,
              revisionVersion: item.activeRevisionVersion || 1,
            });
            return {
              ...item,
              status: 'Needs Changes',
              reviewerDecision: 'Needs Changes',
              reviewerComment: reason,
              reviewedBy: reviewerName,
              reviewedAt: now,
              lastUpdated: now,
            };
          }
          return item;
        })
      );
    },
    [logEvent]
  );

  const approveReview = useCallback(
    (id: string, reviewerName: string, comment?: string) => {
      const now = 'Just now';
      const finalComment = comment || 'Verified and approved for brand compliance standards.';
      setReviews((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            logEvent({
              eventType: 'content_approved',
              reviewId: item.id,
              reviewTitle: item.campaignTitle,
              previousStatus: item.status,
              newStatus: 'Approved',
              actor: reviewerName,
              actorRole: 'Reviewer (Demo Identity)',
              summary: `Approved "${item.campaignTitle}" for publication.`,
              comment: finalComment,
              revisionVersion: item.activeRevisionVersion || 1,
            });
            return {
              ...item,
              status: 'Approved',
              reviewerDecision: 'Approved',
              reviewerComment: finalComment,
              reviewedBy: reviewerName,
              reviewedAt: now,
              lastUpdated: now,
            };
          }
          return item;
        })
      );
    },
    [logEvent]
  );

  const resubmitRevision = useCallback(
    (id: string, newDraftText: string, changeSummary?: string, submitterName?: string) => {
      const now = 'Just now';
      setReviews((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const nextVersion = (item.activeRevisionVersion || 1) + 1;
            const author = submitterName || item.submittedBy.name;
            const summaryText = changeSummary || `Resubmitted with revisions (Version ${nextVersion})`;
            logEvent({
              eventType: 'revision_resubmitted',
              reviewId: item.id,
              reviewTitle: item.campaignTitle,
              previousStatus: item.status,
              newStatus: 'In Review',
              actor: author,
              actorRole: item.submittedBy.role,
              summary: `Resubmitted "${item.campaignTitle}" as Version ${nextVersion}.`,
              comment: summaryText,
              revisionVersion: nextVersion,
            });
            return {
              ...item,
              originalDraftText: item.originalDraftText || item.draftText,
              draftText: newDraftText,
              activeRevisionVersion: nextVersion,
              status: 'In Review',
              reviewerDecision: undefined,
              lastUpdated: now,
              submittedAt: now,
            };
          }
          return item;
        })
      );
    },
    [logEvent]
  );

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getReviewById = useCallback(
    (id: string): ReviewItem | undefined => {
      return reviews.find((item) => item.id === id);
    },
    [reviews]
  );

  const resetToDemoReviews = useCallback(() => {
    setReviews([]);
    try {
      localStorage.removeItem(STORAGE_KEY_REVIEWS);
    } catch {
      // Ignore
    }
  }, []);

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        updateReview,
        submitReview,
        requestChanges,
        approveReview,
        resubmitRevision,
        deleteReview,
        getReviewById,
        resetToDemoReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};
