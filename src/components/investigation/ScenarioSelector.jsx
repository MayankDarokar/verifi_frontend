import React from 'react';
import { Sparkles, X } from 'lucide-react';

const SCENARIO_ITEMS = [
  {
    id: 'cashback_qr_mismatch',
    title: 'Cashback QR Promotion',
    type: 'UPI Intent Conflict',
  },
  {
    id: 'electricity_bill_scam',
    title: 'Electricity Disconnection',
    type: 'Utility Phishing SMS',
  },
  {
    id: 'lottery_prize_url',
    title: 'Lottery Prize Link',
    type: 'Advance-Fee Portal',
  },
  {
    id: 'legitimate_merchant_receipt',
    title: 'Grocery Store Receipt',
    type: 'Routine Transaction',
  },
];

export function ScenarioSelector({ selectedScenarioId, onSelectScenario, onClearToCustom }) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pre-Loaded Test Scenarios:
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            (Select to populate input for investigation)
          </span>
        </div>
        {selectedScenarioId && (
          <button
            type="button"
            onClick={onClearToCustom}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear to Custom Input</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {SCENARIO_ITEMS.map((item) => {
          const isSelected = selectedScenarioId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectScenario(item.id)}
              className={`group text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/50 border-indigo-500/80 text-indigo-950 dark:text-white shadow-sm ring-1 ring-indigo-500/25 -translate-y-0.5'
                  : 'bg-white/90 dark:bg-[#0f172a]/70 backdrop-blur-sm border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-[#0f172a]/95 hover:-translate-y-0.5 text-slate-800 dark:text-slate-200 shadow-sm'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {item.type}
              </div>
              <div className="text-xs sm:text-[13px] font-semibold leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                {item.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
