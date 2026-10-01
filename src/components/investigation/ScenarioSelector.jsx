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
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
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
            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear to Custom Input</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SCENARIO_ITEMS.map((item) => {
          const isSelected = selectedScenarioId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectScenario(item.id)}
              className={`text-left p-3 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-white shadow-sm ring-1 ring-indigo-500/20'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                {item.type}
              </div>
              <div className="text-xs font-semibold leading-snug line-clamp-1">
                {item.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
