import React from 'react';
import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#090d16] py-8 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>VeriFi — Evidence-Driven Financial Safety Agent</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Evaluated against observable threat indicators and payment specifications. Always verify unexpected financial requests with official banking institutions or report immediately to <b>1930</b>.
        </p>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 font-medium">
          Bharat Agentic 2026 • FinTech & Financial Services Safety
        </div>
      </div>
    </footer>
  );
}
