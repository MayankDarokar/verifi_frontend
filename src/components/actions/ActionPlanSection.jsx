import React from 'react';
import { Target, PhoneCall, ExternalLink } from 'lucide-react';

export function ActionPlanSection({ actionPlan }) {
  if (!actionPlan) return null;

  return (
    <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Recommended Action Plan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immediate protective countermeasures based on verified threat indicators
          </p>
        </div>
      </div>

      {/* Primary Immediate Recommendation */}
      <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 mb-5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-1">
          Primary Direct Action
        </div>
        <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
          {actionPlan.summary}
        </div>
      </div>

      {/* Checklist */}
      {actionPlan.steps && actionPlan.steps.length > 0 && (
        <div className="space-y-2 mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Next Steps Checklist
          </div>
          <ol className="space-y-2">
            {actionPlan.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200/80 dark:border-white/5"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Official Help Contact */}
      {actionPlan.helpline && (
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Reporting Helpline
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {actionPlan.helpline}
              </div>
            </div>
          </div>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-slate-400 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
