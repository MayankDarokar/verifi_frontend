import React from 'react';
import { SearchCheck } from 'lucide-react';

const SEVERITY_BADGES = {
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-900',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900',
  SUSPICIOUS: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  INFO: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-900',
};

export function EvidenceSection({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  // Group evidence by category
  const categories = {};
  evidence.forEach((item) => {
    const cat = item.category || 'General Signals';
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  return (
    <div className="rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 p-6 sm:p-7 shadow-sm mb-6 transition-colors">
      <div className="flex items-center gap-2 mb-5">
        <SearchCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Discovered Technical Evidence
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Factual indicators identified and verified during autonomous inspection
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {Object.entries(categories).map(([categoryName, items]) => (
          <div key={categoryName}>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 pb-1 border-b border-slate-100 dark:border-white/5">
              {categoryName}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item, idx) => {
                const badgeClass = SEVERITY_BADGES[item.severity] || SEVERITY_BADGES.INFO;

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#090d16] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${badgeClass} shrink-0`}>
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
