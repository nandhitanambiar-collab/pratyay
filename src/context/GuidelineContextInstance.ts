import { createContext } from 'react';
import type { GuidelineRule, BrandFactEvidence } from '../types';

export interface GuidelineContextType {
  guidelines: GuidelineRule[];
  addGuideline: (rule: Omit<GuidelineRule, 'id' | 'lastUpdated'>) => GuidelineRule;
  updateGuideline: (id: string, updates: Partial<Omit<GuidelineRule, 'id'>>) => void;
  toggleGuidelineStatus: (id: string) => void;
  deleteGuideline: (id: string) => void;

  factsEvidence: BrandFactEvidence[];
  addFactEvidence: (fact: Omit<BrandFactEvidence, 'id' | 'lastUpdated'>) => BrandFactEvidence;
  updateFactEvidence: (id: string, updates: Partial<Omit<BrandFactEvidence, 'id'>>) => void;
  deleteFactEvidence: (id: string) => void;

  resetToDemoDefaults: () => void;
}

export const GuidelineContext = createContext<GuidelineContextType | undefined>(undefined);
