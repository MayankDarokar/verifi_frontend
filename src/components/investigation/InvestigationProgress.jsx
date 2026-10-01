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
    <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/90 backdrop-blur-md border border-indigo-200/90 dark:border-indigo-900/60 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(99,102,241,0.08)] mb-6 sm:mb-8 transition-all">
      <div className="flex items-center gap-3 mb-4">
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
              className={`flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-[13px] transition-colors ${
                isCurrent
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-semibold border border-indigo-200/70 dark:border-indigo-800/40'
                  : isDone
                  ? 'text-slate-600 dark:text-slate-300'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
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
