import React from 'react';
import { GitCommit, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function InvestigationTrace({ trace }) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.5)] mb-6 sm:mb-8 transition-all">
      <div className="flex items-center gap-2.5 mb-5">
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

      <div className="space-y-2.5">
        {trace.map((event, idx) => {
          const isWarning = event.status === 'warning';
          const isAction = event.status === 'action';

          return (
            <div
              key={idx}
              className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-colors ${
                isWarning
                  ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200/90 dark:border-red-900/30'
                  : isAction
                  ? 'bg-indigo-50/60 dark:bg-indigo-950/20 border-indigo-200/90 dark:border-indigo-900/30'
                  : 'bg-slate-50/80 dark:bg-[#090d16]/80 border-slate-200/80 dark:border-white/5'
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
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {event.title}
                </div>
                {event.detail && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
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
