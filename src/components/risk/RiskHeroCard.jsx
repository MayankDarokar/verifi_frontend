import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, AlertOctagon, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

const TIER_STYLES = {
  CRITICAL: {
    badge: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800/60',
    scoreColor: 'text-red-600 dark:text-red-400',
    border: 'border-l-red-600 dark:border-l-red-500',
    icon: AlertOctagon,
    label: 'CRITICAL RISK',
  },
  HIGH: {
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800/60',
    scoreColor: 'text-orange-600 dark:text-orange-400',
    border: 'border-l-orange-600 dark:border-l-orange-500',
    icon: AlertTriangle,
    label: 'HIGH RISK',
  },
  SUSPICIOUS: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    scoreColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-l-amber-600 dark:border-l-amber-500',
    icon: AlertCircle,
    label: 'SUSPICIOUS ACTIVITY',
  },
  NO_STRONG_INDICATORS: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    scoreColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-l-emerald-600 dark:border-l-emerald-500',
    icon: CheckCircle2,
    label: 'NO STRONG INDICATORS',
  },
};

export function RiskHeroCard({ result }) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const tier = TIER_STYLES[result.level] || TIER_STYLES.SUSPICIOUS;
  const Icon = tier.icon;

  return (
    <div className={`rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 border-l-4 ${tier.border} p-6 sm:p-7 shadow-sm mb-6 transition-colors`}>
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${tier.badge}`}>
            <Icon className="w-3.5 h-3.5" />
            <span>{tier.label}</span>
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Evidence-Based Risk Assessment
        </span>
      </div>

      {/* Main Score & Primary Conclusion */}
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6 mb-4">
        {/* Score Number */}
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight leading-none ${tier.scoreColor}`}>
            {result.score}
          </span>
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 font-mono">
            / 100
          </span>
        </div>

        {/* Narrative Finding */}
        <div className="flex-1">
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
            {result.explanation}
          </p>
        </div>
      </div>

      {/* Risk Factors Breakdown Expander */}
      {result.scoreBreakdown && result.scoreBreakdown.length > 0 && (
        <div className="border-t border-slate-100 dark:border-white/10 pt-3.5 mt-4">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Risk Factors Breakdown ({result.scoreBreakdown.length} detected)</span>
            </div>
            {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showBreakdown && (
            <div className="mt-3 space-y-1.5 pt-1">
              {result.scoreBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-[#090d16] border border-slate-200/70 dark:border-white/5 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.signal}
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded text-[11px]">
                    +{item.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
