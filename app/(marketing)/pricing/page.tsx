"use client";

import Link from "next/link";
import { useState } from "react";
import CTABanner from "@/components/marketing/CTABanner";

type Tier = {
  name: string; tagline: string; price: string; cadence?: string; billing?: string;
  features: string[]; cta: { label: string; href: string }; highlight?: boolean;
  toneAccent: "purple" | "green" | "orange" | "blue"; iconBg: string; icon: string;
};

const AGENCY_TIERS: Tier[] = [
  { name: "Starter", tagline: "Perfect for small teams", price: "₹2,999", cadence: "/month", billing: "Billed annually", features: ["Up to 3 Users", "100 Resume Parses / month", "AI Candidate Matching", "Job Posting (10 / month)", "Basic Analytics", "Email Support"], cta: { label: "Get Started", href: "/signup?plan=starter" }, toneAccent: "purple", iconBg: "bg-brand-50", icon: "✈" },
  { name: "Professional", tagline: "Best for growing agencies", price: "₹7,999", cadence: "/month", billing: "Billed annually", features: ["Up to 15 Users", "500 Resume Parses / month", "All AI Capabilities", "Job Posting (Unlimited)", "Advanced Analytics & Reports", "Team Collaboration", "Priority Support"], cta: { label: "Get Started", href: "/signup?plan=pro" }, highlight: true, toneAccent: "purple", iconBg: "bg-brand-100", icon: "♛" },
  { name: "Business", tagline: "For established agencies", price: "₹15,999", cadence: "/month", billing: "Billed annually", features: ["Up to 50 Users", "2000 Resume Parses / month", "All AI Capabilities", "Job Posting (Unlimited)", "Advanced Analytics & Reports", "Team Collaboration", "Phone & Priority Support"], cta: { label: "Get Started", href: "/signup?plan=business" }, toneAccent: "green", iconBg: "bg-green-50", icon: "💼" },
  { name: "Enterprise", tagline: "For large organizations", price: "Custom Pricing", billing: "Tailored to your needs", features: ["Unlimited Users", "Unlimited Resume Parses", "All AI Capabilities", "Custom Integrations", "Advanced Security", "Dedicated Account Manager", "SLA & Onboarding Support"], cta: { label: "Contact Sales", href: "/contact-sales" }, toneAccent: "orange", iconBg: "bg-orange-50", icon: "🏢" },
];

const COMPARE_ROWS = [
  { feature: "AI Job Matching",    starter: "Up to 10 / month", pro: "Up to 100 / month", biz: "Up to 500 / month", ent: "Unlimited" },
  { feature: "AI Resume Parsing",  starter: "100 / month",       pro: "500 / month",       biz: "2000 / month",      ent: "Unlimited" },
  { feature: "Fake Job Detection", starter: "✓", pro: "✓", biz: "✓", ent: "✓" },
  { feature: "Bulk Resume Upload", starter: "✓", pro: "✓", biz: "✓", ent: "✓" },
  { feature: "Semantic Search",    starter: "—", pro: "✓", biz: "✓", ent: "✓" },
  { feature: "Team Collaboration", starter: "Up to 3 Users", pro: "Up to 15 Users", biz: "Up to 50 Users", ent: "Unlimited" },
  { feature: "Analytics & Reports",starter: "Basic", pro: "Advanced", biz: "Advanced", ent: "Advanced + Custom" },
  { feature: "API Access",         starter: "—", pro: "—", biz: "✓", ent: "✓" },
];

export default function PricingPage() {
  const [audience, setAudience] = useState<"agencies" | "seekers">("agencies");

  return (
    <>
      <section className="page-tint">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-14 lg:pt-20 pb-12 relative">
          <div className="text-center">
            <Pill>Flexible plans for every team size</Pill>
            <h1 className="mt-5 font-display text-[42px] lg:text-[54px] leading-[1.05] font-extrabold tracking-tight">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="mt-5 text-ink-500 text-[15px] max-w-[640px] mx-auto leading-relaxed">Choose the perfect plan to power your hiring with AI.</p>
          </div>

          <div className="absolute right-6 lg:right-10 top-16 lg:top-20 hidden md:flex items-center gap-3 card px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center text-[16px]">🛡</div>
            <div className="leading-tight">
              <div className="text-[12px] font-bold">14-Day Money Back Guarantee</div>
              <div className="text-[10px] text-ink-500">No questions asked</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1 rounded-xl border border-ink-200 bg-white">
              <ToggleBtn active={audience === "agencies"} onClick={() => setAudience("agencies")}>🏢 For Agencies / Recruiters</ToggleBtn>
              <ToggleBtn active={audience === "seekers"} onClick={() => setAudience("seekers")}>👤 For Job Seekers</ToggleBtn>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-4 gap-5">
          {AGENCY_TIERS.map((t) => <TierCard key={t.name} t={t} />)}
        </div>
      </section>

      <section className="px-6 lg:px-10 mt-14">
        <div className="mx-auto max-w-[1400px] card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-ink-100/50">
                <tr>
                  <th className="px-6 py-4 text-[13px] font-bold text-ink-900"><span className="inline-flex items-center gap-2">⚙ Compare Plans</span></th>
                  <th className="px-4 py-4 text-[13px] font-bold text-center text-ink-700">Starter</th>
                  <th className="px-4 py-4 text-[13px] font-bold text-center text-brand-700">Professional</th>
                  <th className="px-4 py-4 text-[13px] font-bold text-center text-green-700">Business</th>
                  <th className="px-4 py-4 text-[13px] font-bold text-center text-orange-700">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r, i) => (
                  <tr key={r.feature} className={i % 2 === 1 ? "bg-ink-100/20" : ""}>
                    <td className="px-6 py-3 text-[13px] text-ink-700 flex items-center gap-2"><FeatureGlyph name={r.feature} /> {r.feature}</td>
                    <Cell v={r.starter} /><Cell v={r.pro} highlight /><Cell v={r.biz} /><Cell v={r.ent} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CTABanner
        title="Not sure which plan is right for you?"
        description="Our experts are here to help you choose the best plan that fits your business needs."
        primary={{ label: "Talk to an Expert", href: "/contact", icon: "arrow" }}
        secondary={{ label: "Book Live Demo", href: "/book-demo", icon: "play" }}
      />
      <div className="h-16" />
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12px] font-semibold border border-brand-100"><span className="text-brand-500">✦</span>{children}</span>;
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`px-5 py-2.5 rounded-lg text-[13px] font-semibold transition flex items-center gap-2 ${active ? "text-white shadow-sm" : "text-ink-700 hover:bg-ink-100"}`} style={active ? { background: "var(--gradient-brand)" } : undefined}>
      {children}
    </button>
  );
}

function TierCard({ t }: { t: Tier }) {
  const containerClass = t.highlight ? "rounded-2xl p-6 relative shadow-[0_18px_50px_-20px_rgba(109,76,255,0.35)]" : "card p-6";
  const containerStyle = t.highlight ? { background: "linear-gradient(180deg, #f4f1ff 0%, #ffffff 100%)", border: "2px solid #6D4CFF" } : undefined;
  return (
    <div className={containerClass} style={containerStyle}>
      {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-full" style={{ background: "var(--gradient-brand)" }}>Most Popular</div>}
      <div className={`w-12 h-12 rounded-full ${t.iconBg} flex items-center justify-center text-[18px] mb-4`}>{t.icon}</div>
      <div className="font-display text-[18px] font-extrabold">{t.name}</div>
      <div className="text-ink-500 text-[12px] mb-4">{t.tagline}</div>
      <div className="font-display text-[32px] font-extrabold leading-none">{t.price}{t.cadence && <span className="text-[14px] text-ink-500 font-semibold ml-1">{t.cadence}</span>}</div>
      <div className="text-ink-500 text-[11px] mt-1 mb-5">{t.billing}</div>
      <ul className="space-y-2 mb-6">
        {t.features.map((f) => <li key={f} className="flex items-start gap-2 text-[13px] text-ink-700"><span className="text-brand-600 mt-0.5">✓</span><span>{f}</span></li>)}
      </ul>
      <Link href={t.cta.href} className={`block text-center py-3 rounded-lg text-[14px] font-semibold transition ${t.highlight ? "text-white shadow-sm hover:opacity-95" : "border border-brand-300 text-brand-700 hover:bg-brand-50"}`} style={t.highlight ? { background: "var(--gradient-brand)" } : undefined}>
        {t.cta.label}
      </Link>
    </div>
  );
}

function Cell({ v, highlight }: { v: string; highlight?: boolean }) {
  const isCheck = v === "✓"; const isDash = v === "—";
  return (
    <td className={`px-4 py-3 text-[12.5px] text-center ${highlight ? "text-brand-700 font-semibold" : "text-ink-700"}`}>
      {isCheck ? <span className="inline-flex w-6 h-6 rounded-full bg-green-50 text-green-700 items-center justify-center">✓</span> : isDash ? <span className="text-ink-300">—</span> : v}
    </td>
  );
}

function FeatureGlyph({ name }: { name: string }) {
  const m: Record<string, string> = { "AI Job Matching": "◎", "AI Resume Parsing": "📄", "Fake Job Detection": "🛡", "Bulk Resume Upload": "📤", "Semantic Search": "🔎", "Team Collaboration": "👥", "Analytics & Reports": "📊", "API Access": "⌘" };
  return <span className="text-ink-500">{m[name] ?? "•"}</span>;
}
