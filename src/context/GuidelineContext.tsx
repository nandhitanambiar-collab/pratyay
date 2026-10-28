import React, { useState, useEffect } from 'react';
import type { GuidelineRule, BrandFactEvidence } from '../types';
import { initialGuidelineRules, initialBrandFactsEvidence } from '../data/mockData';
import { GuidelineContext } from './GuidelineContextInstance';

const STORAGE_KEY_GUIDELINES = 'pratyay_demo_guidelines_v1';
const STORAGE_KEY_EVIDENCE = 'pratyay_demo_evidence_v1';

function isSampleFact(f: BrandFactEvidence): boolean {
  const sampleIds = ['FACT-201', 'FACT-202', 'FACT-203', 'FACT-204', 'FACT-205', 'FACT-206'];
  if (sampleIds.includes(f.id)) return true;
  const lower = `${f.claimName} ${f.approvedStatement} ${f.sourceReference || ''}`.toLowerCase();
  return (
    lower.includes('chikmeshra') ||
    lower.includes('avo botanicals') ||
    lower.includes('aura botanicals') ||
    lower.includes('hair-fall') ||
    lower.includes('hairfall') ||
    lower.includes('apex cloud') ||
    lower.includes('nexus health') ||
    lower.includes('veloce') ||
    lower.includes('kavach') ||
    lower.includes('wizard nutrimets')
  );
}

export const GuidelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guidelines, setGuidelines] = useState<GuidelineRule[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GUIDELINES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback on storage errors
    }
    return initialGuidelineRules;
  });

  const [factsEvidence, setFactsEvidence] = useState<BrandFactEvidence[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVIDENCE);
      if (stored) {
        const parsed: BrandFactEvidence[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((f) => !isSampleFact(f));
        }
      }
    } catch {
      // Fallback on storage errors
    }
    return initialBrandFactsEvidence;
  });

  // Sync to localStorage for demonstration resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GUIDELINES, JSON.stringify(guidelines));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [guidelines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EVIDENCE, JSON.stringify(factsEvidence));
    } catch {
      // Ignore quota errors in demo mode
    }
  }, [factsEvidence]);

  const addGuideline = (rule: Omit<GuidelineRule, 'id' | 'lastUpdated'>): GuidelineRule => {
    const newRule: GuidelineRule = {
      ...rule,
      id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
      lastUpdated: 'Just now',
    };
    setGuidelines((prev) => [newRule, ...prev]);
    return newRule;
  };

  const updateGuideline = (id: string, updates: Partial<Omit<GuidelineRule, 'id'>>) => {
    setGuidelines((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              lastUpdated: 'Just now',
            }
          : item
      )
    );
  };

  const toggleGuidelineStatus = (id: string) => {
    setGuidelines((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Active' ? 'Inactive' : 'Active',
              lastUpdated: 'Just now',
            }
          : item
      )
    );
  };

  const deleteGuideline = (id: string) => {
    setGuidelines((prev) => prev.filter((item) => item.id !== id));
  };

  const addFactEvidence = (fact: Omit<BrandFactEvidence, 'id' | 'lastUpdated'>): BrandFactEvidence => {
    const newFact: BrandFactEvidence = {
      ...fact,
      id: `FACT-${Math.floor(200 + Math.random() * 800)}`,
      lastUpdated: 'Just now',
    };
    setFactsEvidence((prev) => [newFact, ...prev]);
    return newFact;
  };

  const updateFactEvidence = (id: string, updates: Partial<Omit<BrandFactEvidence, 'id'>>) => {
    setFactsEvidence((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
              lastUpdated: 'Just now',
            }
          : item
      )
    );
  };

  const deleteFactEvidence = (id: string) => {
    setFactsEvidence((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDemoDefaults = () => {
    setGuidelines(initialGuidelineRules);
    setFactsEvidence(initialBrandFactsEvidence);
    localStorage.removeItem(STORAGE_KEY_GUIDELINES);
    localStorage.removeItem(STORAGE_KEY_EVIDENCE);
  };

  return (
    <GuidelineContext.Provider
      value={{
        guidelines,
        addGuideline,
        updateGuideline,
        toggleGuidelineStatus,
        deleteGuideline,
        factsEvidence,
        addFactEvidence,
        updateFactEvidence,
        deleteFactEvidence,
        resetToDemoDefaults,
      }}
    >
      {children}
    </GuidelineContext.Provider>
  );
};
