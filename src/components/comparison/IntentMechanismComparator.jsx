import React from 'react';
import { ArrowRightLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function IntentMechanismComparator({ result }) {
  const { intent, mechanism, mismatch } = result;

  return (
    <div className="rounded-2xl bg-white/95 dark:bg-[#0f172a]/90 backdrop-blur-md border border-slate-200/90 dark:border-white/10 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_-6px_rgba(0,0,0,0.5)] mb-6 sm:mb-8 transition-all">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Intent vs Mechanism Comparison</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-verifying the stated purpose of the interaction against the actual payment transaction triggered.
          </p>
        </div>

        <div className="text-xs">
          {mismatch.detected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-bold uppercase text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Conflict Detected</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Aligned</span>
            </span>
          )}
        </div>
      </div>

      {/* Structured Comparison Grid (2 columns on md/desktop, single column stack on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
        {/* Left: What the Message Claims */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 dark:bg-[#090d16]/80 border border-slate-200/80 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Claimed Stated Intent
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
              {intent.label.replace(/_/g, ' ')}
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {intent.summary}
            </p>
          </div>
          {intent.stated_amount && (
            <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Claimed Receipt:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{intent.stated_amount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
        </div>

        {/* Right: What the Mechanism Executes */}
        <div className={`p-4 sm:p-5 rounded-xl border flex flex-col justify-between ${
          mismatch.detected
            ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200/90 dark:border-red-900/40'
            : 'bg-slate-50/80 dark:bg-[#090d16]/80 border-slate-200/80 dark:border-white/10'
        }`}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Observed Technical Execution
            </div>
            <div className={`text-sm sm:text-base font-bold mb-2 ${
              mismatch.detected ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'
            }`}>
              {mechanism.label.replace(/_/g, ' ')}
            </div>
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              {mechanism.summary}
            </p>
          </div>
          {(mechanism.actual_amount || mechanism.target_upi_id || mechanism.target_url) && (
            <div className="pt-2.5 border-t border-slate-200/80 dark:border-white/10 space-y-1.5 text-xs">
              {mechanism.actual_amount && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Actual Outbound Debit:</span>
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    ₹{mechanism.actual_amount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              {mechanism.target_upi_id && (
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Target UPI ID:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{mechanism.target_upi_id}</span>
                </div>
              )}
              {mechanism.target_url && (
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  <span>Destination:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold truncate max-w-[200px]">{mechanism.target_url}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mismatch Finding Summary */}
      <div className={`p-4 rounded-xl border text-xs sm:text-[13px] leading-relaxed ${
        mismatch.detected
          ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200/90 dark:border-red-800/40 text-red-900 dark:text-red-200'
          : 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/90 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
      }`}>
        <span className="font-bold mr-1.5">
          {mismatch.detected ? 'Analysis Finding:' : 'Verification Result:'}
        </span>
        <span>{mismatch.explanation}</span>
      </div>
    </div>
  );
}
