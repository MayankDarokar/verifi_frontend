import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function StaleInputAlert({ onRerun }) {
  return (
    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
            Input Modified Since Last Analysis
          </h4>
          <p className="text-xs text-amber-800 dark:text-slate-300 mt-0.5">
            The submitted content was changed. Run the investigation again to evaluate the updated parameters.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRerun}
        className="self-start sm:self-center shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Run Investigation</span>
      </button>
    </div>
  );
}
