"use client";

import { useState } from "react";
import Link from "next/link";
import { WrenchIcon, ArrowLeftIcon } from "./icons";

type Variant = "pricing" | "integrations";

interface Config {
  eyebrow: string;
  progress: number;
  illustration: React.ReactNode;
}

const CONFIG: Record<Variant, Config> = {
  pricing: { eyebrow: "Pricing", progress: 70, illustration: <PricingArt /> },
  integrations: { eyebrow: "Integrations", progress: 55, illustration: <IntegrationsArt /> },
};

export default function ComingSoon({ variant }: { variant: Variant }) {
  const cfg = CONFIG[variant];
  const [notified, setNotified] = useState(false);

  return (
    <section className="page-tint min-h-[calc(100svh-160px)] flex items-center justify-center px-6 py-8">
      <div className="card w-full max-w-[560px] p-8 sm:p-10 text-center">
        {/* Illustration */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
          {cfg.illustration}
        </div>

        {/* Eyebrow */}
        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          {cfg.eyebrow}
        </span>

        {/* Heading */}
        <h1 className="mt-4 font-display text-[34px] lg:text-[40px] font-extrabold tracking-tight leading-[1.1]">
          <span className="gradient-text">Coming Soon</span>
        </h1>
        <p className="mt-3 text-ink-500 text-[14px] lg:text-[15px] max-w-[420px] mx-auto leading-[1.7]">
          We&apos;re working on this feature and it will be available soon.
        </p>

        {/* Under-construction progress */}
        <div className="mt-7 text-left">
          <div className="flex items-center justify-between text-[12px] mb-1.5">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink-700">
              <WrenchIcon /> Under construction
            </span>
            <span className="font-semibold text-brand-600">{cfg.progress}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full rounded-full btn-gradient-brand transition-[width] duration-700"
              style={{ width: `${cfg.progress}%` }}
            />
          </div>
        </div>

        {/* Notify Me (UI only) */}
        {notified ? (
          <div className="mt-7 inline-flex items-center gap-2 text-[13.5px] font-semibold text-green-700 bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
            <CheckIcon /> Thanks! We&apos;ll let you know when it&apos;s ready.
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setNotified(true); }}
            className="mt-7 flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 min-w-0 px-4 py-3 rounded-xl border border-ink-200 text-[14px] text-ink-700 bg-white outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition placeholder:text-ink-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white text-[14px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Notify Me
            </button>
          </form>
        )}

        {/* Back link */}
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink-500 hover:text-ink-800 transition-colors">
          <ArrowLeftIcon /> Back to Home
        </Link>
      </div>
    </section>
  );
}

/* ─── Per-page illustrations ─────────────────────────────────────────────────── */
function PricingArt() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.4 7.4a2 2 0 0 1 0 2.4z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
function IntegrationsArt() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 7h2a2 2 0 0 1 2 2v2m-4 4H8a2 2 0 0 1-2-2V9" />
      <rect x="3" y="4" width="6" height="6" rx="1.5" />
      <rect x="15" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
}
