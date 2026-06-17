"use client";

import JobStepper from "../shared/JobStepper";
import type { JobDraft, CompensationData } from "../shared/types";

interface Props {
  data: JobDraft;
  onChange: (d: JobDraft) => void;
  onBack: () => void;
  onContinue: () => void;
}

const SALARY_TYPES = [
  { key: "Fixed CTC",    icon: <RupeeIcon /> },
  { key: "Salary Range", icon: <BarsIcon /> },
] as const;

export default function Step3Compensation({ data, onChange, onBack, onContinue }: Props) {
  const c = data.compensation;
  const set = <K extends keyof CompensationData>(k: K, v: CompensationData[K]) =>
    onChange({ ...data, compensation: { ...c, [k]: v } });

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <button onClick={onBack} className="px-3.5 py-2 rounded-lg border border-ink-200 text-ink-700 text-[12.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-1.5">
          <ArrowLeft /> Back
        </button>
        <div className="text-center flex-1">
          <h1 className="font-display text-[22px] font-extrabold">Post a New Job</h1>
          <p className="text-ink-500 text-[12.5px]">Define the compensation and benefits for this role.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onContinue} className="px-4 py-2.5 rounded-lg text-white text-[13px] font-semibold inline-flex items-center gap-2" style={{ background: "var(--gradient-brand)" }}>
            Next: Review <ArrowRight />
          </button>
        </div>
      </div>

      {/* IMPORTANT: 5-step stepper (the mockup was missing Preferences — this restores it) */}
      <div className="mb-6"><JobStepper current={3} /></div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          {/* Compensation Details */}
          <Card>
            <Header icon={<RupeeIcon />} title="Compensation Details" subtitle="Provide salary information for this position." />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
              <div>
                <Label required>Salary Type</Label>
                <p className="text-[11.5px] text-ink-500 mb-2">How do you want to structure the compensation?</p>
                <div className="grid grid-cols-2 gap-2">
                  {SALARY_TYPES.map((t) => (
                    <button key={t.key} onClick={() => set("salaryType", t.key)}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border text-[12.5px] font-semibold transition ${
                        c.salaryType === t.key ? "border-brand-500 bg-brand-50 text-brand-700" : "border-ink-200 text-ink-700 hover:border-ink-300"
                      }`}>
                      {t.icon} {t.key}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label required>Currency</Label>
                <p className="text-[11.5px] text-ink-500 mb-2">Select the currency for compensation</p>
                <Select value={c.currency} onChange={(v) => set("currency", v)}
                  options={["INR (₹) – Indian Rupee", "USD ($) – US Dollar", "EUR (€) – Euro", "GBP (£) – British Pound"]} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 items-end">
              {c.salaryType === "Salary Range" ? (
                <div>
                  <Label required>Salary Range</Label>
                  <p className="text-[11.5px] text-ink-500 mb-2">Enter the minimum and maximum annual salary</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[11px] text-ink-500 mb-1">Min</span>
                      <RupeeInput value={c.salaryMin} onChange={(v) => set("salaryMin", v)} />
                    </div>
                    <div>
                      <span className="block text-[11px] text-ink-500 mb-1">Max</span>
                      <RupeeInput value={c.salaryMax} onChange={(v) => set("salaryMax", v)} />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label required>Annual CTC</Label>
                  <p className="text-[11.5px] text-ink-500 mb-2">Enter the total annual cost to company</p>
                  <RupeeInput value={c.annualCtc} onChange={(v) => set("annualCtc", v)} />
                </div>
              )}
              <div className="bg-ink-100/40 border border-ink-100 rounded-lg p-3 flex items-center gap-6">
                <div className="flex-1">
                  <div className="text-[11.5px] text-ink-500 mb-0.5">Fixed Pay</div>
                  <div className="text-[14px] font-bold text-green-600">₹ 10,00,000 <span className="text-[11px] font-semibold opacity-70">(83.33%)</span></div>
                </div>
                <div className="flex-1">
                  <div className="text-[11.5px] text-ink-500 mb-0.5">Variable Pay</div>
                  <div className="text-[14px] font-bold text-brand-700">₹ 2,00,000 <span className="text-[11px] font-semibold opacity-70">(16.67%)</span></div>
                </div>
                <button className="text-brand-700 hover:bg-white rounded-md w-9 h-9 grid place-items-center"><EditIcon /></button>
              </div>
            </div>
          </Card>

          {/* Salary Break-up */}
          <Card>
            <div className="mb-4">
              <h2 className="font-display text-[16px] font-extrabold">Salary Break-up <span className="text-[11.5px] font-normal text-ink-500">(Optional)</span></h2>
              <p className="text-ink-500 text-[12.5px]">Provide a detailed break-up of the compensation structure.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <PercentInput label="Basic Pay"        value={c.basicPay}        onChange={(v) => set("basicPay", v)}        pct="50%" />
              <PercentInput label="HRA"              value={c.hra}             onChange={(v) => set("hra", v)}             pct="20%" />
              <PercentInput label="Special Allowance" value={c.specialAllowance} onChange={(v) => set("specialAllowance", v)} pct="13.33%" />
              <PercentInput label="Other Allowances" value={c.otherAllowances} onChange={(v) => set("otherAllowances", v)} pct="0%" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <PercentInput label={<>Annual Bonus / Variable Pay <InfoIcon /></>} subLabel="Performance based incentive or bonus" value={c.variablePay} onChange={(v) => set("variablePay", v)} pct="16.67%" />
              <PercentInput label={<>Joining Bonus <span className="text-[11px] font-normal text-ink-500">(Optional)</span></>} subLabel="One-time joining bonus for selected candidate" value={c.joiningBonus} onChange={(v) => set("joiningBonus", v)} />
            </div>
          </Card>

          <div className="flex items-center pt-4">
            <button onClick={onBack} className="px-5 py-2.5 rounded-lg border border-ink-200 text-ink-700 text-[13.5px] font-semibold hover:bg-ink-100 transition inline-flex items-center gap-2">
              <ArrowLeft /> Back
            </button>
          </div>
        </div>

        {/* RIGHT — custom Compensation Summary rail */}
        <aside className="w-full flex flex-col gap-3">
          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] mb-3">Compensation Summary</h3>
            <div className="rounded-lg bg-brand-50/60 px-3.5 py-3 border border-brand-100 mb-3">
              <div className="text-[18px] font-extrabold text-ink-900">₹ {c.annualCtc || "0"} <span className="text-[12px] font-medium text-ink-500">/ Annual CTC</span></div>
              <span className="mt-1 inline-block text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">{c.salaryType}</span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] py-1.5">
              <span className="text-ink-700">Fixed Pay</span><span className="text-green-600 font-bold">₹ 10,00,000 <span className="opacity-70">(83.33%)</span></span>
            </div>
            <div className="flex items-center justify-between text-[12.5px] py-1.5">
              <span className="text-ink-700">Variable Pay</span><span className="text-brand-700 font-bold">₹ 2,00,000 <span className="opacity-70">(16.67%)</span></span>
            </div>
            <div className="mt-3 pt-3 border-t border-ink-100">
              <div className="text-[12px] font-bold text-ink-500 mb-1">Currency</div>
              <div className="text-[12.5px] font-semibold">{c.currency}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-ink-100">
              <div className="text-[12px] font-bold text-ink-500 mb-2">Additional Benefits</div>
              <div className="flex flex-wrap gap-1.5">
                {c.benefits.slice(0, 3).map((b) => <span key={b} className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 grid place-items-center text-[14px]">●</span>)}
                {c.benefits.length > 3 && <span className="w-8 h-8 rounded-full bg-ink-100 text-ink-700 grid place-items-center text-[11px] font-bold">+{c.benefits.length - 3}</span>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-100 p-4 bg-white">
            <h3 className="font-display font-bold text-[14px] mb-2 inline-flex items-center gap-1.5"><BulbIcon /> Compensation Tips</h3>
            <ul className="space-y-1.5">
              {[
                "Ensure your CTC is competitive in the market to attract top talent.",
                "Clearly communicate both fixed and variable components.",
                "Adding additional benefits increases candidate interest.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-[12px] text-ink-700"><span className="mt-1 text-green-600">✓</span><span>{t}</span></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Primitives ─── */
function Card({ children }: { children: React.ReactNode }) { return <section className="bg-white border border-ink-100 rounded-xl p-5">{children}</section>; }
function Header({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <span className="w-9 h-9 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center">{icon}</span>
      <div className="leading-tight">
        <h2 className="font-display text-[16px] font-extrabold">{title}</h2>
        {subtitle && <p className="text-ink-500 text-[12.5px] mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) { return <label className="block text-[12px] font-semibold text-ink-700 mb-1.5">{children} {required && <span className="text-red-500">*</span>}</label>; }
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 pr-9 py-2.5 rounded-lg border border-ink-200 text-[13.5px] bg-white focus:outline-none focus:border-brand-400 appearance-none">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">▾</span>
    </div>
  );
}
function RupeeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-semibold">₹</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="0"
        className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400" />
    </div>
  );
}
function PercentInput({ label, subLabel, value, onChange, pct }: { label: React.ReactNode; subLabel?: string; value: string; onChange: (v: string) => void; pct?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {subLabel && <p className="text-[11px] text-ink-500 -mt-1 mb-1.5">{subLabel}</p>}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 font-semibold">₹</span>
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="0"
          className="w-full pl-8 pr-16 py-2.5 rounded-lg border border-ink-200 text-[13.5px] focus:outline-none focus:border-brand-400" />
        {pct && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11.5px] text-ink-500 font-semibold">{pct}</span>}
      </div>
    </div>
  );
}

/* Icons */
function RupeeIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 4h12M6 8h12M9 4c4 0 6 3 6 6s-2 6-6 6h-3l6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function BarsIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="14" width="4" height="7" fill="currentColor"/><rect x="10" y="9" width="4" height="12" fill="currentColor"/><rect x="17" y="4" width="4" height="17" fill="currentColor"/></svg>); }
function HandshakeIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 12l5-5 4 4 4-4 5 5-5 5-4-4-4 4-5-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function HeartIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-9-9C1.5 7.5 4.5 3 9 5c1.5.7 2.5 2 3 3 .5-1 1.5-2.3 3-3 4.5-2 7.5 2.5 6 7-2 4.5-9 9-9 9z" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function PiggyIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12a7 7 0 0 1 7-7c4 0 7 3 7 7 0 1-.3 2-.8 3l1.8 3-3-1c-1.4.6-3 1-5 1-4 0-7-3-7-7z" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function BadgeIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth="1.6"/><path d="M9 15l-2 6 5-3 5 3-2-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function StarIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function CoinIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M9 9h4a2 2 0 0 1 0 4H9m4 4H9M11 7v2M11 15v2" stroke="currentColor" strokeWidth="1.6"/></svg>); }
function CarIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 16v-3l2-5h12l2 5v3M6 16h12M7 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function FoodIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 7h16l-1 13H5L4 7zM7 7V5a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function PlusIcon() { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>); }
function EditIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M16 4l4 4-11 11H5v-4L16 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
function InfoIcon() { return (<svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="inline ml-0.5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>); }
function BulbIcon() { return (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3 11c1 .6 1.5 1.5 1.5 2.5V17h3v-.5c0-1 .5-1.9 1.5-2.5A6 6 0 0 0 12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>); }
function ArrowRight() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L8 3m5 5l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ArrowLeft() { return (<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8H3m0 0l5-5m-5 5l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function DraftIcon() { return (<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>); }
