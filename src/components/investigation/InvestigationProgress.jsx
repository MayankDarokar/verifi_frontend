import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function InvestigationProgress({ currentStage }) {
  const stages = [
    'Ingesting content & extracting entities...',
    'Parsing payment payload & technical URIs...',
    'Cross-verifying user Intent vs Payment Mechanism...',
    'Evaluating threat intelligence & social engineering signals...',
    'Synthesizing evidence & compiling actionable defense plan...',
  ];

  const activeIndex = currentStage ? currentStage.step - 1 : 0;

  return (
    <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-indigo-200 dark:border-indigo-900/60 p-5 sm:p-6 shadow-sm mb-6 transition-colors">
      <div className="flex items-center gap-2.5 mb-4">
        <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            VeriFi Investigation in Progress
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Evaluating observable signals and payment parameters
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {stages.map((stageText, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-2.5 p-2 rounded-md text-xs transition-colors ${
                isCurrent
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold'
                  : isDone
                  ? 'text-slate-600 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-400">
                    {idx + 1}
                  </div>
                )}
              </div>
              <span className="leading-tight">{stageText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
