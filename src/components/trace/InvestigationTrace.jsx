import React from 'react';
import { GitCommit, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function InvestigationTrace({ trace }) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-5">
        <GitCommit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            How VeriFi Reached This Result
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key investigation steps and verified milestones
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {trace.map((event, idx) => {
          const isWarning = event.status === 'warning';
          const isAction = event.status === 'action';

          return (
            <div
              key={idx}
              className={`p-3 rounded-lg border flex items-start gap-3 transition-colors ${
                isWarning
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30'
                  : isAction
                  ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/30'
                  : 'bg-slate-50 dark:bg-[#090d16] border-slate-200/80 dark:border-white/5'
              }`}
            >
              {/* Step number */}
              <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500 w-6 shrink-0 pt-0.5">
                {String(event.step || idx + 1).padStart(2, '0')}
              </span>

              {/* Status marker */}
              <div className="pt-0.5 shrink-0">
                {isWarning ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                ) : isAction ? (
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>

              {/* Title & Detail */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {event.title}
                </div>
                {event.detail && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {event.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
