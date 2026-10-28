import React from 'react';
import { Cpu, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import {
  SUPPORTED_MODELS,
  ACTUAL_OFFLINE_ENGINE,
  type ModelOption,
} from '../../config/models';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  compact?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  compact = false,
}) => {
  const selectedModel = SUPPORTED_MODELS.find((m) => m.id === selectedModelId) || SUPPORTED_MODELS[0];

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <label htmlFor="model-select-compact" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Target Model:</span>
        </label>
        <select
          id="model-select-compact"
          value={selectedModelId}
          onChange={(e) => onSelectModel(e.target.value)}
          className="text-xs py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {SUPPORTED_MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.provider})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-800">
            Target AI Inference Model
          </label>
          <p className="text-[11px] text-slate-500">
            Select the LLM model to be targeted for analysis once connected to the FastAPI backend.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Backend Target Config</span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {SUPPORTED_MODELS.map((model: ModelOption) => {
          const isSelected = model.id === selectedModelId;
          return (
            <div
              key={model.id}
              onClick={() => onSelectModel(model.id)}
              className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{model.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {model.provider}
                    </span>
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                    {model.badge}
                  </span>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {model.description}
              </p>

              <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Tone: Supported
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Facts: Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distinction Banner: Selected Model vs Actual Local Engine */}
      <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/60 flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="text-xs flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900">Current Execution Engine:</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[11px] font-medium">
              {ACTUAL_OFFLINE_ENGINE.name}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
            In this offline demo phase, reviews run locally on client-side regex and keyword rules. Your chosen target model (<strong>{selectedModel.name}</strong>) is saved in settings and will be passed in the API payload once the FastAPI backend is operational.
          </p>
        </div>
      </div>
    </div>
  );
};
