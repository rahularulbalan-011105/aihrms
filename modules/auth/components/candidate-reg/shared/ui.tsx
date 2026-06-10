"use client";

import { useState } from "react";
import type React from "react";
import { TrashIcon, SpinnerIcon } from "./icons";

/* ── Tooltip ── */
export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-ink-900 text-white text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity z-30">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[4px] border-transparent border-t-ink-900" />
      </div>
    </div>
  );
}

/* ── Confirm Dialog ── */
export function ConfirmDialog({
  label,
  onConfirm,
  onCancel,
}: {
  label: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const handleConfirm = async () => { setDeleting(true); await onConfirm(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-500">
            <TrashIcon />
          </div>
          <div>
            <div className="font-display font-bold text-[15px] text-ink-900">Confirm Delete</div>
            <div className="text-[13px] text-ink-500 mt-1">{label}</div>
            <div className="text-[12px] text-ink-400 mt-0.5">This action cannot be undone.</div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" onClick={onCancel} disabled={deleting}
            className="px-5 py-2.5 rounded-xl border border-ink-200 text-[13px] font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-50 transition">
            Cancel
          </button>
          <button type="button" onClick={handleConfirm} disabled={deleting}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold flex items-center gap-2 disabled:opacity-60 transition">
            {deleting ? <><SpinnerIcon /> Deleting…</> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Section Header ── */
export function SectionHeader({
  icon,
  title,
  addLabel,
  onAdd,
}: {
  icon: React.ReactNode;
  title: string;
  addLabel: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="font-display font-bold text-[15px] text-ink-900">{title}</span>
      </div>
      <button type="button" onClick={onAdd}
        className="text-[13px] font-semibold text-brand-600 hover:text-brand-700 transition">
        {addLabel}
      </button>
    </div>
  );
}

/* ── Empty State ── */
export function EmptyState({
  icon,
  message,
  hint,
}: {
  icon: React.ReactNode;
  message: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink-200 bg-white py-3 flex flex-col items-center justify-center gap-1 text-center">
      <div className="text-ink-300">{icon}</div>
      <div className="font-semibold text-[13px] text-ink-500">{message}</div>
      <div className="text-[12px] text-ink-400">{hint}</div>
    </div>
  );
}

/* ── Dots Indicator ── */
export function DotsIndicator({ filled, size = 9 }: { filled: number; size?: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}
          className={`rounded-full shrink-0 ${i < filled ? "bg-brand-600" : "bg-ink-200"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

/* ── Select Field ── */
export function SelectField({
  label,
  required,
  value,
  onChange,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-ink-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-ink-200 text-[14px] bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition appearance-none">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
