"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CTABanner from "@/components/marketing/CTABanner";

type Category = "all" | "general" | "seekers" | "agencies" | "security" | "pricing" | "integrations" | "technical";
type Q = { q: string; a: string; cat: Exclude<Category, "all"> };

const QUESTIONS: Q[] = [
  { q: "What is AI HRMS?", a: "AI HRMS is an AI-powered recruitment platform that helps job seekers find the right opportunities and helps agencies streamline hiring with AI-driven matching, automation, and insights.", cat: "general" },
  { q: "How does AI matching work?", a: "Our AI analyzes resumes, job descriptions, skills, experience, and intent — then ranks candidates by relevance using semantic similarity and contextual signals, not just keyword overlap.", cat: "general" },
  { q: "Is AI HRMS suitable for both job seekers and recruitment agencies?", a: "Yes. Job seekers get smart matching, auto-apply, and fake-job detection. Agencies get bulk parsing, semantic candidate search, screening automation, and hiring analytics — all from the same platform.", cat: "general" },
  { q: "Can I try AI HRMS before subscribing?", a: "Absolutely — every plan includes a free trial. You can also book a live demo with our team to see how AI HRMS fits your hiring workflow before you commit.", cat: "pricing" },
  { q: "How secure is my data on AI HRMS?", a: "We use bank-grade encryption (in transit and at rest), role-based access controls, regular security audits, and store your data in compliant regional data centers. Sensitive resume data is never shared with third parties.", cat: "security" },
  { q: "What integrations does AI HRMS support?", a: "AI HRMS integrates with leading job boards, ATS systems, calendar tools, and communication platforms. Custom integrations are available on Business and Enterprise plans.", cat: "integrations" },
  { q: "How does pricing and billing work?", a: "Plans are billed annually for the best rate, with monthly options on the Professional tier and above. Enterprise pricing is custom and tailored to your team size, volume, and integration needs.", cat: "pricing" },
  { q: "Can job seekers create alerts for specific roles?", a: "Yes — set keyword, location, and salary filters; AI HRMS surfaces matching roles in real time.", cat: "seekers" },
  { q: "Do you support resume builder for job seekers?", a: "Yes, with AI-assisted suggestions that align your profile to roles you're targeting.", cat: "seekers" },
  { q: "How do agencies manage team permissions?", a: "Granular roles let you scope users to specific jobs, candidates, or analytics views.", cat: "agencies" },
  { q: "Is my data deletable on request?", a: "Yes — you can request full deletion of your account and associated data at any time.", cat: "security" },
  { q: "Do you provide an API?", a: "Yes — API access is included on Business and Enterprise plans.", cat: "technical" },
];

const CATEGORIES: { id: Category; title: string; icon: string }[] = [
  { id: "all", title: "All Questions", icon: "▦" }, { id: "general", title: "General", icon: "ⓘ" },
  { id: "seekers", title: "For Job Seekers", icon: "👤" }, { id: "agencies", title: "For Agencies / Recruiters", icon: "👥" },
  { id: "security", title: "Security & Privacy", icon: "🛡" }, { id: "pricing", title: "Pricing & Billing", icon: "💳" },
  { id: "integrations", title: "Integrations", icon: "⚙" }, { id: "technical", title: "Technical", icon: "✦" },
];

const COUNTS: Record<Category, number> = { all: 12, general: 3, seekers: 3, agencies: 3, security: 2, pricing: 2, integrations: 2, technical: 1 };

export default function FAQPage() {
  const [cat, setCat] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filtered = useMemo(() => {
    let list = QUESTIONS;
    if (cat !== "all") list = list.filter((q) => q.cat === cat);
    if (search.trim()) { const t = search.trim().toLowerCase(); list = list.filter((q) => q.q.toLowerCase().includes(t) || q.a.toLowerCase().includes(t)); }
    return list;
  }, [cat, search]);

  return (
    <>
      <section className="page-tint">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 pt-14 lg:pt-20 pb-10 text-center">
          <Pill>Everything You Need to Know</Pill>
          <h1 className="mt-5 font-display text-[42px] lg:text-[56px] leading-[1.05] font-extrabold tracking-tight">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="mt-5 text-ink-500 text-[15px] max-w-[640px] mx-auto leading-relaxed">
            Find answers to common questions about AI HRMS, our features, pricing, security, and more.
          </p>
          <div className="mt-7 max-w-[640px] mx-auto card flex items-center gap-3 px-4 py-3">
            <span className="text-ink-400">🔎</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for answers..." className="flex-1 outline-none text-[14px] text-ink-700 placeholder:text-ink-400" />
            <button className="w-9 h-9 rounded-md flex items-center justify-center text-white" style={{ background: "var(--gradient-brand)" }} aria-label="Search">🔎</button>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-10">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-[300px_1fr] gap-6">
          <aside>
            <div className="card p-5">
              <div className="font-display font-extrabold text-[15px] mb-3">Browse by Category</div>
              <ul className="space-y-1">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => setCat(c.id)} className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-[13px] transition ${cat === c.id ? "bg-brand-50 text-brand-700 font-semibold" : "text-ink-700 hover:bg-ink-100"}`}>
                      <span className="flex items-center gap-2"><span className={cat === c.id ? "text-brand-600" : "text-ink-400"}>{c.icon}</span>{c.title}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${cat === c.id ? "bg-brand-100 text-brand-700" : "bg-ink-100 text-ink-500"}`}>{COUNTS[c.id]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5 mt-4 bg-brand-50 border-brand-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white text-brand-600 flex items-center justify-center text-[16px]">🎧</div>
                <div className="flex-1"><div className="font-display font-bold text-[14px]">Still have questions?</div><div className="text-[11px] text-ink-500">Our support team is here to help you.</div></div>
              </div>
              <Link href="/contact" className="mt-4 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-brand-300 text-brand-700 text-[13px] font-semibold bg-white hover:bg-brand-50 transition">
                Contact Support <ArrowIcon />
              </Link>
            </div>
          </aside>

          <div className="space-y-3">
            {filtered.length === 0 && <div className="card p-6 text-center text-ink-500 text-[13px]">No questions match your search. Try a different keyword or category.</div>}
            {filtered.map((q, i) => {
              const open = openIdx === i;
              return (
                <div key={`${q.q}-${i}`} className={`rounded-xl border transition ${open ? "border-brand-300 bg-brand-50/30" : "border-ink-200 bg-white"}`}>
                  <button type="button" onClick={() => setOpenIdx(open ? null : i)} className="w-full flex items-center gap-3 px-5 py-4 text-left">
                    <span className={`font-semibold text-[14px] w-7 ${open ? "text-brand-600" : "text-ink-400"}`}>{i + 1}.</span>
                    <span className={`flex-1 font-semibold text-[15px] ${open ? "text-brand-700" : "text-ink-900"}`}>{q.q}</span>
                    <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-[14px] transition ${open ? "border-brand-300 text-brand-600" : "border-ink-200 text-ink-500"}`}>{open ? "−" : "+"}</span>
                  </button>
                  {open && <div className="px-5 pb-5 pl-[60px] text-[13.5px] text-ink-500 leading-relaxed">{q.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Can't find what you're looking for?"
        description="Our support team is available to help you with anything you need to know about AI HRMS."
        primary={{ label: "Contact Support", href: "/contact", icon: "arrow" }}
        secondary={{ label: "Book a Live Demo", href: "/book-demo", icon: "play" }}
      />
      <div className="h-16" />
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[12px] font-semibold border border-brand-100"><span className="text-brand-500">ⓘ</span>{children}</span>;
}
function ArrowIcon() {
  return <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
