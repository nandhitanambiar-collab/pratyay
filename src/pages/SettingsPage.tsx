import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Server, 
  ShieldAlert, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../services/api/client';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'workspace' | 'team' | 'api' | 'compliance'>('workspace');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              System Configuration
            </span>
            <span className="text-xs text-slate-400">• Phase 1 Placeholder</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Platform Settings & Governance
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Configure workspace parameters, reviewer roles, compliance policy packs, and backend API endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Dashboard
          </Button>
        </div>
      </div>

      {/* Settings Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'workspace'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Workspace & Organization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'team'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Team & Permissions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>FastAPI Backend Integration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compliance')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'compliance'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Compliance Policy Packs</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'workspace' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organization Name</label>
                <input
                  type="text"
                  disabled
                  value="Acme Global Brands Ltd."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Governance Standard Version</label>
                <input
                  type="text"
                  disabled
                  value="Enterprise Brand Standards v2.4 (Active)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-800 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Workspace settings are loaded from Phase 1 demo defaults. Full database persistence with PostgreSQL will be established in later project stages.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-500">Configured demo reviewer personas and governance authority levels:</p>
              
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Editorial Reviewer (Demo)</p>
                    <p className="text-slate-500 text-[11px]">editorial.reviewer@pratyay-governance.internal • Brand Tone & Style Authority</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold text-[11px]">
                    Editorial Authority
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Compliance Officer (Demo)</p>
                    <p className="text-slate-500 text-[11px]">compliance.officer@pratyay-governance.internal • Legal, Claims & ASCI Code Authority</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-semibold text-[11px]">
                    Compliance Lead
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Technical Specialist (Demo)</p>
                    <p className="text-slate-500 text-[11px]">technical.lead@pratyay-governance.internal • Product Specs & Evidence Verification</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-[11px]">
                    Technical Lead
                  </span>
                </div>

                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Content Creator (Demo)</p>
                    <p className="text-slate-500 text-[11px]">content.creator@pratyay-governance.internal • Draft Creation & Revisions</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-[11px]">
                    Marketing Contributor
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4 max-w-xl text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">FastAPI Endpoint URL (Base)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    disabled
                    value={API_BASE_URL}
                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono font-medium"
                  />
                  <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
                    VITE_API_BASE_URL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Configured via environment variable <code>VITE_API_BASE_URL</code> (defaults to <code>http://127.0.0.1:8000/api/v1</code>).
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Database Target</label>
                <input
                  type="text"
                  disabled
                  value="PostgreSQL (Guidelines, Claims Registry, Submissions, Findings, Audit Log)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                />
              </div>

              <div className="p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-emerald-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Frontend-to-Backend Contract Ready</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Typed client service definitions are established in <code>src/services/api/client.ts</code> and <code>src/services/api/types.ts</code>. The complete handoff specification is documented in <code>FRONTEND_HANDOFF.md</code>.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                <p className="text-[11px] leading-relaxed">
                  The frontend automatically runs in offline demonstration mode when the backend is unreachable. Once the FastAPI server is started, it will seamlessly receive review payloads.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-3 text-xs max-w-xl">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">ASCI Advertising Codes (2024–2025)</p>
                  <p className="text-[11px] text-slate-500">Substantiation checks for efficacy claims and comparative superlatives.</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">CCPA Disclosure Verification (2026)</p>
                  <p className="text-[11px] text-slate-500">Flags missing disclaimers and selection criteria disclosures.</p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
