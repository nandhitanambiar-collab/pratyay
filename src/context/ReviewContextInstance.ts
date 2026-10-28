import { createContext } from 'react';
import type { ReviewItem } from '../types';

export interface ReviewContextType {
  reviews: ReviewItem[];
  addReview: (item: Omit<ReviewItem, 'id' | 'createdAt' | 'lastUpdated'>) => ReviewItem;
  updateReview: (id: string, updates: Partial<Omit<ReviewItem, 'id'>>) => void;
  submitReview: (id: string) => void;
  requestChanges: (id: string, reviewerName: string, reason: string) => void;
  approveReview: (id: string, reviewerName: string, comment?: string) => void;
  resubmitRevision: (id: string, newDraftText: string, changeSummary?: string, submitterName?: string) => void;
  deleteReview: (id: string) => void;
  getReviewById: (id: string) => ReviewItem | undefined;
  resetToDemoReviews: () => void;
}

export const ReviewContext = createContext<ReviewContextType | undefined>(undefined);
