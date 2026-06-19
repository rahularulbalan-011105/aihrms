"use client";

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * Controlled form primitives shared across the jobs forms (EditJobPage, …).
 * ───────────────────────────────────────────────────────────────────────────── */

export function SectionHeader({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-[12px] font-bold grid place-items-center">{num}</span>
      <h2 className="font-display text-[16px] font-extrabold text-ink-900">{title}</h2>
    </div>
  );
}

export function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">
      {children}{required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export function Field({ label, required, value, onChange, type = "text", icon }: {
  label?: string; required?: boolean; value: string; onChange: (v: string) => void; type?: string; icon?: React.ReactNode;
}) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full ${icon ? "pl-9" : "pl-3"} pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-800 outline-none focus:border-brand-400`} />
      </div>
    </div>
  );
}

export function Select({ label, required, options, value, onChange, srLabel }: {
  label?: string; required?: boolean; options: string[]; value: string; onChange: (v: string) => void; srLabel?: string;
}) {
  // Surface the stored value even when it isn't one of the preset options.
  const allOptions = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <div>
      {label ? <Label required={required}>{label}</Label> : srLabel ? <span className="sr-only">{srLabel}</span> : null}
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={srLabel || label} className="appearance-none w-full pl-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] text-ink-800 bg-white outline-none focus:border-brand-400 cursor-pointer">
          <option value="">Select…</option>
          {allOptions.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none text-[10px]">▾</span>
      </div>
    </div>
  );
}

/** Tag input — Enter (or blur) commits the typed value; chips have remove buttons. */
export function ChipField({ items, onRemove, onAdd, placeholder }: {
  items: string[]; onRemove: (v: string) => void; onAdd: (v: string) => void; placeholder: string;
}) {
  const [value, setValue] = useState("");
  const commit = () => {
    const trimmed = value.trim();
    if (trimmed) { onAdd(trimmed); setValue(""); }
  };
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2.5 rounded-lg border border-ink-200 min-h-[44px]">
      {items.map((it) => (
        <span key={it} className="inline-flex items-center gap-1 text-[12px] font-medium text-ink-700 bg-ink-100 px-2 py-1 rounded-md">
          {it}
          <button type="button" onClick={() => onRemove(it)} className="text-ink-400 hover:text-red-500" aria-label={`Remove ${it}`}>✕</button>
        </span>
      ))}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        onBlur={commit}
        placeholder={placeholder}
        className="flex-1 min-w-[120px] bg-transparent text-[12px] text-ink-700 placeholder:text-ink-400 outline-none"
      />
    </div>
  );
}
