"use client";

import { useRef, useState } from "react";

const TABS = ["All Candidates", "Imported", "Shortlisted", "Contacted", "Archived"] as const;
type Tab = (typeof TABS)[number];

/** Empty-state copy per tab. */
const EMPTY_COPY: Record<Tab, { heading: string; sub: string }> = {
  "All Candidates": { heading: "No Candidates Yet", sub: "Upload resumes to get started. We'll help you build your talent pipeline." },
  Imported: { heading: "No Imported Candidates", sub: "Candidates added via resume upload or bulk import will appear here." },
  Shortlisted: { heading: "No Shortlisted Candidates", sub: "Shortlist candidates from your pipeline to keep your top picks here." },
  Contacted: { heading: "No Contacted Candidates", sub: "Candidates you've reached out to via email or SMS will show up here." },
  Archived: { heading: "No Archived Candidates", sub: "Candidates you archive are kept here, out of your active pipeline." },
};

export default function CandidatesPage() {
  const [tab, setTab] = useState<Tab>("All Candidates");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const browse = () => fileInputRef.current?.click();

  return (
    <div className="px-4 py-3 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-ink-900">Candidates</h1>
          <p className="text-ink-500 text-[13.5px] mt-1">Build your talent pipeline by adding and managing candidates.</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
          <span className="text-[15px]">+</span> Add Candidate
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 flex-wrap border-b border-ink-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-2.5 text-[13px] font-semibold border-b-2 -mb-px transition-colors ${
              tab === t ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500 hover:text-ink-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Hidden file input — drop zone / buttons trigger this */}
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" multiple className="hidden" />

      <div className="mt-5 flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Main column ── */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Upload drop zone */}
          <button
            type="button"
            onClick={browse}
            className="w-full card border-2 border-dashed border-brand-200 bg-brand-50/30 hover:bg-brand-50/60 transition-colors p-10 flex flex-col items-center text-center"
          >
            <span className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 grid place-items-center mb-3"><UploadCloudIcon /></span>
            <h2 className="font-display text-[17px] font-extrabold text-ink-900">Upload Candidate Resumes</h2>
            <p className="text-[13px] text-ink-500 mt-1">
              Drag &amp; drop files here or <span className="text-brand-600 font-semibold">click to browse</span>
            </p>
            <p className="text-[12px] text-ink-400 mt-1">Upload multiple resumes at once. We&apos;ll parse and extract candidate details automatically.</p>
            <span className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-[13.5px] font-semibold btn-gradient-brand">
              Upload Resumes <ChevronDown />
            </span>
            <p className="text-[11.5px] text-ink-400 mt-4">Supports PDF, DOC, DOCX (Max 10MB each)</p>
          </button>

          {/* Filter bar */}
          <div className="card p-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 bg-ink-100/60 rounded-xl">
              <SearchIcon />
              <input type="text" placeholder="Search candidates by name, skills or email..." className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink-700 placeholder:text-ink-400 outline-none" />
            </div>
            <FilterSelect label="All Status" options={["Shortlisted", "Contacted", "Archived"]} />
            <FilterSelect label="All Skills" options={["JavaScript", "React", "Python", "Java"]} />
            <FilterSelect label="All Experience" options={["0-2 Years", "2-5 Years", "5-10 Years", "10+ Years"]} />
            <FilterSelect label="All Locations" options={["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Remote"]} />
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-200 text-[13px] font-semibold text-brand-700 hover:bg-brand-50 transition-colors">
              <FunnelIcon /> More Filters
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button className="text-[13px] font-semibold text-ink-500 hover:text-ink-800 transition-colors px-2">Clear</button>
              <button disabled className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-100 text-ink-400 text-[13px] font-semibold cursor-not-allowed">
                Actions <ChevronDown />
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="card p-12 flex flex-col items-center text-center">
            <span className="w-24 h-24 rounded-full bg-brand-50/70 text-brand-300 grid place-items-center mb-4"><ClipboardIcon /></span>
            <h2 className="font-display text-[18px] font-extrabold text-ink-900">{EMPTY_COPY[tab].heading}</h2>
            <p className="text-ink-500 text-[13px] mt-1.5 max-w-[360px] leading-relaxed">
              {EMPTY_COPY[tab].sub}
            </p>
            <button onClick={browse} className="mt-5 px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold btn-gradient-brand hover:opacity-90 transition-opacity">
              Upload Your First Resume
            </button>
          </div>
        </div>

        {/* ── Right rail ── */}
        <aside className="w-full lg:w-[340px] shrink-0 space-y-5 hidden lg:block">
          {/* Parsing & Save Options */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-[15px] text-ink-900 mb-4">Parsing &amp; Save Options</h3>
            <ul className="space-y-4">
              <RailItem icon={<MagicIcon />} title="Auto Parse Resume" desc="Extract candidate information, skills, experience and contact details automatically." />
              <RailItem icon={<EditIcon />} title="Review & Edit" desc="Review parsed data and make changes before saving to your database." />
              <RailItem icon={<SaveIcon />} title="Save Candidates" desc="Add candidates to your database and organize them for future opportunities." />
            </ul>
          </div>

          {/* Communicate with Candidates */}
          <div className="card p-5">
            <h3 className="font-display font-bold text-[15px] text-ink-900">Communicate with Candidates</h3>
            <p className="text-[12px] text-ink-500 mt-1 mb-4">Stay connected with your candidates via their preferred channels.</p>
            <ul className="space-y-1">
              <CommItem icon={<MailIcon />} title="Send Email" desc="Send personalized emails to one or multiple candidates." />
              <CommItem icon={<ChatIcon />} title="Send SMS" desc="Send SMS messages to candidates' mobile numbers." />
            </ul>
          </div>
        </aside>
      </div>

      {/* Feature strip */}
      <div className="mt-6 card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Feature icon={<UploadIcon />} title="Bulk Upload" desc="Upload multiple resumes at once and save time." />
        <Feature icon={<MagicIcon />} title="Smart Parsing" desc="Our AI extracts key information accurately." />
        <Feature icon={<ListIcon />} title="Organize & Filter" desc="Find the right candidates with powerful filters." />
        <Feature icon={<ChatIcon />} title="Engage Easily" desc="Communicate via email or SMS in one click." />
      </div>
    </div>
  );
}

/* ── Pieces ───────────────────────────────────────────────────────────── */
function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative inline-flex items-center">
      <select className="appearance-none pl-3 pr-8 py-2 bg-ink-100/60 rounded-xl text-[13px] text-ink-600 outline-none border-0 cursor-pointer" defaultValue="">
        <option value="">{label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 text-ink-400 pointer-events-none text-[10px]">▾</span>
    </div>
  );
}

function RailItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-ink-900">{title}</div>
        <div className="text-[12px] text-ink-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </li>
  );
}

function CommItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li>
      <button className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg hover:bg-ink-100 transition-colors text-left">
        <span className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 grid place-items-center shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-ink-900">{title}</div>
          <div className="text-[11.5px] text-ink-500 leading-relaxed mt-0.5">{desc}</div>
        </div>
        <span className="text-ink-300 shrink-0"><ArrowRight /></span>
      </button>
    </li>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-ink-900">{title}</div>
        <div className="text-[12px] text-ink-500 leading-relaxed mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

/* ── Icons ────────────────────────────────────────────────────────────── */
function UploadCloudIcon() { return (<svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M7 18a4 4 0 0 1-.5-7.97A6 6 0 0 1 18 9.5a3.5 3.5 0 0 1 .5 6.97" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M12 12v7M9 14.5l3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ClipboardIcon() { return (<svg width="44" height="44" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="9" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M9 4V3h3v1" stroke="currentColor" strokeWidth="1.4"/><circle cx="17.5" cy="9.5" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M14.5 16c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="currentColor" strokeWidth="1.4"/></svg>); }
function SearchIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>); }
function FunnelIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>); }
function ChevronDown() { return (<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowRight() { return (<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function MagicIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 3v4M3 5h4M19 17v4M17 19h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M13 4l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function EditIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10-10a2 2 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function SaveIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 4h11l3 3v13H5V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 4v5h7M8 14h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function MailIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
function ChatIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v11H8l-4 4V5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function UploadIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12M8 7l4-4 4 4M5 21h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ListIcon() { return (<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>); }
