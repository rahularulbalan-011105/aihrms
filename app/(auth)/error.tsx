"use client";

import Link from "next/link";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8 bg-[#F8F7FF]">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="font-display font-bold text-[16px] text-ink-900 mb-1">Something went wrong</h2>
        <p className="text-[13.5px] text-ink-500 max-w-[320px]">
          {error.message || "An unexpected error occurred. Your progress has been preserved where possible."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-xl text-white text-[14px] font-semibold hover:opacity-95 transition"
          style={{ background: "var(--gradient-brand)" }}
        >
          Try again
        </button>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-xl border border-ink-200 text-[14px] font-semibold text-ink-700 hover:bg-ink-50 transition"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
