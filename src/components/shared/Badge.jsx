import React from 'react';

const VARIANT_MAP = {
  critical: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-500',
  },
  high: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
  },
  suspicious: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
  },
  clean: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  info: {
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    dot: 'bg-sky-500',
  },
  neutral: {
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
  },
};

export function Badge({ variant = 'info', label, className = '', showDot = true, icon: Icon }) {
  const v = VARIANT_MAP[variant.toLowerCase()] || VARIANT_MAP.info;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border backdrop-blur-md ${v.bg} ${v.border} ${v.text} ${className}`}
    >
      {showDot && !Icon && <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
    </span>
  );
}
